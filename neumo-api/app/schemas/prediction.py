#  prediction pydantic schemas.
from pydantic import BaseModel, validator, Field, HttpUrl
from typing import Optional, Literal
from datetime import datetime
from .user import User

class PredictionBase(BaseModel):
    
    image_filename: str
    prediction_class: Literal["NORMAL", "PNEUMONIA"]
    confidence_score: float = Field(..., ge=0.0, le=1.0, description="Confidence score between 0 and 1")
    
    # Optional Fields.
    inference_time_ms: Optional[float] = None
    patient_age: Optional[int] = Field(None, ge=0, le=150)
    patient_gender: Optional[Literal["Male", "Female", "Other"]] = None
    patient_symptoms: Optional[str] = None
    is_flagged: Optional[bool] = None
    reviewed_by_doctor: Optional[str] = None
    
class PredictionCreate(PredictionBase):
    """Schema for creating a new prediction"""
    pass

class PredictionUpdate(BaseModel):
    """Schema for updating prediction (mainly for doctor reviews)"""
    reviewed_by_doctor: Optional[bool] = None
    doctor_notes: Optional[str] = None
    doctor_diagnosis: Optional[Literal["NORMAL", "PNEUMONIA", "INCONCLUSIVE"]] = None
    is_flagged: Optional[bool] = None
    status: Optional[Literal["Processing", "Completed", "Failed", "Reviewed"]] = None
    
    @validator('doctor_notes')
    def validate_doctor_notes(cls, v, values):
        if values.get('reviewed_by_doctor') and not v:
            raise ValueError('Doctor notes are required when Reviewed by Doctor.')
        return v
    
class PredictionInDB(PredictionBase):
    """Schema for prediction as stored in database"""
    id: int
    user_id: int
    created_at: Optional[datetime]
    updated_at: Optional[datetime] = None
    
    # Medical review fields.
    reviewed_by_doctor: bool = False
    status: str = "completed"
    
    class Config:
        from_attributes = True
        
class Prediction(PredictionInDB):
    """Main prediction schema for API responses"""
    pass

class PredictionWithUser(Prediction):
    """prediction schema with user information"""
    user: User
    
class PredictionSummary(BaseModel):
    """Lightweight prediction schema for lists/summaries"""
    id: int
    prediction_class: str
    confidence_score: float
    created_at: datetime
    is_flagged: Optional[bool] = None
    reviewed_by_doctor: Optional[bool] = None
    
    class Config:
        from_attributes = True

# Response schemas for API endpoints
class PredictionResponse(BaseModel):
    """Standard API response for prediction operations"""
    success: bool
    message: str
    data: Optional[Prediction] = None

class PredictionListResponse(BaseModel):
    """API response for listing predictions"""
    success: bool
    message: str
    data: list[PredictionSummary]
    total: int
    page: int
    per_page: int