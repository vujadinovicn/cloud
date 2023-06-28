import json
import os
import boto3
from utility.utils import create_response
from datetime import datetime

table_name = os.environ['APPROVAL_TABLE_NAME']
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(table_name)
user_pool_id = 'eu-central-1_JaN1dqHVs'
cognito = boto3.client('cognito-idp')

def handler(event, context):
    try: 
        data = event

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
        if data['familyUsername'] is None:
            return create_response(404, "Family username doesn't exist or invalid.")

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

        cognito.admin_set_user_password(
            UserPoolId=user_pool_id,
            Username=data["username"],
            Password=data["password"],
            Permanent=True
        )

        current_timestamp = str(datetime.now().timestamp())
        partition_key = f'{data["username"]}-{data["familyUsername"]}-{current_timestamp}'  # Combine the three fields
        item = {
            'id': partition_key,
            'newUsername': data["username"],
            'referalUsername': data["familyUsername"],
            'status': "pending"
        }
    
        response = table.put_item(Item=item)

        need_user_info = {
            'name': data['name'],
            'username': data['username'],
            'email': data['email']
        }

        return {
            'registratingUser': need_user_info,
            'referalUsername': data["familyUsername"],
            'dynamoId': partition_key
        }
    
    except Exception as e:
        raise Exception(str(e))