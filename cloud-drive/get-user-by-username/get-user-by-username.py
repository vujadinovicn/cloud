import boto3
import json
import base64
import os
from utility.utils import create_response

s3 = boto3.client('s3')
bucket_name = os.environ['BUCKET_NAME']


def handler(event, context):
    
    
    try:
        username = event['queryStringParameters']['username']
        idp = boto3.client('cognito-idp')
        response = idp.list_users(
            UserPoolId='eu-central-1_JaN1dqHVs',
            Filter='username = "{}"'.format(username)
        )

        if response['Users']:
            user = response['Users'][0]
            user_attributes = user['Attributes']
        
        # Create a dictionary to store the user attributes
            user_data = {}
        
        # Extract and store the user attributes in the dictionary
            for attribute in user_attributes:
                user_data[attribute['Name']] = attribute['Value']
            # Return the user attributes
            return create_response(200, user_data)
        else:
            return create_response(404, "User not found")
    
    except s3.exceptions.UserNotFoundException:
        return create_response(404, "User not found")
    
    except Exception as e:
        return create_response(404, "Error happened")
    