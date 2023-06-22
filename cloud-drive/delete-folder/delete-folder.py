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
        if folder_name != "":
            path = username + "/" + folder_name
        else:
            path = username

        s3_client = boto3.client('s3')
        folder_key = f"{path}/"

        response = s3_client.list_objects_v2(Bucket=bucket_name, Prefix=folder_key)

        if 'Contents' in response:
            objects = response['Contents']
            object_keys = [{'Key': obj['Key']} for obj in objects]
            
            # Delete objects within the folder
            s3_client.delete_objects(Bucket=bucket_name, Delete={'Objects': object_keys})
            
            # Delete the folder itself
            s3_client.delete_object(Bucket=bucket_name, Key=folder_key)
            return create_response(200, f"Folder '{folder_name}' and its contents deleted from S3 bucket '{bucket_name}'.")
        else:
            return create_response(500, "Folder deletion failed.") 
    
    except Exception as e:
        return create_response(500, "Folder creation failed.")
    
