import boto3
import json
import base64
import os
from utility.utils import create_response

s3 = boto3.client('s3')
bucket_name = os.environ['BUCKET_NAME']

dynamodb = boto3.client('dynamodb')
table_name = os.environ['APPROVAL_TABLE_NAME']


def handler(event, context):
    try:
        id_dinamo = event['queryStringParameters']['id_dinamo']
        approval = event['queryStringParameters']['approval']
        answer = "approved"
        if approval == "false":
            answer = "denied"
        response = dynamodb.update_item(
            TableName=table_name,
            Key={
                'id': {'S': id_dinamo}
            },
            UpdateExpression='SET #field = :value',
            ExpressionAttributeNames={
                '#field': "status"
            },
            ExpressionAttributeValues={
                ':value': {'S': answer}
            })
        return create_response(200, answer)
    except Exception as e:
        return create_response(500, str(e))
