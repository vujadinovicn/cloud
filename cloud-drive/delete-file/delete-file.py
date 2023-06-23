import boto3
import json
import base64
import os
from utility.utils import create_response

s3 = boto3.client('s3')
bucket_name = os.environ['BUCKET_NAME']
table_name = os.environ['TABLE_NAME']
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(table_name)

def handler(event, context):
    try:
        username = event['requestContext']['authorizer']['claims']['cognito:username']
        path = username + '/' + event['queryStringParameters']['filename']

        s3_client = boto3.client('s3')

        with table.batch_writer() as batch:
            response = batch.delete_item(Key={
                    "id": path
                })

            
        s3_client.delete_object(Bucket=bucket_name, Key=path)

        return create_response(200, "File '{path}' is deleted successfully.")
    
    except Exception as e:
        return create_response(500, str(e))
    
