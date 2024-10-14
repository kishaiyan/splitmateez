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

        # Initialize the tenant-to-property map
        property_costs = []

        # Fetch the property ID for each tenant ID from the user database
        user_db_table = 'Tenant-2vodmqyzdje45n24iijkirksim-dev'
        for tenant_id, total_cost in tenant_costs.items():
            try:
                response = dynamodb.get_item(
                    TableName=user_db_table,
                    Key={'id': {'S': tenant_id}}  # Use 'id' as per your schema
                )
                if 'Item' in response:  # Check if the item exists
                    property_id = response['Item']['propertyID']['S']  # Get the property ID
                    
                    # Check if the property ID already exists in the list
                    property_entry = next((entry for entry in property_costs if entry['propertyId'] == property_id), None)
                    if property_entry is not None:
                        # If it exists, append to the tenant_costs
                        property_entry['tenant_cost'].append({
                            'id': tenant_id,
                            'value': total_cost
                        })
                    else:
                        # If it does not exist, create a new entry
                        property_costs.append({
                            'propertyId': property_id,
                            'tenant_cost': [{
                                'id': tenant_id,
                                'value': total_cost
                            }]
                        })
                else:
                    print(f"No item found for TenantID {tenant_id}.")
                    
            except Exception as e:
                print(f"Error fetching property ID for TenantID {tenant_id}: {str(e)}")

        # Prepare the final message
        message = {"property_costs": property_costs}
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
        except apigatewaymanagementapi.exceptions.GoneException:
            # Handle stale connection (remove from DynamoDB)
            try:
                print(f"Removing stale connection: {connectionId['connectionId']['S']}")
                dynamodb.delete_item(
                    TableName=os.environ['WEBSOCKET_TABLE'],
                    Key={'connectionId': {'S': connectionId['connectionId']['S']}}
                )
            except Exception as delete_error:
                print(f"Failed to delete stale connection: {str(delete_error)}")
        except Exception as e:
            print(f"Failed to send message to {connectionId}: {str(e)}")
    
    return {
        'statusCode': 200,
        'body': json.dumps('Message sent to all connections.')
    }
