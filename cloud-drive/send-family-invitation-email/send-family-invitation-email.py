import boto3
import json
from utility.utils import create_response

ses_client = boto3.client("ses")
register_link = "http://localhost:4200/register"

def handler(event, context):
    try:
        body = json.loads(event["body"])

        if (body is None or body["family-email"] is None):
            return create_response(404, "You must provide valid email of the family member.")

        inviter_username = event['requestContext']['authorizer']['claims']['cognito:username']

        from_email = "vujadinovic01@gmail.com"
        to_email = body["family-email"]
        ses_client.send_email(
            Source=from_email,
            Destination={"ToAddresses": [to_email]},
            Message={
                "Subject": {
                    "Data": "Family member registration invitation"
                },
                "Body": {
                    "Html": {
                        "Data": "<html><body>" +
                                "<p>CloudDrive user " + inviter_username  + " is inviting you to register at CloudDrive as their family member.</p>" +
                                "<p>Click <a href='" + register_link + "'>HERE</a> to open the registration form and make sure to type their username (" + inviter_username +  ") in the optional 'Family member username' field at the bottom of the form.</p>" +
                                "<p>*By registering as their family member, you're account will have read and download access to all of their files and folders on CloudDrive.</p>" +
                                "<br><p>Sincerely, CloudDrive Team.</p>" +
                                "</body></html>"
                    }
                },
            },
        )

        return create_response(200, "Email invite successfully sent to " + to_email + ".")
    except Exception as e:
        return create_response(500, "Something went wrong, please try again.")