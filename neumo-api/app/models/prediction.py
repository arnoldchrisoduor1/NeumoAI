# sqlalchemy prediction model.
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..core.database import Base
import uuid

class Prediction(Base):
    __tablename__ = "predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # foreign key to link user.
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    image_filename = Column(String, nullable=False) # url to the image from aws buckets
    
    # prediction results.
    prediction_class = Column(String, nullable=False)
    confidence_score = Column(Float, nullable=False)
    
    # Processing information
    inference_time_ms = Column(Float, nullable=True)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # medical review fields
    reviewed_by_doctor = Column(Boolean, default=False)
    doctor_notes = Column(Text, nullable=True)
    doctor_diagnosis = Column(String, nullable=True)
    
    # patient information
    patient_age = Column(Integer, nullable=True)
    patient_gender = Column(String, nullable=True)
    patient_symptoms = Column(Text, nullable=True)
    
    # Status tracking
    is_flagged = Column(Boolean, default=False)  # Flag for concerning cases
    status = Column(String, default="completed") 
    
    # relationship back to user.
    user = relationship("User", back_populates="predictions")
    
    def __repr__(self):
        return f"<Prediction(id={self.id}, user_id={self.user_id}, class={self.prediction_class}, confidence={self.confidence_score})>"