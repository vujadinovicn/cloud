import boto3
import json
import base64

s3 = boto3.client('s3')
bucket_name = 'cloud-drive-storage-2'


def lambda_handler(event, context):
    try:
        file_name = event['pathParameters']['filename']

        # Decode the file content from base64
        file_content = base64.b64decode(event['body'].split(',')[1].strip())
        
        # Upload the file to S3
        s3.put_object(Bucket=bucket_name, Key=file_name, Body=file_content)
        
        response = {
            "isBase64Encoded": False,
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Credentials": True
            },
            "body": json.dumps("File upload successful")
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
            "body": json.dumps("File upload FAILED")
        }
    
    return response
