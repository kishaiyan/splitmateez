import json
import boto3
import csv
from io import StringIO
from collections import defaultdict

# Initialize the S3 client
s3 = boto3.client('s3')

# Set your S3 bucket and file details
BUCKET_NAME = 'tenantactivitylogs'
FILE_KEY = 'tenant_activity_logs.csv'

# Lambda function handler
def lambda_handler(event, context):
    tenant_id = event['pathParameters']['tenant_id']
    
    # Load CSV from S3
    try:
        csv_object = s3.get_object(Bucket=BUCKET_NAME, Key=FILE_KEY)
        csv_data = csv_object['Body'].read().decode('utf-8')
        csv_reader = csv.DictReader(StringIO(csv_data))
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps(f"Error loading CSV data: {str(e)}")
        }
    
    # Dictionary to store the total cost per activity for the given tenant_id
    activity_costs = defaultdict(float)

    # Process each row in the CSV
    for row in csv_reader:
        # Check if the tenant_id matches
        if row['TenantID'] == tenant_id:
            activity = row['Activity']
            # Check if the cost field is not empty and is a valid number
            try:
                cost = float(row['Cost']) if row['Cost'] else 0.0
            except ValueError:
                cost = 0.0  # Handle cases where the cost is not a valid float
            # Accumulate the cost per activity
            activity_costs[activity] += cost
    
    # If no data found for the tenant_id, return 404
    if not activity_costs:
        return {
            'statusCode': 404,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps(f"Tenant ID '{tenant_id}' not found.")
        }
    
    # Prepare the result as a list of dictionaries
    result = [{"Activity": activity, "Cost": cost} for activity, cost in activity_costs.items()]

    # Return the response
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json'
        },
        'body': json.dumps({
            'tenant_id': tenant_id,
            'costs': result
        })
    }