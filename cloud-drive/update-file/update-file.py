import boto3
import json
import base64
import os
import re
from dateutil import parser
from utility.utils import create_response

s3 = boto3.client('s3')
bucket_name = os.environ['BUCKET_NAME']

table_name = os.environ['TABLE_NAME']
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(table_name)
sns_client = boto3.client('sns')
file_updated_topic= os.environ.get('FILE_UPDATED_TOPIC')

def handler(event, context):
    try:
        data = json.loads(event['body'])

        username = event['requestContext']['authorizer']['claims']['cognito:username']
        email = event['requestContext']['authorizer']['claims']['email']
        path = data['id']
        if (not data['id'].startswith(username)):
            data["id"] = username + "/" + data["id"]
            path = data['id']

        response = table.get_item(Key={'id': path})
        old_item = response['Item']

        item = validate(data)
        # item = {
        #     'id': data['id'],
        #     'name': data['name'],
        #     'type': data['type'],
        #     'size': data['size'],
        #     'createdAt': data['createdAt'],
        #     'description': data['description'],
        #     'tags': data['tags']
        # }

    
        if add_file_metadata_to_dynamodb(item):
            if (data['content'] and data['content'] != ''):    
                content = base64.b64decode(data['content'].split(',')[1].strip())
                if upload_file_to_s3(path, content):
                    ffilename = data["id"].split("/")[-1]
                    sns_client.publish(
                        TopicArn=file_updated_topic,
                        Message=json.dumps(
                            {
                                "subject": "File updated",
                                "content": f"File '{ffilename}' has been updated by user '{username}'.",
                                "to": email,
                            }
                        ),
                    )
                    return create_response(200, "File upload successful")
                else:
                    table.put_item(Item=old_item)                    
                    return create_response(500, 's3 update failed')
            return create_response(200, 'File metadata updated')
        else:
            return create_response(500, "Dynamodb updatew failed")
    
    except Exception as e:
        return create_response(500, str(e) + str(data))
    

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

def validate(data):
    item = {}
    try:
        item = {
            'id': data['id'],
            'name': data['name'],
            'type': data['type'],
            'size': data['size'],
            'createdAt': data['createdAt'],
            'lastModified': data['lastModified'],
            'description': data['description'],
            'tags': data['tags']
        }
        _ = data['content']
    except Exception as e:
        raise Exception('Some metadata fields are missing.')
    
    if not re.search('^[a-zA-Z0-9/._ -]+$', item['id']) or '../' in item['id']:
        raise Exception('Invalid filename.')
    if not isinstance(item['tags'], list):
        raise Exception('Invalid tags format. List required')
    
    try:
        float(item['size'])
    except Exception:
        raise Exception('Invalid size format.')
    
    try:
        parser.parse(item['createdAt'])
        parser.parse(item['lastModified'])
    except Exception:
        raise Exception('Invalid date format.')
    
    return item
