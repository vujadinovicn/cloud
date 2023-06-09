import boto3
import os
import json
from utility.utils import create_response

ses_client = boto3.client("ses")
cognito = boto3.client('cognito-idp')
user_pool_id = 'eu-central-1_JaN1dqHVs'
dynamodb = boto3.client('dynamodb')
file_table_name = os.environ['TABLE_NAME']
folder_table_name = os.environ['FOLDER_TABLE_NAME']

def handler(event, context):
    try:
        data = event

        verify_email(data['registratingUser'])
        grant_family_acess(data)
        send_approval_email(data)
        
    except Exception as e:
        raise Exception(str(e))
    
def verify_email(user):
    cognito.admin_update_user_attributes(
        UserPoolId=user_pool_id,
        Username=user['username'],
        UserAttributes=[
            {'Name': 'email_verified', 'Value': 'true'}
        ]
    )

def grant_family_acess(data):
    grant_access_for_files(data)
    grant_access_for_folders(data)
    

def grant_access_for_files(data):
    for item in dynamodb.scan(TableName=file_table_name)['Items']:
            try:
                item_key = item['id']['S']  
                if (item_key.split('/')[0] != data["referalUsername"]):
                    continue

                shared_with = item.get('sharedWith', {'L': []})['L'] 

                new_family_member = {'S': data['registratingUser']['username']} 
                shared_with.append(new_family_member)

                dynamodb.update_item(
                    TableName=file_table_name,
                    Key={'id': {'S': item_key}},  
                    UpdateExpression='SET sharedWith = :value',
                    ExpressionAttributeValues={':value': {'L': shared_with}}
                )
            except Exception as e:
                 continue

def grant_access_for_folders(data):
    for item in dynamodb.scan(TableName=folder_table_name)['Items']:
            try:
                item_key = item['id']['S']
                if (item_key.split('/')[0] != data["referalUsername"]):
                    continue  

                shared_with = item.get('sharedWith', {'L': []})['L'] 

                new_family_member = {'S': data['registratingUser']['username']} 
                shared_with.append(new_family_member)

                dynamodb.update_item(
                    TableName=folder_table_name,
                    Key={'id': {'S': item_key}},  
                    UpdateExpression='SET sharedWith = :value',
                    ExpressionAttributeValues={':value': {'L': shared_with}}
                )
            except Exception as e:
                 continue

def send_approval_email(data):
    from_email = "vujadinovic01@gmail.com"
    to_email = data['registratingUser']['email']

    ses_client.send_email(
        Source=from_email,
        Destination={"ToAddresses": [to_email]},
        Message={
            "Subject": {
                "Data": "Family member registration APPROVED"
            },
            "Body": {
                "Html": {
                    "Data": "<html><body>" +
                            "<p>Dear" + data['registratingUser']['name'] + ",</p>" +
                            "<p><br>Your registration as a family member has been APPROVED by " + data['referalUsername'] + "!</p>" +
                            "<p>You can now see and download all content from their CloudDrive account, as well as manage your own separate data files!</p>" +
                            "<br><p>Sincerely, CloudDrive Team.</p>" +
                            "</body></html>"
                }
            },
        },
    )