import torch
import torch.nn as nn
import torch.nn.functional as F
from typing import List, Dict
import os
from ..models.ai_model import Net

def load_model(model_path: str, device: str = 'cpu'):
    """Load your pneumonia detection model"""
    
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found: {model_path}")
    
    try:
        print(f"Loading checkpoint from {model_path}...")
        checkpoint = torch.load(model_path, map_location='cpu')
        
        if 'model_state_dict' not in checkpoint:
            raise ValueError(f"'model_state_dict' key not found. Available keys: {list(checkpoint.keys())}")
        
        # Initialize your model
        print("Initializing Net model...")
        model = Net()
        
        # Load the trained weights
        print("Loading trained weights...")
        model.load_state_dict(checkpoint['model_state_dict'])
        
        # Set to evaluation mode and ensure CPU
        model.eval()
        model = model.to('cpu')
        
        print(f"Model loaded successfully! Trained for {checkpoint.get('epoch', 'unknown')} epochs")
        return model
        
    except Exception as e:
        print(f"Error details: {str(e)}")
        import traceback
        traceback.print_exc()
        raise RuntimeError(f"Error loading model: {str(e)}")

def load_model_auto(model_path: str, device: str=None):
    """
    Auto-detect if it's a full model or state_dict and handle accordingly.
    """
    if device is None:
        device = 'cuda' if torch.cuda.is_available() else 'cpu'
         
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found: {model_path}")
     
    try:
        checkpoint = torch.load(model_path, map_location=device)
        
        if isinstance(checkpoint, dict):
            raise ValueError(
                "This appears to be a state_dict. You need to provide the model class. "
                "Use load_model() with model_class parameter instead."
            )
        else:
            # It's a full model object
            model = checkpoint
            model.eval()
            model.to(device)
            print(f"Model loaded successfully from {model_path} on {device}")
            return model
        
    except Exception as e:
        raise RuntimeError(f"Error loading model: {str(e)}")


# Alternative simpler version if you know it's always a state_dict:
def load_model_state_dict(model_path: str, model_class, device: str=None):
    """
    Load model from state_dict file.
    """
    if device is None:
        device = 'cuda' if torch.cuda.is_available() else 'cpu'
         
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found: {model_path}")
     
    try:
        # Initialize model
        model = model_class()
        
        # Load state_dict
        state_dict = torch.load(model_path, map_location=device)
        model.load_state_dict(state_dict)
        
        model.eval()
        model.to(device)
        
        print(f"Model loaded successfully from {model_path} on {device}")
        return model
        
    except Exception as e:
        raise RuntimeError(f"Error loading model: {str(e)}")
    
def predict_image(model, image_tensor: torch.Tensor, class_name: List[str]) -> Dict:
    """
    Running inference in a single image.
    """
    try:
        device = next(model.parameters()).device
        image_tensor = image_tensor.to(device)
        
        with torch.no_grad():
            outputs = model(image_tensor)
            
            probabilities = F.softmax(outputs, dim=1)
            
            # get prediction
            _, predicted = torch.max(outputs, 1)
            predicted_class_idx = predicted.item()
            
            # getting the confidence score.
            confidence = probabilities[0][predicted_class_idx].item()
            
            # getting ll the class probabilities.
            all_probs = probabilities[0].cpu().numpy()
            result = {
                "class": class_name[predicted_class_idx],
                "confidence": confidence,
                "class_probabilities": {
                    class_name[i]: float(all_probs[i])
                    for i in range(len(class_name))
                },
                "predicted_index": predicted_class_idx
            }
            
            return result
        
    except Exception as e:
        raise RuntimeError(f"Error during prediction: {str(e)}")
    
def get_model_info(model) -> Dict:
    """
    Getting info about the loaded model.
    """
    try:
        device = next(model.parameters()).device
        
        # counting the number of model parameters.
        total_parameters = sum(p.numel() for p in model.parameters())
        trainable_params = sum(p.numel() for p in model.parameters() if p.requires_grad)
        
        return {
            "device": str(device),
            "total_parameters": total_params,
            "trainable_parameters": trainable_params,
            "model_type": type(model).__name__,
            "training_mode": model.training
        }
        
    except Exception as e:
        return {"error": f"Could not get model info: {str(e)}"}