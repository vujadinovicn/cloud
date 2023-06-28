import boto3
import json
import base64
import os
import re
from utility.utils import create_response

s3 = boto3.client('s3')
bucket_name = os.environ['BUCKET_NAME']


def handler(event, context):
    try:
        id = event['queryStringParameters']['id']
        # username = event['requestContext']['authorizer']['claims']['cognito:username']

        # file_key = username + "/" + file_name
        if not re.search('^[a-zA-Z0-9/._ -]+$', id) or '../' in id:
            raise Exception('Invalid filename.')


        response = s3.get_object(Bucket=bucket_name, Key=id)
        file_content = response['Body'].read()

        encoded_bytes= base64.b64encode(file_content)
        encoded_string = encoded_bytes.decode('utf-8')
        
        return create_response(200, encoded_string)

    except Exception as e:
        return create_response(500, "File download failed.")