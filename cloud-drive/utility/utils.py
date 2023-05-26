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
