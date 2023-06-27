import boto3
import json
import base64
import os
from utility.utils import create_response

s3 = boto3.client('s3')
bucket_name = os.environ['BUCKET_NAME']
table_name_folder = os.environ['FOLDER_TABLE_NAME']
table_name_file = os.environ['TABLE_NAME']

dynamodb = boto3.resource('dynamodb')
table_folder = dynamodb.Table(table_name_folder)
table_file = dynamodb.Table(table_name_file)

def handler(event, context):
    try:
        username = event['requestContext']['authorizer']['claims']['cognito:username']
        path = event['queryStringParameters']['foldername']
        if (not path.startswith(username)):
            path = username + "/" + path
        folder_key = f"{path}/"

        response = s3.list_objects_v2(Bucket=bucket_name, Prefix=folder_key)

        if 'Contents' in response:
            objects = response['Contents']
            object_keys = [{'Key': obj['Key']} for obj in objects]
            # object_keys.append({'Key': folder_key})
            dynamoFileKeys = []
            dynamoFolderKeys = [folder_key]
            for obj in objects:
                if obj['Key'][-1] != '/':
                    dynamoFileKeys.append(obj['Key'])
                else:
                    dynamoFolderKeys.append(obj['Key'])

            dynamoFileKeys = list(dict.fromkeys(dynamoFileKeys))
            dynamoFolderKeys = list(dict.fromkeys(dynamoFolderKeys))

            old_file_items = []
            old_folder_items = []
            if (len(dynamoFileKeys) != 0):
                response = dynamodb.batch_get_item(RequestItems={
                    table_name_file: {
                        'Keys': [{'id': key} for key in list(dict.fromkeys(dynamoFileKeys))]
                    }})
                old_file_items = response['Responses'][table_name_file]

            if (len(dynamoFolderKeys) != 0):
                response = dynamodb.batch_get_item(RequestItems={
                    table_name_folder: {
                        'Keys': [{'id': key} for key in list(dict.fromkeys(dynamoFolderKeys))]
                    }})
                old_folder_items = response['Responses'][table_name_folder]

            if (delete_items_from_dynamo(dynamoFileKeys, False)):
                if (delete_items_from_dynamo(dynamoFolderKeys, True)):
                    if (delete_files_from_s3(object_keys)):
                        return create_response(200, 'Deleted folder.')
                    else:
                        with table_file.batch_writer() as batch:
                            for item in old_file_items:
                                batch.put_item(Item=item)
                        with table_folder.batch_writer() as batch:
                            for item in old_folder_items:
                                batch.put_item(Item=item)
                        return create_response(200, "Deleting from s3 failed.")
                else:
                    with table_file.batch_writer() as batch:
                        for item in old_file_items:
                            batch.put_item(Item=item)
                    return create_response(500, "Deleting folders metadata failed.")
            else:
                return create_response(500, "Deleting files metadata failed.")

            # with table.batch_writer() as batch:
            #     for item in dynamoKeys:
            #         response = batch.delete_item(Key={
            #             "id": item
            #         })

            # s3.delete_objects(Bucket=bucket_name, Delete={'Objects': object_keys})
            # s3.delete_object(Bucket=bucket_name, Key=folder_key)

            # return create_response(200, f"Folder '{path}' and its contents deleted from S3 bucket '{bucket_name}'.")
        else:
            return create_response(500, "Folder deletion failed.") 
    
    except Exception as e:
        return create_response(500, str(e))
    

def delete_items_from_dynamo(keys, isfolder):
    try:
        if(isfolder):
            with table_folder.batch_writer() as batch:
                for item in keys:
                        response = batch.delete_item(Key={
                            "id": item
                        })
        else:
            with table_file.batch_writer() as batch:
                for item in keys:
                        response = batch.delete_item(Key={
                            "id": item
                        })      
        return True
    except Exception as e:
        return False
    

def delete_files_from_s3(object_keys):
    try:
        s3.delete_objects(Bucket=bucket_name, Delete={'Objects': object_keys})
        return True
    except Exception as e:
        return False