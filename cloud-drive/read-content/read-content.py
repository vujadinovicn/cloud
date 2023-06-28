import json
import os
import re
import boto3
from utility.utils import create_response

s3 = boto3.client('s3')
bucket_name = os.environ['BUCKET_NAME']

def handler(event, context):
    try: 
        path = event['queryStringParameters']['foldername']

        username = event['requestContext']['authorizer']['claims']['cognito:username']
        if path == "":
            path = username + "/"


        if not re.search('^[a-zA-Z0-9/._ -]+$', path) or '../' in path:
            raise Exception('Invalid filename.')


        s3_client = boto3.client('s3')
        # folder_key = f"{path}/"
        folder_key = path
        response = s3_client.list_objects_v2(Bucket=bucket_name, Prefix=folder_key)
        
        content_keys = []
        initial_number_of_tokens = folder_key.count("/")

        if 'Contents' in response:
            contents = sorted(response['Contents'], key=lambda x: x["LastModified"], reverse=True)
            for obj in contents:
                if (obj["Key"].count("/") ==  initial_number_of_tokens and obj["Key"][-1] != "/"):
                    content_keys.append(obj["Key"])
                elif (obj["Key"].count("/") ==  initial_number_of_tokens+1 and obj["Key"][-1] == "/"):
                    content_keys.append(obj["Key"])
            return create_response(200, content_keys)
        else:
            return create_response(200, [])

    except Exception as e:
        return create_response(500, str(e))