import boto3
import json
import base64
import os
import re
from utility.utils import create_response

s3 = boto3.client('s3')
bucket_name = os.environ['BUCKET_NAME']
table_name = os.environ['TABLE_NAME']
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(table_name)

def handler(event, context):
    try:
        username = event['requestContext']['authorizer']['claims']['cognito:username']
        path = event['queryStringParameters']['filename']
        if (not path.startswith(username)):
            path = username + '/' + username

        if not re.search('^[a-zA-Z0-9._ -]+$', path) or '../' in path:
            raise Exception('Invalid filename.')

        response = table.get_item(Key={'id': path})
        old_item = response['Item']

        if (delete_file_from_dynamo(path)):
            if (delete_file_from_s3(path)):
                return create_response(200, "File '{path}' is deleted successfully.")
            else:
                table.put_item(Item=old_item)                    
                return create_response(500, "Failed to delete file from s3.")
        else:
            return create_response(500, "Failed to delete file from Dyanmodb.")
    
    except Exception as e:
        return create_response(500, str(e))
    

def delete_file_from_dynamo(path):
    try:
        with table.batch_writer() as batch:
            response = batch.delete_item(Key={
                    "id": path
                })        
        return True
    except Exception as e:
        return False
    

def delete_file_from_s3(path):
    try:
        s3.delete_object(Bucket=bucket_name, Key=path)
        return True
    except Exception as e:
        return False