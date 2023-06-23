import json
import os
import boto3
from utility.utils import create_response

table_name = os.environ['TABLE_NAME']
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(table_name)

def handler(event, context):
    try: 
        data = json.loads(event['body'])

        username = event['requestContext']['authorizer']['claims']['cognito:username']
        if (not data['id'].startswith(username)):
            data["id"] = username + "/" + data["id"]

        table.put_item(Item=data)

        return create_response(200, "File metadata uploaded successfuly")
    
    except Exception as e:
        return create_response(500, str(e) + str(data))
