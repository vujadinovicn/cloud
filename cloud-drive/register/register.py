import json
import os
import boto3
from utility.utils import create_response
from datetime import datetime

user_pool_id = 'eu-central-1_JaN1dqHVs'
cognito = boto3.client('cognito-idp')

def handler(event, context):
    try: 
        data = json.loads(event['body'])

        if data is None:
            return create_response(404, "You must provide sign up data to sign up.")
        
        if data['username'] is None:
            return create_response(404, "Username doesn't exist or invalid.")
        if data['password'] is None:
            return create_response(404, "Password doesn't exist or invalid.")
        if data['name'] is None:
            return create_response(404, "Name doesn't exist or invalid.")
        if data['surname'] is None:
            return create_response(404, "Surname doesn't exist or invalid.")
        if data['date'] is None:
            return create_response(404, "Date doesn't exist or invalid.")
        if data['email'] is None:
            return create_response(404, "Email doesn't exist or invalid.")

        user = cognito.admin_create_user(
            UserPoolId=user_pool_id,
            Username=data["username"],
            UserAttributes=[
                {"Name": "given_name", "Value": data["name"]},
                {"Name": "family_name", "Value": data["surname"]},
                {"Name": "birthdate", "Value": data["date"]},
                {"Name": "email", "Value": data["email"]},
            ],
            MessageAction='SUPPRESS',
            DesiredDeliveryMediums=['EMAIL']
        )

        set_password(data)
        verify_email(data)

        return create_response(200, "You have successfully registered!")
    
    except Exception as e:
        # return create_response(500, "Something went wrong with registration, try again please.")
        return create_response(500, str(e))
    

def set_password(user):
    cognito.admin_set_user_password(
        UserPoolId=user_pool_id,
        Username=user["username"],
        Password=user["password"],
        Permanent=True
    )

def verify_email(user):
    cognito.admin_update_user_attributes(
        UserPoolId=user_pool_id,
        Username=user['username'],
        UserAttributes=[
            {'Name': 'email_verified', 'Value': 'true'}
        ]
)