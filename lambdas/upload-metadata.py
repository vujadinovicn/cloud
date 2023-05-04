import json
import boto3

table_name = "cloud-drive-db"
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    try: 
        data = json.loads(event['body'])
        table.put_item(Item=data)

        response = {
            "isBase64Encoded": False,
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Credentials": True
            },
            "body": json.dumps("File metadata uploaded successfuly")
        }
    except Exception as e:
        response = {
            "isBase64Encoded": False,
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Credentials": True
            },
            "body": json.dumps("File metadata upload FAILED")
        }
    
    return response
