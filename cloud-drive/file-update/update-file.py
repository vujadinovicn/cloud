import boto3
import json
import base64
import os
from utility.utils import create_response

s3 = boto3.client('s3')
bucket_name = os.environ['BUCKET_NAME']


def handler(event, context):
    try:
        file_name = event['queryStringParameters']['filename']

        # Decode the file content from base64
        file_content = base64.b64decode(event['body'].split(',')[1].strip())
        
        username = event['requestContext']['authorizer']['claims']['cognito:username']

        # Upload the file to S3
        s3.put_object(Bucket=bucket_name, Key=username+'/'+file_name, Body=file_content)
        
        return create_response(200, "File upload successful")

    except Exception as e:
        return create_response(500, "File upload failed.")
    
