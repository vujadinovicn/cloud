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
        path = event['queryStringParameters']['foldername']

        # username = event['requestContext']['authorizer']['claims']['cognito:username']
        # if folder_name != "":
        #     path = folder_name
        # else:
        #     path = username

        s3_client = boto3.client('s3')
        folder_key = f"{path}/"

        response = s3_client.list_objects_v2(Bucket=bucket_name, Prefix=folder_key)

        # return create_response(200, str(response))

        if 'Contents' in response:
            objects = response['Contents']
            object_keys = [{'Key': obj['Key']} for obj in objects]
            dynamoKeys = []
            for obj in objects:
                if obj['Key'][-1] != '/':
                    dynamoKeys.append(obj['Key'])
            # return create_response(500, str(requests)) 


            with table.batch_writer() as batch:
                for item in dynamoKeys:
                    response = batch.delete_item(Key={
                        "id": item
                    })

            s3_client.delete_objects(Bucket=bucket_name, Delete={'Objects': object_keys})
            s3_client.delete_object(Bucket=bucket_name, Key=folder_key)

            return create_response(200, f"Folder '{path}' and its contents deleted from S3 bucket '{bucket_name}'.")
        else:
            return create_response(500, "Folder deletion failed.") 
    
    except Exception as e:
        return create_response(500, str(e))
    
