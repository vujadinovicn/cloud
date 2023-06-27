import boto3
import json
import base64
import os
from utility.utils import create_response

s3 = boto3.client('s3')
bucket_name = os.environ['BUCKET_NAME']

dynamodb = boto3.resource('dynamodb')
table_name = os.environ['APPROVAL_TABLE_NAME']
table = dynamodb.Table(table_name)


def handler(event, context):
    try:
        id_dinamo = event['queryStringParameters']['id_dinamo']
        approval = event['queryStringParameters']['approval']
        answer = "accepted"
        if approval == "false":
            answer = "denied"
        response = dynamodb.update_item(
            TableName=table_name,
            Key={
                'KeyAttributeName': {'S': id_dinamo}
            },
            UpdateExpression='SET #field = :value',
            ExpressionAttributeNames={
                '#field': "status"
            },
            ExpressionAttributeValues={
                ':value': {'S': answer}
            })
        return id_dinamo, answer
    except Exception as e:
        return(str(e))
