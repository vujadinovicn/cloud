import boto3
import json
from utility.utils import create_response, extract_email

ses_client = boto3.client("ses")
cognito = boto3.client('cognito-idp')
user_pool_id = 'eu-central-1_JaN1dqHVs'

def handler(event, context):
    try:
        data = event

        delete_family_account(data)
        send_timeout_email(data)
        
    except Exception as e:
        raise Exception(str(e))

def delete_family_account(user):
    cognito.admin_delete_user(
        UserPoolId=user_pool_id,
        Username=user['username']
    )

def send_timeout_email(data):
    from_email = "vujadinovic01@gmail.com"
    to_email = data['email']

    ses_client.send_email(
        Source=from_email,
        Destination={"ToAddresses": [to_email]},
        Message={
            "Subject": {
                "Data": "Family member registration DENIED"
            },
            "Body": {
                "Html": {
                    "Data": "<html><body>" +
                            "<p>Dear" + data['name'] + ",</p>" +
                            "<p><br>Your request to register as a family member of "  + data['familyUsername'] +  "has EXPIRED.</p>" +
                            "<p>Because the request has expired, the family account you tried to register has been deleted. Feel free to reach out to them personaly and ask for the reason of ignoring the request.</p>" +
                            "<br><p>Sincerely, CloudDrive Team.</p>" +
                            "</body></html>"
                }
            },
        },
    )

    
    