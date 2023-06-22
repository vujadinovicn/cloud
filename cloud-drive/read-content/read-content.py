import json
import os
import boto3
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
        
        content_keys = []

        if 'Contents' in response:
            contents = sorted(response['Contents'], key=lambda x: x["LastModified"], reverse=True)
            for obj in contents:
                key = obj['Key']
                content_keys.append(key)
            return create_response(200, content_keys)
        else:
            return create_response(400, f"The folder '{folder_name}' does not exist or is empty.")

    except Exception as e:
        return create_response(500, str(e))