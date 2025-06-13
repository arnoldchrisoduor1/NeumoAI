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
from ..models.prediction import Prediction
from ..models.user import User
from ..schemas.prediction import PredictionCreate, PredictionUpdate
from ..utils.image_processing import process_image_for_prediction
from ..utils.model_utils import load_model, predict_image
from ..utils.aws_utils import upload_image_to_s3

class PredictionService:
    def __init__(self, db: AsyncSession, model_path: str = "path/to/your/model.pth"):
        self.db = db
        self.model_path = model_path
        self.model = None
        self.class_names = ["NORMAL", "PNEUMONIA"]  # Adjust based on your model
        
        # Image preprocessing transform (for inference, not training)
        self.test_transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.CenterCrop((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406],
                               [0.229, 0.224, 0.225])
        ])
        
    async def load_model_if_needed(self):
        """Loading the pytorch model if not already loaded."""
        if self.model is None:
            # weell be running in thread pool to avoid blocking.
            loop = asyncio.get_event_loop()
            self.model = await loop.run_executor(
                None,
                load_model,
                self.model_path
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
        Our predicton workflow will be
        1. Process image for model input.
        2. Run inference.
        3. Upload image to AWS (placeholder for now though)
        4. Store prediction in db.
        """
        
        # verify user exists.
        user = await self.get_user_by_id(user_id)
        if not user:
            raise ValueError("User not found")
        
        start_time = time.time()
        
        try:
            # 1. loading the model if not already loaded.
            await self. load_model_if_needed()
            
            # 2. process the image for prediction.
            processed_image = await self.process_image(image_file)
            
            # 3. run the prediction.
            prediction_result =await self.predict(processed_image)
            prediction_class = prediction_result['class']
            confidence_score = prediction_result["confidence"]
            
            # step 4: uploading image to aws