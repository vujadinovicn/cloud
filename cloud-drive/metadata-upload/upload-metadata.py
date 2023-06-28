import json
import os
import boto3
from utility.utils import create_response

table_name = os.environ['TABLE_NAME']
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(table_name)
sns_client = boto3.client('sns')
file_updated_topic = os.environ.get('FILE_UPDATED_TOPIC')

def handler(event, context):
    try: 
        data = json.loads(event['body'])

        username = event['requestContext']['authorizer']['claims']['cognito:username']
        email = event['requestContext']['authorizer']['claims']['email']
        is_updating = True
        if (not data['id'].startswith(username)):
            data["id"] = username + "/" + data["id"]
            is_updating = False

        table.put_item(Item=data)

        subject, content = set_subject_and_content(is_updating, data["id"], username)
        sns_client.publish(
            TopicArn=file_updated_topic,
            Message=json.dumps(
                {
                    "subject": subject,
                    "content": content,
                    "to": email,
                }
            ),
        )

        return create_response(200, "File metadata uploaded successfuly")
    
    except Exception as e:
        return create_response(500, str(e))


def set_subject_and_content(is_updating, filename, username):
    if (is_updating):
        return "File update", f"File '{filename}' has been updated by user '{username}'."
    else:
         return "File creation", f"File '{filename}' has been created by user '{username}'."