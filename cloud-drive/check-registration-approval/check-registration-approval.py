import json
import os
import boto3
from utility.utils import create_response
from datetime import datetime

table_name = os.environ['APPROVAL_TABLE_NAME']
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(table_name)

def handler(event, context):
    try: 
        data = event

        approval_request = table.get_item(Key={'id': data['dynamoId']})['Item']

        if approval_request is None or approval_request['status'] == 'pending':
            raise Exception("Request not processed")

        is_approved = True if approval_request['status'] == 'approved' else False

        event['isApproved'] = is_approved

        return event

    except Exception as e:
        raise Exception(str(e))