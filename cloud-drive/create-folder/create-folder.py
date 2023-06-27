import boto3
import json
import base64
import os
from utility.utils import create_response

s3 = boto3.client('s3')
bucket_name = os.environ['BUCKET_NAME']

table_name = os.environ['FOLDER_TABLE_NAME']
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(table_name)

def handler(event, context):
    try:
        folder_name = event['queryStringParameters']['foldername']
        data = json.loads(event['body'])

        username = event['requestContext']['authorizer']['claims']['cognito:username']
        if (not data['id'].startswith(username)):
            data["id"] = username + "/" + data["id"]

        if add_folder_metadata_to_dynamodb(data):
            if upload_folder_to_s3(data['id']):
                return create_response(200, "Folder creation successful")
            else:
                with table.batch_writer() as batch:
                    response = batch.delete_item(Key={"id": data['id']})                
                return create_response(500, 's3 upload failed')
        else:
            return create_response(500, "Dynamodb upload failed")     
    
    except Exception as e:
        return create_response(500, str(e))
    

def upload_folder_to_s3(key):
    try:
        s3.put_object(Bucket=bucket_name, Key=key)
        return True
    except Exception as e:
        return False

def add_folder_metadata_to_dynamodb(item):
    try:
        table.put_item(Item=item)
        return True
    except Exception as e:
        return False
    
