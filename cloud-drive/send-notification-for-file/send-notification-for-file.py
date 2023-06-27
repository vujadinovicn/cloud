import boto3
import json
from utility.utils import create_response
ses_client = boto3.client("ses")


def handler(event, context):
    body = json.loads(event["Records"][0]["Sns"]["Message"])

    # for receiver in body["receivers"]:
    from_email = "vujadinovic01@gmail.com"
    to_email = "samozanba2@gmail.com"
    ses_client.send_email(
        Source=from_email,
        Destination={"ToAddresses": [to_email]},
        Message={
            "Subject": {
                "Data": body["subject"]
            },
            "Body": {
                "Text": {
                    "Data": body["content"]
                }
            },
        },
    )