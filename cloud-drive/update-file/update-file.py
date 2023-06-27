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
        data = json.loads(event['body'])

        username = event['requestContext']['authorizer']['claims']['cognito:username']
        path = data['id']
        if (not data['id'].startswith(username)):
            data["id"] = username + "/" + data["id"]
            path = data['id']

        response = table.get_item(Key={'id': path})
        old_item = response['Item']

        create_response(200, old_item)


        # item = {
        #     'id': data['id'],
        #     'name': data['name'],
        #     'type': data['type'],
        #     'size': data['size'],
        #     'createdAt': data['createdAt'],
        #     'description': data['description'],
        #     'tags': data['tags']
        # }

    
        if add_file_metadata_to_dynamodb(data):
            if (data['content']):    
                content = base64.b64decode(data['content'].split(',')[1].strip())
                if upload_file_to_s3(path, content):
                    create_response(200, "File upload successful")
                else:
                    add_file_metadata_to_dynamodb(old_item)
                    create_response(500, 's3 update failed')
            create_response(200, 'uspiooo')
        else:
            create_response(500, "Dynamodb updatew failed")
    
    except Exception as e:
        return create_response(500, str(e) + event)
    

def upload_file_to_s3(key, file_content):
    try:
        s3.put_object(Bucket=bucket_name, Key=key, Body=file_content)
        return True
    except Exception as e:
        return False

def add_file_metadata_to_dynamodb(item):
    try:
        table.put_item(Item=item)
        return True
    except Exception as e:
        return False
