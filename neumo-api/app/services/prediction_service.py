# services/prediction_service.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional, List
import torch
import torch.nn as nn
from torchvision import transforms
from PIL import Image
import io
import time
import asyncio
import os
from ..models.prediction import Prediction
from ..models.user import User
from ..schemas.prediction import PredictionCreate, PredictionUpdate
from ..utils.image_processing import process_image_for_prediction
from ..utils.model_utils import load_model, predict_image
from ..utils.aws_utils import s3_manager
from ..core.config import settings

class PredictionService:
    def __init__(self, db: AsyncSession, model_path: str = None):
        if model_path is None:
            model_path = settings.MODEL_PATH
            if not model_path:
                raise ValueError("MODEL_PATH environment variable is not set")
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            model_path = os.path.join(base_dir, os.path.normpath(model_path))
            model_path = os.path.abspath(model_path)

        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found: {model_path}")
        
        self.db = db
        self.model_path = model_path
        self.model = None
        self.model_class = 'Net'
        self.class_names = ["NORMAL", "PNEUMONIA"]
        
        # Image preprocessing transform
        self.test_transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.CenterCrop((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406],
                               [0.229, 0.224, 0.225])
        ])
    
    async def load_model_if_needed(self):
        """Load the PyTorch model if not already loaded"""
        if self.model is None:
            loop = asyncio.get_event_loop()
            self.model = await loop.run_in_executor(
                None,
                load_model, 
                self.model_path,
            )
    
    async def create_prediction(
        self, 
        user_id: int, 
        image_file, 
        filename: str,
        patient_age: Optional[int] = None,
        patient_gender: Optional[str] = None,
        patient_symptoms: Optional[str] = None
    ) -> Prediction:
        """
        Complete prediction workflow:
        1. Verify user exists
        2. Load model if needed
        3. Process image for model input (keeping original file intact)
        4. Run inference
        5. Upload image to AWS S3 (in parallel with or after processing)
        6. Store prediction in database
        """
        
        # Verify user exists
        user = await self.get_user_by_id(user_id)
        if not user:
            raise ValueError("User not found")
        
        start_time = time.time()
        
        try:
            # Step 1: Load model if needed
            await self.load_model_if_needed()
            
            # Step 2: Create a copy of the image file for processing
            # This ensures we don't interfere with the original file
            image_copy = self._create_image_copy(image_file)
            
            # Step 3: Process image for prediction (using the copy)
            processed_image = await self.process_image(image_copy)
            
            # Step 4: Run prediction
            prediction_result = await self.predict(processed_image)
            prediction_class = prediction_result["class"]
            confidence_score = prediction_result["confidence"]
            
            # Step 5: Upload original image to AWS S3
            # Reset file pointer if necessary
            if hasattr(image_file, 'seek'):
                image_file.seek(0)
            
            # Determine content type
            content_type = self._get_content_type(filename)
            
            # Upload to S3
            image_url = await s3_manager.upload_image_to_s3(
                image_file, 
                filename, 
                user_id, 
                content_type
            )
            
            # Calculate inference time
            inference_time = (time.time() - start_time) * 1000  # Convert to milliseconds
            
            # Step 6: Create prediction record
            prediction_data = PredictionCreate(
                image_filename=image_url,
                prediction_class=prediction_class,
                confidence_score=confidence_score,
                inference_time_ms=inference_time,
                patient_age=patient_age,
                patient_gender=patient_gender,
                patient_symptoms=patient_symptoms
            )
            
            db_prediction = Prediction(
                user_id=user_id,
                image_filename=prediction_data.image_filename,
                prediction_class=prediction_data.prediction_class,
                confidence_score=prediction_data.confidence_score,
                inference_time_ms=prediction_data.inference_time_ms,
                patient_age=prediction_data.patient_age,
                patient_gender=prediction_data.patient_gender,
                patient_symptoms=prediction_data.patient_symptoms,
                status="completed"
            )
            
            self.db.add(db_prediction)
            await self.db.commit()
            await self.db.refresh(db_prediction)
            
            return db_prediction
            
        except Exception as e:
            # Create failed prediction record for tracking
            db_prediction = Prediction(
                user_id=user_id,
                image_filename=filename,
                prediction_class="UNKNOWN",
                confidence_score=0.0,
                inference_time_ms=(time.time() - start_time) * 1000,
                status="failed"
            )
            
            self.db.add(db_prediction)
            await self.db.commit()
            
            raise ValueError(f"Prediction failed: {str(e)}")
    
    def _create_image_copy(self, image_file):
        """Create a copy of the image file for processing"""
        if hasattr(image_file, 'read'):
            # If it's a file-like object, read and create BytesIO copy
            content = image_file.read()
            image_file.seek(0)  # Reset original file pointer
            return io.BytesIO(content)
        else:
            # If it's already bytes, create BytesIO
            return io.BytesIO(image_file)
    
    def _get_content_type(self, filename: str) -> str:
        """Determine content type from filename"""
        extension = filename.lower().split('.')[-1] if '.' in filename else 'jpg'
        content_types = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'bmp': 'image/bmp',
            'webp': 'image/webp'
        }
        return content_types.get(extension, 'image/jpeg')
    
    async def process_image(self, image_file) -> torch.Tensor:
        """Process uploaded image for model input"""
        print("Processing image...")
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(
            None,
            process_image_for_prediction,
            image_file,
            self.test_transform
        )
    
    async def predict(self, processed_image: torch.Tensor) -> dict:
        """Run inference on processed image"""
        print("Predicting from image...")
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(
            None,
            predict_image,
            self.model,
            processed_image,
            self.class_names
        )
    
    async def get_prediction_by_id(self, prediction_id: int) -> Optional[Prediction]:
        """Get prediction by ID"""
        query = select(Prediction).where(Prediction.id == prediction_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()
    
    async def get_prediction_with_presigned_url(self, prediction_id: int, user_id: int = None) -> Optional[dict]:
        """Get prediction with presigned URL for image access"""
        prediction = await self.get_prediction_by_id(prediction_id)
        if not prediction:
            return None
        
        # Check if user has permission to view this prediction
        if user_id and prediction.user_id != user_id:
            return None
        
        try:
            # Generate presigned URL for the image
            presigned_url = await s3_manager.get_s3_presigned_url(
                prediction.image_filename, 
                expiration=3600  # 1 hour
            )
            
            # Convert prediction to dict and add presigned URL
            prediction_dict = {
                "id": prediction.id,
                "user_id": prediction.user_id,
                "image_filename": prediction.image_filename,
                "image_url": presigned_url,  # Add presigned URL for frontend access
                "prediction_class": prediction.prediction_class,
                "confidence_score": prediction.confidence_score,
                "inference_time_ms": prediction.inference_time_ms,
                "patient_age": prediction.patient_age,
                "patient_gender": prediction.patient_gender,
                "patient_symptoms": prediction.patient_symptoms,
                "created_at": prediction.created_at.isoformat(),
                "updated_at": prediction.updated_at.isoformat(),
                "reviewed_by_doctor": prediction.reviewed_by_doctor,
                "status": prediction.status,
                "is_flagged": prediction.is_flagged
            }
            
            return prediction_dict
            
        except Exception as e:
            print(f"Error generating presigned URL: {e}")
            # Return prediction without presigned URL if generation fails
            return {
                "id": prediction.id,
                "user_id": prediction.user_id,
                "image_filename": prediction.image_filename,
                "prediction_class": prediction.prediction_class,
                "confidence_score": prediction.confidence_score,
                "inference_time_ms": prediction.inference_time_ms,
                "created_at": prediction.created_at.isoformat(),
                "updated_at": prediction.updated_at.isoformat(),
                "status": prediction.status
            }
    
    async def get_user_predictions(
        self, 
        user_id: int, 
        skip: int = 0, 
        limit: int = 100,
        include_presigned_urls: bool = False
    ) -> List[dict]:
        """Get all predictions for a user with optional presigned URLs"""
        query = (
            select(Prediction)
            .where(Prediction.user_id == user_id)
            .offset(skip)
            .limit(limit)
            .order_by(Prediction.created_at.desc())
        )
        result = await self.db.execute(query)
        predictions = result.scalars().all()
        
        if not include_presigned_urls:
            return [
                {
                    "id": p.id,
                    "prediction_class": p.prediction_class,
                    "confidence_score": p.confidence_score,
                    "created_at": p.created_at.isoformat(),
                    "status": p.status
                }
                for p in predictions
            ]
        
        # Generate presigned URLs for each prediction
        predictions_with_urls = []
        for prediction in predictions:
            pred_dict = await self.get_prediction_with_presigned_url(prediction.id, user_id)
            if pred_dict:
                predictions_with_urls.append(pred_dict)
        
        return predictions_with_urls
    
    async def update_prediction(
        self, 
        prediction_id: int, 
        update_data: PredictionUpdate
    ) -> Optional[Prediction]:
        """Update prediction"""
        query = select(Prediction).where(Prediction.id == prediction_id)
        result = await self.db.execute(query)
        prediction = result.scalar_one_or_none()
        
        if not prediction:
            return None
        
        update_dict = update_data.dict(exclude_unset=True)
        for field, value in update_dict.items():
            setattr(prediction, field, value)
        
        await self.db.commit()
        await self.db.refresh(prediction)
        return prediction
    
    async def get_flagged_predictions(self, skip: int = 0, limit: int = 100) -> List[Prediction]:
        """Get all flagged predictions for review"""
        query = (
            select(Prediction)
            .where(Prediction.is_flagged == True)
            .offset(skip)
            .limit(limit)
            .order_by(Prediction.created_at.desc())
        )
        result = await self.db.execute(query)
        return result.scalars().all()
    
    async def get_predictions_by_class(
        self, 
        prediction_class: str, 
        skip: int = 0, 
        limit: int = 100
    ) -> List[Prediction]:
        """Get predictions by class"""
        query = (
            select(Prediction)
            .where(Prediction.prediction_class == prediction_class)
            .offset(skip)
            .limit(limit)
            .order_by(Prediction.created_at.desc())
        )
        result = await self.db.execute(query)
        return result.scalars().all()
    
    async def get_user_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID"""
        query = select(User).where(User.id == user_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()
    
    async def delete_prediction(self, prediction_id: int, user_id: int) -> bool:
        """Delete a prediction and its associated S3 image"""
        query = select(Prediction).where(
            Prediction.id == prediction_id,
            Prediction.user_id == user_id
        )
        result = await self.db.execute(query)
        prediction = result.scalar_one_or_none()
        
        if not prediction:
            return False
        
        # Delete image from S3
        try:
            await s3_manager.delete_image_from_s3(prediction.image_filename)
        except Exception as e:
            print(f"Warning: Could not delete S3 image: {e}")
            # Continue with database deletion even if S3 deletion fails
        
        # Delete from database
        await self.db.delete(prediction)
        await self.db.commit()
        return True