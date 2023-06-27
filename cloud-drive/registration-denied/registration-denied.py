import boto3
import json
from utility.utils import create_response

ses_client = boto3.client("ses")
cognito = boto3.client('cognito-idp')
user_pool_id = 'eu-central-1_JaN1dqHVs'

def handler(event, context):
    try:
        data = event

        delete_family_account(data['registratingUser'])
        send_denied_email(data)
        
    except Exception as e:
        raise Exception(str(e))

def delete_family_account(user):
    cognito.admin_delete_user(
        UserPoolId=user_pool_id,
        Username=user['username']
    )

def send_denied_email(data):
    from_email = "vujadinovic01@gmail.com"
    to_email = data['registratingUser']['email']

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
                            "<p>Dear" + event['registratingUser']['name'] + ",</p>" +
                            "<p><br>Your registration as a family member has been DENIED by" + event['referalUsername'] + "!</p>" +
                            "<p>Because the request was denied by the referer, the family account you tried to register has been deleted. Feel free to reach out to them personaly and ask for the reason of denial.</p>" +
                            "<br><p>Sincerely, CloudDrive Team.</p>" +
                            "</body></html>"
                }
            },
        },
    )