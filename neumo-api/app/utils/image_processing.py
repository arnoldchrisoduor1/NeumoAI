"""
Image Processing Functionalities
"""
import torch
from PIL import Image
import io
from typing import Union

def process_image_for_prediction(image_file, transform) -> torch.Tensor:
    """
    Arguements:
        image_file = FastAPI uploadFile or file-like object
        transform = torchvision transforms to apply
    
    Returns:
        torch.Tensor: Processed image tensor ready for model input.
    """
    try:
        # Reading the image file.
        if hasattr(image_file, 'read'):
            image_bytes = image_file.read()
        else:
            image_bytes = image_file
            
        # convert to PIL Image.
        image = Image.open(io.BytesIO(image_bytes))
        
        if image.mode != 'RGB':
            image = image.convert('RGB')
            
        # apply transforms
        processed_image = transform(image)
        
        # add batch dimension
        processed_image = processed_image.unsqueeze(0)
        
        return processed_image
    
    except Exception as e:
        raise ValueError(f"Error processing image:  {str(e)}")
        
def validate_image_file(image_file, max_size_mb: int = 10) -> bool:
    """
    Validating image file.
    """
    # performng file size check.
    if hasattr(image_file, 'size') and image_file.size:
        if image_file.size > max_size_mb * 1024 * 1024:
            raise ValueError(f"File size too large. Maximum {max_size_mb}MB allowed.")
        
    # cheching file type.
    allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/tiff', 'image/bmp']
    if hasattr(image_file, 'content_type'):
        if image_file.content_type not in allowed_types:
            raise ValueError(f"Invalid file type. Allowed types: {', '.join(allowed_types)}")
    
    print("Image validated successfully")
    return True

def get_image_metadata(image_file) -> dict:
    """
    Extracting the image metadata.
    """
    try:
        if hasattr(image_file, 'read'):
            image_bytes = image_file.read()
            # we can reset image pointer if possible.
            if hasattr(image_file, 'seek'):
                image_file.seek(0)
                
        else:
            image_bytes = image_file
            
        image = Image.open(io.BytesIO(image_bytes))
        
        return {
            "size": f"{image.width}x{image.height}",
            "format": image.format,
            "mode": image.width,
            "height": image.height
        }
    except Exception as e:
        return {"error": f"Could not extract metadata: {str(e)}"}