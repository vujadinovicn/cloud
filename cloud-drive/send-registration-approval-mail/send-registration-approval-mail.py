import boto3
import json
from utility.utils import create_response, extract_email

ses_client = boto3.client("ses")
cognito = boto3.client('cognito-idp')
user_pool_id = 'eu-central-1_JaN1dqHVs'
link_base = 'http://localhost:4200/family-invitation-redirection'

def handler(event, context):
    try:
        referal_user = cognito.admin_get_user(
            UserPoolId=user_pool_id,
            Username=event['referalUsername']
        )

        from_email = "vujadinovic01@gmail.com"
        to_email = extract_email(referal_user)
        

        ses_client.send_email(
            Source=from_email,
            Destination={"ToAddresses": [to_email]},
            Message={
                "Subject": {
                    "Data": "Family member registration approval"
                },
                "Body": {
                    "Html": {
                        "Data": "<html><body>" +
                                "<h3>" + event['registratingUser']['name'] + " is requesting approval to sign up as your family member on CloudDrive.</h3>" +
                                "<p>To approve the registration, click <a href='" + link_base + "?id_dinamo=" + event['dynamoId'] + "&approval=true" + "'>APPROVE</a>.</p>" +
                                "<p>To deny the registration, click <a href='" + link_base + "?id_dinamo=" + event['dynamoId'] + "&approval=false" + "'>DENY</a>.</p>" +
                                "<br><p>Sincerely, CloudDrive Team.</p>" +
                                "</body></html>"
                    }
                },
            },
        )

        return event
    except Exception as e:
        return str(e)
    
    