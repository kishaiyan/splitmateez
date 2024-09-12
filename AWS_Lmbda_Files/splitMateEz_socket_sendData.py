import json
import boto3
import os
import csv
from io import StringIO

def lambda_handler(event, context):
    # Initialize the S3 and DynamoDB clients
    s3 = boto3.client('s3')
    dynamodb = boto3.client('dynamodb')
    
    # Fetch the CSV file from S3
    bucket_name = 'tenantactivitylogs'
    csv_file_key = 'tenant_activity_logs.csv'
    
    try:
        response = s3.get_object(Bucket=bucket_name, Key=csv_file_key)
        csv_content = response['Body'].read().decode('utf-8')
        
        # Parse the CSV content and calculate total cost per tenant
        tenant_costs = {}
        csv_reader = csv.DictReader(StringIO(csv_content))
        
        for row in csv_reader:
            tenant_id = row['TenantID']
            cost_str = row.get('Cost', '').strip()

            # Validate and add the cost to the tenant's total cost
            if cost_str:  # Skip empty cost fields
                try:
                    cost = float(cost_str)
                    if tenant_id in tenant_costs:
                        tenant_costs[tenant_id] += cost
                    else:
                        tenant_costs[tenant_id] = cost
                except ValueError:
                    print(f"Invalid cost for TenantID {tenant_id}: {cost_str}, skipping...")
            else:
                print(f"Cost not available for TenantID {tenant_id}, skipping...")

        # Prepare the message to be sent to the clients
        message = {"tenant_costs": tenant_costs}  # Total cost for each tenant
        message = json.dumps(message)
    
    except Exception as e:
        print(f"Error reading CSV from S3: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps('Error reading CSV from S3')
        }
    
    # Initialize the API Gateway Management API client
    apigatewaymanagementapi = boto3.client(
        'apigatewaymanagementapi', 
        endpoint_url="https://x93f2f8a41.execute-api.ap-southeast-2.amazonaws.com/production"
    )
    
    # Retrieve all connection IDs from DynamoDB
    paginator = dynamodb.get_paginator('scan')
    connectionIds = []
    for page in paginator.paginate(TableName=os.environ['WEBSOCKET_TABLE']):
        connectionIds.extend(page['Items'])
    
    # Send the data to all connected clients
    for connectionId in connectionIds:
        try:
            apigatewaymanagementapi.post_to_connection(
                Data=message,
                ConnectionId=connectionId['connectionId']['S']
            )
        except Exception as e:
            print(f"Failed to send message to {connectionId['connectionId']['S']}: {str(e)}")
    
    return {
        'statusCode': 200,
        'body': json.dumps('Message sent to all connections.')
    }