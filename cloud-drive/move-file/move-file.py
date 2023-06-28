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
    data = json.loads(event['body'])

    old_path = data['filePath']
    filename = old_path.split('/')[-1]
    new_file_path = data['folderPath'] + filename

    response = table.get_item(Key={'id': old_path})
    response = s3.get_object(Bucket=bucket_name, Key=old_path)
    file_content = response['Body'].read()
    file_content = ''
    try:
        old_item = response['Item']
        file_content = response['Body'].read()
    except:
        return create_response(500, "File doesn't exist.")
    
    new_item = old_item
    new_item['id'] = new_file_path

    if delete_file_from_dynamo(old_path):
        if delete_file_from_s3(old_path):
            if upload_file_to_s3(file_content, new_file_path):
                if add_file_metadata_to_dynamodb(old_item):
                    return create_response(200, "File is moved.")
                else:
                    delete_file_from_s3(new_file_path)
                    upload_file_to_s3(file_content, old_path)
                    with table.batch_writer() as batch:
                        batch.put_item(Item=old_item)
            else:
                with table.batch_writer() as batch:
                    batch.put_item(Item=old_item)
                upload_file_to_s3(file_content, old_path)
        else:
             with table.batch_writer() as batch:
                batch.put_item(Item=old_item)
    else:
        return create_response(500, "Sorry, we can't delete your file from current folder.")




def delete_file_from_dynamo(path):
    try:
        with table.batch_writer() as batch:
            response = batch.delete_item(Key={
                    "id": path
                })        
        return True
    except Exception as e:
        return False
    
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
    

def delete_file_from_s3(folder_key):
    try:
        s3.delete_object(Bucket=bucket_name, Key=folder_key)
        return True
    except Exception as e:
        return False