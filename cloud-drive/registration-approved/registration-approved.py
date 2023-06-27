import boto3
import json
from utility.utils import create_response

ses_client = boto3.client("ses")
cognito = boto3.client('cognito-idp')
user_pool_id = 'eu-central-1_JaN1dqHVs'

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
        Username=user['email'],
        UserAttributes=[
            {'Name': 'email_verified', 'Value': 'true'}
        ]
    )

def grant_family_acess(data):
    pass

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
                            "<p>Dear" + event['registratingUser']['name'] + ",</p>" +
                            "<p><br>Your registration as a family member has been APPROVED by" + event['referalUsername'] + "!</p>" +
                            "<p>You can now see and download all content from their CloudDrive account, as well as manage your own separate data files!</p>" +
                            "<br><p>Sincerely, CloudDrive Team.</p>" +
                            "</body></html>"
                }
            },
        },
    )