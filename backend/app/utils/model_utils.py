import torch
import torch.nn as nn
import torch.nn.functional as F
from typing import List, Dict
import os

def load_model(model_path: str, device: str=None)
    """
    Code to load model from file.
    """
    if device is None:
        device = 'cuda' if torch.cuda.is_available() else 'cpu'
        
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found: {model_path}")
    
    try:
        model = torch.load(model_path, map_location=device)
        
        model.eval() #setting the model to evaluation mode.
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
                "class": class_names[predicted_class_idx],
                "confidence": confidence,
                "class_probabilities": {
                    class_names[i]: float(all_probs[i])
                    for i in range(len(class_names))
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