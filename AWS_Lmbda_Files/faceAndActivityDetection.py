import json
import boto3
from botocore.exceptions import ClientError
from datetime import datetime


# Initialize AWS SDK clients
rekognition_client = boto3.client('rekognition')
cloudwatch_logs_client = boto3.client('logs')

TEMP_BUCKET = 'tempbucketsplitmate'
PERMANENT_BUCKET = 'photidtenants'
LOG_GROUP = 'TenantActivityLogs'

light_status = "OFF"  # Global variable to track light status (ON or OFF)

# Permanent images (Tenants) in the S3 bucket
TENANT_IMAGES = {
    'Harish.jpg': 'Harish',
    'Kishyan.jpg': 'Kishyan',
    'Arshad.jpg': 'Arshad'
}

# Main lambda handler
def lambda_handler(event, context):
    try:
        # Get the uploaded frame key from the Temp-S3 bucket (event-triggered)
        frame_key = event['Records'][0]['s3']['object']['key']
        
        # Compare faces in the frame with permanent faces
        tenant_id = compare_faces_with_tenants(TEMP_BUCKET, frame_key)
        print(f"Tenant_ID Detected : {tenant_id}")
        
        # If a tenant is identified, analyze the light status and log activity
        if tenant_id:
            detect_light_activity_using_brightness(TEMP_BUCKET, frame_key, tenant_id)
        
        return {
            'statusCode': 200,
            'body': json.dumps('Face detection and light activity logging completed successfully!')
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps('Error in processing!')
        }

# Compare faces in the uploaded frame with stored tenant images in Permanent-S3
def compare_faces_with_tenants(source_bucket, source_key):
    for permanent_key, tenant_name in TENANT_IMAGES.items():
        try:
            response = rekognition_client.compare_faces(
                SourceImage={'S3Object': {'Bucket': source_bucket, 'Name': source_key}},
                TargetImage={'S3Object': {'Bucket': PERMANENT_BUCKET, 'Name': permanent_key}},
                SimilarityThreshold=80
            )
            if response['FaceMatches']:
                print(f"Match found with {tenant_name}")
                return tenant_name
        except ClientError as e:
            print(f"Error comparing faces: {str(e)}")
    
    print("No matching tenant found.")
    return None

# Use Rekognition's Brightness attribute to determine light status
def detect_light_activity_using_brightness(bucket, key, tenant_id):
    global light_status
    
    try:
        # Call Rekognition detect_faces to get brightness
        response = rekognition_client.detect_faces(
            Image={'S3Object': {'Bucket': bucket, 'Name': key}},
            Attributes=['ALL']
        )
        
        # Extract brightness level from face details (use first detected face)
        if response['FaceDetails']:
            brightness = response['FaceDetails'][0]['Quality']['Brightness']
            print(f"Brightness: {brightness}")
            
            # Set a brightness threshold to determine light ON/OFF (e.g., 50)
            light_threshold = 10
            
            if brightness > light_threshold:
                current_light_status = "ON"
            else:
                current_light_status = "OFF"
            
            # Log the light ON or OFF event based on the change in status
            if light_status == "OFF" and current_light_status == "ON":
                print(f"Loging Now: {light_status}")
                log_light_activity('START', tenant_id)
                light_status = "ON"
            elif light_status == "ON" and current_light_status == "OFF":
                print(f"Loging Now: {light_status}")
                log_light_activity('END', tenant_id)
                light_status = "OFF"
        
        else:
            print("No face detected for brightness analysis.")
    
    except ClientError as e:
        print(f"Error detecting light activity: {str(e)}")

def log_light_activity(operation, tenant_id):
    timestamp = datetime.utcnow().isoformat() + 'Z'  # Current UTC timestamp
    log_message = f"Tenant_ID::{tenant_id}|Operation::Light|{operation}_TS::{timestamp}"

    try:
        # Check if log stream exists and create if necessary
        response = cloudwatch_logs_client.describe_log_streams(
            logGroupName=LOG_GROUP,
            orderBy='LastEventTime',
            descending=True,
            limit=1
        )
        print(f"Response from CloudWatch:{response}")

        if not response['logStreams']:
            # If no log stream exists, create one
            log_stream_name = f"TenantActivityLogs-{tenant_id}-{datetime.now().strftime('%Y%m%d%H%M%S')}"
            cloudwatch_logs_client.create_log_stream(logGroupName=LOG_GROUP, logStreamName=log_stream_name)
        else:
            log_stream_name = response['logStreams'][0]['logStreamName']

        # Put log event to CloudWatch
        cloudwatch_logs_client.put_log_events(
            logGroupName=LOG_GROUP,
            logStreamName=log_stream_name,
            logEvents=[
                {
                    'timestamp': int(datetime.now().timestamp() * 1000),
                    'message': log_message
                }
            ]
        )
        print(f"Logged activity: {log_message}")

    except ClientError as e:
        print(f"Error logging to CloudWatch: {str(e)}")