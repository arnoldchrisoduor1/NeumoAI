# prediction endpoints - UPDATED

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.security import HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from ...core.database import get_db
from ...schemas.prediction import (
    Prediction, PredictionUpdate, PredictionResponse, 
    PredictionListResponse, PredictionSummary
)
from ...services.prediction_service import PredictionService
from ...api.deps import get_current_user
from ...models.user import User as UserModel
from ...utils.image_processing import validate_image_file, get_image_metadata

router = APIRouter()

@router.post("/predict", response_model=PredictionResponse)
async def create_prediction(
    file: UploadFile = File(..., description="X-ray image file"),
    patient_age: Optional[int] = Form(None, description="Patient age"),
    patient_gender: Optional[str] = Form(None, description="Patient gender"),
    patient_symptoms: Optional[str] = Form(None, description="Patient symptoms"),
    current_user: UserModel = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create new pneumonia prediction from X-ray image"""
    prediction_service = PredictionService(db)
    
    try:
        # Validate image file
        validate_image_file(file)
        
        # Reset file pointer after validation
        await file.seek(0)
        
        # Create prediction
        prediction = await prediction_service.create_prediction(
            user_id=current_user.id,
            image_file=file.file,
            filename=file.filename,
            patient_age=patient_age,
            patient_gender=patient_gender,
            patient_symptoms=patient_symptoms
        )
        
        # Get prediction with presigned URL for immediate access
        prediction_with_url = await prediction_service.get_prediction_with_presigned_url(
            prediction.id, 
            current_user.id
        )
        
        return PredictionResponse(
            success=True,
            message="Prediction created successfully",
            data=prediction_with_url if prediction_with_url else prediction
        )
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction failed: {str(e)}"
        )

@router.get("/", response_model=PredictionListResponse)
async def get_user_predictions(
    skip: int = 0,
    limit: int = 100,
    include_images: bool = False,
    current_user: UserModel = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all predictions for current user"""
    prediction_service = PredictionService(db)
    
    try:
        predictions = await prediction_service.get_user_predictions(
            user_id=current_user.id,
            skip=skip,
            limit=limit,
            include_presigned_urls=include_images
        )
        
        if not include_images:
            # Convert to summary format for list view
            prediction_summaries = [
                {
                    "id": p["id"],
                    "prediction_class": p["prediction_class"],
                    "confidence_score": p["confidence_score"],
                    "created_at": p["created_at"],
                    "status": p["status"]
                } for p in predictions
            ]
        else:
            prediction_summaries = predictions
        
        return PredictionListResponse(
            success=True,
            message="Predictions retrieved successfully",
            data=prediction_summaries,
            total=len(prediction_summaries),
            page=skip // limit + 1,
            per_page=limit
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve predictions: {str(e)}"
        )

@router.get("/{prediction_id}", response_model=PredictionResponse)
async def get_prediction(
    prediction_id: int,
    current_user: UserModel = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get specific prediction by ID with presigned URL"""
    prediction_service = PredictionService(db)
    
    try:
        prediction = await prediction_service.get_prediction_with_presigned_url(
            prediction_id, 
            current_user.id
        )
        
        if not prediction:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Prediction not found or not authorized"
            )
        
        return PredictionResponse(
            success=True,
            message="Prediction retrieved successfully",
            data=prediction
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve prediction: {str(e)}"
        )

@router.put("/{prediction_id}", response_model=PredictionResponse)
async def update_prediction(
    prediction_id: int,
    update_data: PredictionUpdate,
    current_user: UserModel = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update prediction (mainly for doctor reviews)"""
    prediction_service = PredictionService(db)
    
    try:
        # Get prediction first to check ownership
        prediction = await prediction_service.get_prediction_by_id(prediction_id)
        
        if not prediction:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Prediction not found"
            )
        
        # Check if user owns this prediction
        if prediction.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this prediction"
            )
        
        # Update prediction
        updated_prediction = await prediction_service.update_prediction(
            prediction_id=prediction_id,
            update_data=update_data
        )
        
        # Get updated prediction with presigned URL
        prediction_with_url = await prediction_service.get_prediction_with_presigned_url(
            prediction_id, 
            current_user.id
        )
        
        return PredictionResponse(
            success=True,
            message="Prediction updated successfully",
            data=prediction_with_url if prediction_with_url else updated_prediction
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update prediction: {str(e)}"
        )

@router.delete("/{prediction_id}")
async def delete_prediction(
    prediction_id: int,
    current_user: UserModel = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete prediction and associated S3 image"""
    prediction_service = PredictionService(db)
    
    try:
        success = await prediction_service.delete_prediction(
            prediction_id=prediction_id,
            user_id=current_user.id
        )
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Prediction not found or not authorized"
            )
        
        return {"message": "Prediction and associated image deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete prediction: {str(e)}"
        )

@router.get("/class/{prediction_class}", response_model=PredictionListResponse)
async def get_predictions_by_class(
    prediction_class: str,
    skip: int = 0,
    limit: int = 100,
    current_user: UserModel = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get predictions filtered by class (NORMAL/PNEUMONIA)"""
    prediction_service = PredictionService(db)
    
    # Validate prediction class
    if prediction_class not in ["NORMAL", "PNEUMONIA"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid prediction class. Must be 'NORMAL' or 'PNEUMONIA'"
        )
    
    try:
        predictions = await prediction_service.get_predictions_by_class(
            prediction_class=prediction_class,
            skip=skip,
            limit=limit
        )
        
        # Filter by current user
        user_predictions = [p for p in predictions if p.user_id == current_user.id]
        
        prediction_summaries = [
            {
                "id": p.id,
                "prediction_class": p.prediction_class,
                "confidence_score": p.confidence_score,
                "created_at": p.created_at.isoformat(),
                "is_flagged": p.is_flagged,
                "reviewed_by_doctor": p.reviewed_by_doctor
            } for p in user_predictions
        ]
        
        return PredictionListResponse(
            success=True,
            message=f"Predictions with class '{prediction_class}' retrieved successfully",
            data=prediction_summaries,
            total=len(prediction_summaries),
            page=skip // limit + 1,
            per_page=limit
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve predictions: {str(e)}"
        )

@router.post("/{prediction_id}/flag")
async def flag_prediction(
    prediction_id: int,
    current_user: UserModel = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Flag a prediction for review"""
    prediction_service = PredictionService(db)
    
    try:
        update_data = PredictionUpdate(is_flagged=True)
        
        updated_prediction = await prediction_service.update_prediction(
            prediction_id=prediction_id,
            update_data=update_data
        )
        
        if not updated_prediction:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Prediction not found"
            )
        
        # Check ownership
        if updated_prediction.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to flag this prediction"
            )
        
        return {"message": "Prediction flagged successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to flag prediction: {str(e)}"
        )

@router.post("/validate-image")
async def validate_image(
    file: UploadFile = File(...),
    current_user: UserModel = Depends(get_current_user)
):
    """Validate uploaded image without creating prediction"""
    try:
        # Validate image
        validate_image_file(file)
        
        # Get metadata
        await file.seek(0)
        metadata = get_image_metadata(file.file)
        
        return {
            "valid": True,
            "message": "Image is valid for prediction",
            "metadata": metadata
        }
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Validation failed: {str(e)}"
        )