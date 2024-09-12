import json
import boto3
from datetime import datetime
from io import StringIO
import csv
import gzip
import base64

# Initialize S3 client
s3 = boto3.client('s3')
bucket_name = 'tenantactivitylogs'
csv_file_key = 'tenant_activity_logs.csv'

def lambda_handler(event, context):
    print(f"Event: {event}")
    try:
        # Check if the event contains 'awslogs' and validate the data
        if 'awslogs' in event and 'data' in event['awslogs']:
            compressed_data = event['awslogs']['data']
            
            # Decompress the log data
            log_data = decompress_log_data(compressed_data)
            print(f"Decompressed: {log_data}")
            
            # Parse the JSON data from the decompressed log data
            decoded_data = json.loads(log_data)
            print(f"Decoded Data: {decoded_data}")
            
            # Process each log event
            for log_event in decoded_data['logEvents']:
                log_message = log_event['message']  # Only pass the message string, not the entire logEvent
                
                # Log the message for debugging
                print(f"Processing log message: {log_message}")
                
                # Now, directly access fields from log_message after parsing it correctly
                parsed_log = parse_log(log_message)  # Parse the log message string

                # Extract fields from parsed log
                if 'Tenant_ID' not in parsed_log:
                    print(f"'Tenant_ID' key not found in parsed log: {parsed_log}")
                    raise KeyError("'Tenant_ID' not found in log message")

                tenant_id = parsed_log['Tenant_ID']
                activity = parsed_log['Operation']

                # Handle START_TS and END_TS cases
                if 'START_TS' in parsed_log:
                    process_start_event(parsed_log, tenant_id, activity)
                elif 'END_TS' in parsed_log:
                    process_end_event(parsed_log, tenant_id, activity)

            return {
                'statusCode': 200,
                'body': json.dumps('Log processed successfully!')
            }
        else:
            raise ValueError("Event does not contain the expected 'awslogs' field.")
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps(f"Error processing logs: {str(e)}")
        }

def decompress_log_data(compressed_data):
    """Decompress the log data received from CloudWatch"""
    decoded_data = base64.b64decode(compressed_data)
    decompressed_data = gzip.decompress(decoded_data)
    return decompressed_data.decode('utf-8')

def parse_log(log_message):
    """Parses the log message (string) into a dictionary"""
    parsed = {}
    try:
        parts = log_message.split('|')
        for part in parts:
            if '::' in part:
                key, value = part.split('::', 1)  # Split only on the first occurrence of '::'
                parsed[key.strip()] = value.strip()  # Strip spaces around both key and value
            else:
                print(f"Unexpected log format in part: {part}")
        
        # Debugging: ensure parsed is a dict
        print(f"Parsed log message: {parsed}")
        
    except Exception as e:
        print(f"Error parsing log message: {log_message}. Error: {str(e)}")
        raise e
    return parsed
def process_start_event(parsed_log, tenant_id, activity):
    """Process a START_TS event"""
    start_ts = parsed_log['START_TS']
    csv_content = get_csv_content(bucket_name, csv_file_key)
    csv_content.append({
        'TenantID': tenant_id,
        'Activity': activity,
        'START_TS': start_ts,
        'END_TS': '',
        'Cost': ''
    })
    print(f"START_TS: {start_ts} for TenantID: {tenant_id}, Activity: {activity}")
    write_csv_content(bucket_name, csv_file_key, csv_content)

def process_end_event(parsed_log, tenant_id, activity):
    """Process an END_TS event"""
    end_ts = parsed_log['END_TS']
    csv_content = get_csv_content(bucket_name, csv_file_key)

    # Find the latest entry without an END_TS for this tenant and activity
    for row in reversed(csv_content):
        if row['TenantID'] == tenant_id and row['Activity'] == activity and row['END_TS'] == '':
            start_ts = row['START_TS']
            time_spent = calculate_time_spent(start_ts, end_ts)
            cost = time_spent * 2  # 2 AUD per unit time spent
            row['END_TS'] = end_ts
            row['Cost'] = cost
            print(f"END_TS: {end_ts}, Cost: {cost} AUD for TenantID: {tenant_id}, Activity: {activity}")
            break
    write_csv_content(bucket_name, csv_file_key, csv_content)

def calculate_time_spent(start_ts, end_ts):
    """Calculate time spent between start_ts and end_ts in minutes"""
    start_time = datetime.strptime(start_ts, "%Y-%m-%dT%H:%M:%S.%fZ")
    end_time = datetime.strptime(end_ts, "%Y-%m-%dT%H:%M:%S.%fZ")
    return (end_time - start_time).total_seconds() / 60  # Convert to minutes

def get_csv_content(bucket_name, csv_file_key):
    """Read the CSV content from S3"""
    try:
        response = s3.get_object(Bucket=bucket_name, Key=csv_file_key)
        csv_content = response['Body'].read().decode('utf-8')
        return list(csv.DictReader(StringIO(csv_content)))
    except s3.exceptions.NoSuchKey:
        return []  # Return an empty list if the file does not exist

def write_csv_content(bucket_name, csv_file_key, csv_content):
    """Write the updated CSV content to S3"""
    output = StringIO()
    writer = csv.DictWriter(output, fieldnames=['TenantID', 'Activity', 'START_TS', 'END_TS', 'Cost'])
    writer.writeheader()
    writer.writerows(csv_content)
    s3.put_object(Bucket=bucket_name, Key=csv_file_key, Body=output.getvalue())