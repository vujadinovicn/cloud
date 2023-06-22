import boto3
import json
import base64
import os
from utility.utils import create_response

s3 = boto3.client('s3')
bucket_name = os.environ['BUCKET_NAME']

def handler(event, context):
    try:
        folder_name = event['queryStringParameters']['foldername']

        username = event['requestContext']['authorizer']['claims']['cognito:username']

        folder_key = f"{folder_name}/"
        s3.put_object(Bucket=bucket_name, Key=username + "/" + folder_key)
            
        return create_response(200, "Folder created successfully")      
    
    except Exception as e:
        return create_response(500, "Folder creation failed.")
    
