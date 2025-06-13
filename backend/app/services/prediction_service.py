# prediction service logic
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional, List, Tuple
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
from ..utils.model_utils import load_model,load_model_auto, predict_image
from ..utils.aws_utils import upload_image_to_s3
from ..core.config import settings

class PredictionService:
    def __init__(self, db: AsyncSession, model_path: str = None):
        if model_path is None:
            model_path = settings.MODEL_PATH
            if not model_path:
                raise ValueError("MODEL_PATH environment variable is not set")
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # goes from services/ to app/
            model_path = os.path.join(base_dir, os.path.normpath(model_path))  # normalize and join

            model_path = os.path.abspath(model_path)  # final resolved absolute path

        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found: {model_path}")
        
        self.db = db
        self.model_path = model_path
        self.model = None
        self.model_class = 'Net'
        self.class_names = ["NORMAL", "PNEUMONIA"]
        
        # Image preprocessing transform (for inference)
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
            # Run in thread pool to avoid blocking
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
        Complete prediction workfloow:
        1. Process image for model input
        2. Run inference
        3. Upload image to AWS (placeholder for now)
        4. Store prediction in database
        """
        
        # Verify user exists
        user = await self.get_user_by_id(user_id)
        if not user:
            raise ValueError("User not found")
        
        start_time = time.time()
        
        try:
            # Step 1: Load model if needed
            await self.load_model_if_needed()
            
            # Step 2: Process image for prediction
            processed_image = await self.process_image(image_file)
            
            # Step 3: Run prediction
            prediction_result = await self.predict(processed_image)
            prediction_class = prediction_result["class"]
            confidence_score = prediction_result["confidence"]
            
            # Step 4: Upload image to AWS (placeholder)
            image_url = await self.upload_image(image_file, filename, user_id)
            
            # Calculate inference time
            inference_time = (time.time() - start_time) * 1000  # Convert to milliseconds
            
            # Step 5: Create prediction record
            prediction_data = PredictionCreate(
                image_filename=image_url,  # Using URL as filename for now
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
    
    async def process_image(self, image_file) -> torch.Tensor:
        """Process upoaded image for model input"""
        print("Processing image....")
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
    
    async def upload_image(self, image_file, filename: str, user_id: int) -> str:
        """Upload image to AWS S3 (placeholder for now)"""
        # TODO: Implement AWS S3 upload
        # For now, return a placeholder URL
        return f"https://your-bucket.s3.amazonaws.com/predictions/{user_id}/{filename}"
    
    async def get_prediction_by_id(self, prediction_id: int) -> Optional[Prediction]:
        """Get prediction by ID"""
        query = select(Prediction).where(Prediction.id == prediction_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()
    
    async def get_user_predictions(
        self, 
        user_id: int, 
        skip: int = 0, 
        limit: int = 100
    ) -> List[Prediction]:
        """Get all predicions for a user with pagination"""
        query = (
            select(Prediction)
            .where(Prediction.user_id == user_id)
            .offset(skip)
            .limit(limit)
            .order_by(Prediction.created_at.desc())
        )
        result = await self.db.execute(query)
        return result.scalars().all()
    
    async def update_prediction(
        self, 
        prediction_id: int, 
        update_data: PredictionUpdate
    ) -> Optional[Prediction]:
        """Update prediction (mainly for doctor reviews)"""
        query = select(Prediction).where(Prediction.id == prediction_id)
        result = await self.db.execute(query)
        prediction = result.scalar_one_or_none()
        
        if not prediction:
            return None
        
        # Update fields that are provided
        update_dict = update_data.dict(exclude_unset=True)
        for field, value in update_dict.items():
            setattr(prediction, field, value)
        
        await self.db.commit()
        await self.db.refresh(prediction)
        return prediction
    
    async def get_flagged_predictions(self, skip: int = 0, limit: int = 100) -> List[Prediction]:
        """Get all flaggd predictions for review"""
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
        """Get predictions by class (NORMAL/PNEUMONIA)"""
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
        """Get user by ID (helper method)"""
        query = select(User).where(User.id == user_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()
    
    async def delete_prediction(self, prediction_id: int, user_id: int) -> bool:
        """Delete a prediction (only by owner)"""
        query = select(Prediction).where(
            Prediction.id == prediction_id,
            Prediction.user_id == user_id
        )
        result = await self.db.execute(query)
        prediction = result.scalar_one_or_none()
        
        if not prediction:
            return False
        
        # TODO: Also delete image from AWS S3
        
        await self.db.delete(prediction)
        await self.db.commit()
        return True