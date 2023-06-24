import json
import os
import boto3
from utility.utils import create_response

table_name = os.environ['TABLE_NAME']
dynamodb = boto3.client('dynamodb')

def handler(event, context):
    username = event['requestContext']['authorizer']['claims']['cognito:username']
    
    try:
        response = dynamodb.scan(
            TableName=table_name,
            FilterExpression='contains(sharedWith, :username)',
            ExpressionAttributeValues={
                ':username': {'S': username}
            }
        )
        
        items = response['Items']
        all_ids = []

        for item in items:
            id = item["id"]["S"]
            all_ids.append(id)
        return create_response(200, all_ids)
    
    except Exception as e:
       return create_response(500,[e])
