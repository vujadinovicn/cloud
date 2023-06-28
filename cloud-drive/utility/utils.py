import json

def create_response(status, body):
    return { 
        "isBase64Encoded": False,
        "statusCode": status, 
        "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET,UPDATE,DELETE",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Credentials": True
        },
        "body": json.dumps(body, default=str)
        }

def extract_email(user):
    for attribute in user['UserAttributes']:
            if attribute['Name'] == 'email':
                email = attribute['Value']
                return email
    return None