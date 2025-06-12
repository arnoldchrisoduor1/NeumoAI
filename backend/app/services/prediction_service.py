# ai prediction service.
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