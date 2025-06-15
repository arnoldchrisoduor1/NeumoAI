# utils/aws_utils.py
import boto3
from botocore.exceptions import ClientError
import os
from typing import Optional, BinaryIO
import uuid
import asyncio
from functools import partial
import io

class S3Manager:
    def __init__(self):
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
            region_name=os.getenv('AWS_REGION', 'eu-north-1')  # Match your region
        )
        self.bucket_name = os.getenv('AWS_S3_BUCKET', 'kenyamall')  # Your bucket name

    def _upload_file_sync(self, file_obj: BinaryIO, s3_key: str, content_type: str) -> str:
        """Synchronous upload function to run in thread pool"""
        try:
            # Reset file pointer to beginning
            file_obj.seek(0)
            
            self.s3_client.upload_fileobj(
                file_obj,
                self.bucket_name,
                s3_key,
                ExtraArgs={
                    'ContentType': content_type,
                    'ACL': 'private'  # Keep images private
                }
            )
            
            # Generate the S3 URL
            s3_url = f"https://{self.bucket_name}.s3.amazonaws.com/{s3_key}"
            return s3_url
            
        except ClientError as e:
            raise RuntimeError(f"AWS S3 upload failed: {str(e)}")
        except Exception as e:
            raise RuntimeError(f"Upload failed: {str(e)}")

    async def upload_image_to_s3(
        self, 
        image_file, 
        filename: str, 
        user_id: int,
        content_type: str = 'image/jpeg'
    ) -> str:
        """
        Upload image to AWS S3 bucket asynchronously
        
        Args:
            image_file: File object or file-like object
            filename: Original filename
            user_id: User ID for organizing files
            content_type: MIME type of the file
            
        Returns:
            str: S3 URL of uploaded file
        """
        try:
            # Generate unique filename
            file_extension = filename.split('.')[-1] if '.' in filename else 'jpg'
            unique_filename = f"{uuid.uuid4()}.{file_extension}"
            s3_key = f"predictions/{user_id}/{unique_filename}"
            
            # Create a copy of the file for S3 upload (so we don't interfere with model processing)
            if hasattr(image_file, 'read'):
                # If it's a file-like object
                file_content = image_file.read()
                image_file.seek(0)  # Reset for model processing
                file_obj = io.BytesIO(file_content)
            else:
                # If it's already bytes
                file_obj = io.BytesIO(image_file)
            
            # Run upload in thread pool to avoid blocking
            loop = asyncio.get_event_loop()
            s3_url = await loop.run_in_executor(
                None,
                self._upload_file_sync,
                file_obj,
                s3_key,
                content_type
            )
            
            return s3_url
            
        except Exception as e:
            raise RuntimeError(f"S3 upload failed: {str(e)}")

    def _delete_file_sync(self, s3_key: str) -> bool:
        """Synchronous delete function"""
        try:
            self.s3_client.delete_object(Bucket=self.bucket_name, Key=s3_key)
            return True
        except ClientError as e:
            print(f"Error deleting file from S3: {e}")
            return False

    async def delete_image_from_s3(self, s3_url: str) -> bool:
        """
        Delete image from S3 bucket
        
        Args:
            s3_url: Full S3 URL of the image
            
        Returns:
            bool: True if deleted successfully
        """
        try:
            # Extract S3 key from URL
            # URL format: https://bucket-name.s3.amazonaws.com/key
            if self.bucket_name in s3_url:
                s3_key = s3_url.split(f"{self.bucket_name}.s3.amazonaws.com/")[1].split('?')[0]
            else:
                return False
            
            # Run delete in thread pool
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(
                None,
                self._delete_file_sync,
                s3_key
            )
            
            return result
            
        except Exception as e:
            print(f"Error deleting image: {e}")
            return False

    def _generate_presigned_url_sync(self, s3_key: str, expiration: int) -> str:
        """Synchronous presigned URL generation"""
        try:
            response = self.s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.bucket_name, 'Key': s3_key},
                ExpiresIn=expiration
            )
            return response
        except ClientError as e:
            raise RuntimeError(f"Error generating presigned URL: {e}")

    async def get_s3_presigned_url(self, s3_url: str, expiration: int = 3600) -> str:
        """
        Generate presigned URL for private S3 objects
        
        Args:
            s3_url: Full S3 URL
            expiration: URL expiration time in seconds
            
        Returns:
            str: Presigned URL
        """
        try:
            # Extract S3 key from URL
            if self.bucket_name in s3_url:
                s3_key = s3_url.split(f"{self.bucket_name}.s3.amazonaws.com/")[1].split('?')[0]
            else:
                raise ValueError("Invalid S3 URL format")
            
            # Run presigned URL generation in thread pool
            loop = asyncio.get_event_loop()
            presigned_url = await loop.run_in_executor(
                None,
                self._generate_presigned_url_sync,
                s3_key,
                expiration
            )
            
            return presigned_url
            
        except Exception as e:
            raise RuntimeError(f"Error generating presigned URL: {e}")

# Create singleton instance
s3_manager = S3Manager()

# Export functions for backward compatibility
async def upload_image_to_s3(image_file, filename: str, user_id: int, bucket_name: Optional[str] = None) -> str:
    """Upload image to S3 - wrapper function"""
    return await s3_manager.upload_image_to_s3(image_file, filename, user_id)

async def delete_image_from_s3(s3_url: str, bucket_name: Optional[str] = None) -> bool:
    """Delete image from S3 - wrapper function"""
    return await s3_manager.delete_image_from_s3(s3_url)

def get_s3_presigned_url(s3_url: str, bucket_name: Optional[str] = None, expiration: int = 3600) -> str:
    """Generate presigned URL - wrapper function"""
    import asyncio
    loop = asyncio.get_event_loop()
    return loop.run_until_complete(s3_manager.get_s3_presigned_url(s3_url, expiration))