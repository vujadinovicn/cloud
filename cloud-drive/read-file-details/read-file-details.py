import json
import os
import boto3
from utility.utils import create_response

table_name = os.environ['TABLE_NAME']
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(table_name)

def handler(event, context):
    try: 
        file_name = event['queryStringParameters']['filename']

        username = event['requestContext']['authorizer']['claims']['cognito:username']
        path = username + "/" + file_name

        if not re.search('^[a-zA-Z0-9._ -]+$', path) or '../' in path:
            raise Exception('Invalid filename.')


        response = table.get_item(Key={'id': path})

        return create_response(200, response['Item'])
    
    except Exception as e:
        return create_response(500, str(e))
