import json
import os
import boto3
from utility.utils import create_response

table_name = os.environ['TABLE_NAME']
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(table_name)
sns_client = boto3.client('sns')
file_updated_topic = os.environ.get('VARIABLE_NAME')

def handler(event, context):
    try: 
        data = json.loads(event['body'])

        username = event['requestContext']['authorizer']['claims']['cognito:username']
        if (not data['id'].startswith(username)):
            data["id"] = username + "/" + data["id"]

        table.put_item(Item=data)
        filename=data["id"]

        sns_client.publish(
            TopicArn=file_updated_topic,
            Message=json.dumps(
                {
                    # "event": "update",
                    "subject": "File update",
                    "content": f"File '{filename}' has been updated by user '{username}'.",
                    "receivers": "",
                }
            ),
        )

        return create_response(200, "File metadata uploaded successfuly")
    
    except Exception as e:
        return create_response(500, str(e) + str(data))
