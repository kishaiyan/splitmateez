import json
import boto3
from botocore.exceptions import ClientError
from datetime import datetime
import os
import urllib.parse

# Initialize AWS SDK clients
rekognition_client = boto3.client('rekognition')
cloudwatch_logs_client = boto3.client('logs')
s3_client = boto3.client('s3')

# Fetch bucket and log group names from environment variables
TEMP_BUCKET = os.getenv('TEMP_BUCKET', 'default_temp_bucket')
PERMANENT_BUCKET = os.getenv('PERMANENT_BUCKET', 'default_permanent_bucket')
LOG_GROUP = os.getenv('LOG_GROUP', 'default_log_group')
LAST_TV_USER_ENV = 'LAST_TV_USER'  # Env variable to track the last tenant using the TV
LAST_COOKING_USER_ENV = 'LAST_COOKING_USER' # Environment variable to track the last tenant using the kitchen


# Main lambda handler
def lambda_handler(event, context):
    try:
        print(f"Event Received: {json.dumps(event)}")

        encoded_frame_key = event['Records'][0]['s3']['object']['key']
        frame_key = urllib.parse.unquote_plus(encoded_frame_key)
        print(f"Processing frame: {frame_key}")

        validate_image_format_and_integrity(TEMP_BUCKET, frame_key)
        tenant_id = compare_faces_with_tenants(TEMP_BUCKET, frame_key)
        print(f"Tenant_ID Detected: {tenant_id}")
        
        tv_detected = detect_tv_usage(TEMP_BUCKET, frame_key)
        
        if tv_detected:
            if tenant_id:
                print(f"TV and tenant face detected. TV is being used by tenant {tenant_id}.")
                start_tv_usage(tenant_id)
            else:
                last_tenant_id = os.getenv(LAST_TV_USER_ENV, None)
                if last_tenant_id:
                    print(f"TV detected but no tenant face. Ending usage for Tenant ID: {last_tenant_id}.")
                    end_tv_usage(last_tenant_id)
        else:
            print("No TV detected.")
        
        if tenant_id:
            print(f"Processing light activity for tenant {tenant_id}")
            detect_light_activity_using_brightness(TEMP_BUCKET, frame_key, tenant_id)
            print(f"Processing cooking activity for tenant {tenant_id}")
            detect_cooking_activity(TEMP_BUCKET, frame_key, tenant_id) 
        
        return {
            'statusCode': 200,
            'body': json.dumps('Face detection and activity logging completed successfully!')
        }
        
    except Exception as e:
        print(f"Error in lambda_handler: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps(f"Error in processing: {str(e)}")
        }


# Validate image format and check if the file is empty
def validate_image_format_and_integrity(bucket, key):
    try:
        print(f"Validating image format and integrity for key: {key}")
        if not (key.lower().endswith('.jpg') or key.lower().endswith('.jpeg') or key.lower().endswith('.png')):
            raise ValueError(f"Invalid image format for file {key}. Rekognition only supports JPEG and PNG formats.")
        
        print(f"Checking if file {key} is empty in bucket {bucket}")
        obj_metadata = s3_client.head_object(Bucket=bucket, Key=key)
        if obj_metadata['ContentLength'] == 0:
            raise ValueError(f"The file {key} is empty.")
        print(f"File {key} passed validation.")
    
    except ClientError as e:
        print(f"Error in validate_image_format_and_integrity: {str(e)}")
        raise e


def compare_faces_with_tenants(source_bucket, source_key):
    try:
        print(f"Comparing faces for source image: {source_key}")
        s3_objects = s3_client.list_objects_v2(Bucket=PERMANENT_BUCKET)
        if 'Contents' not in s3_objects:
            print("No images found in Permanent-S3 bucket.")
            return None
        
        for obj in s3_objects['Contents']:
            permanent_key = obj['Key']
            if not permanent_key.startswith('public/'):
                print(f"Skipping {permanent_key}. Not in public/ directory.")
                continue

            if not (permanent_key.lower().endswith('.jpg') or permanent_key.lower().endswith('.jpeg') or permanent_key.lower().endswith('.png')):
                print(f"Skipping {permanent_key}. Unsupported image format.")
                continue

            tenant_id = extract_uuid_from_filename(permanent_key)
            print(f"Processing image: {permanent_key}")
            response = rekognition_client.compare_faces(
                SourceImage={'S3Object': {'Bucket': source_bucket, 'Name': source_key}},
                TargetImage={'S3Object': {'Bucket': PERMANENT_BUCKET, 'Name': permanent_key}},
                SimilarityThreshold=10
            )
            print(f"Rekognition response for image {permanent_key}: {json.dumps(response)}")

            if response['FaceMatches']:
                print(f"Match found with tenant ID: {tenant_id}")
                return tenant_id

            print(f"Processing finished for image: {permanent_key}")
        
    except ClientError as e:
        print(f"Error comparing faces for image: {permanent_key}. Error: {str(e)}")
    
    print("No matching tenant found.")
    return None


def extract_uuid_from_filename(filename):
    filename_without_path = filename.split('/')[-1]
    return filename_without_path.split('.')[0]

# Use Rekognition's Brightness attribute to determine light status
def detect_light_activity_using_brightness(bucket, key, tenant_id):
    try:
        print(f"Detecting light activity for {tenant_id}")

        # Get light threshold and previous light status from environment variables
        light_threshold = int(os.getenv('LIGHT_THRESHOLD', 10))
        previous_light_status = os.getenv('LIGHT_STATUS', 'OFF')
        
        # Call Rekognition detect_faces to get brightness
        response = rekognition_client.detect_faces(
            Image={'S3Object': {'Bucket': bucket, 'Name': key}},
            Attributes=['ALL']
        )
        
        if response['FaceDetails']:
            brightness = response['FaceDetails'][0]['Quality']['Brightness']
            print(f"Brightness: {brightness}")
            
            # Determine current light status based on brightness threshold
            if brightness > light_threshold:
                current_light_status = "ON"
            else:
                current_light_status = "OFF"
            
            # Log the light ON or OFF event based on change in status
            if previous_light_status == "OFF" and current_light_status == "ON":
                print(f"Logging light ON event for tenant {tenant_id}")
                log_activity(activity_type="Light", tenant_id=tenant_id, event_type="START")
                os.environ['LIGHT_STATUS'] = "ON"  # Update the environment variable to ON
            elif previous_light_status == "ON" and current_light_status == "OFF":
                print(f"Logging light OFF event for tenant {tenant_id}")
                log_activity(activity_type="Light", tenant_id=tenant_id, event_type="END")
                os.environ['LIGHT_STATUS'] = "OFF"  # Update the environment variable to OFF
        
        else:
            print("No face detected for brightness analysis.")
    
    except ClientError as e:
        print(f"Error detecting light activity: {str(e)}")


def detect_tv_usage(bucket, key):
    response = rekognition_client.detect_labels(
        Image={'S3Object': {'Bucket': bucket, 'Name': key}},
        MaxLabels=10,
        MinConfidence=75
    )
    for label in response['Labels']:
        if label['Name'].lower() == 'tv':
            return True
    return False


def start_tv_usage(tenant_id):
    start_timestamp = datetime.utcnow().isoformat() + 'Z'
    os.environ[LAST_TV_USER_ENV] = tenant_id
    log_activity(activity_type="TV", tenant_id=tenant_id, event_type="START", timestamp=start_timestamp)
    print(f"TV usage started for tenant {tenant_id} at {start_timestamp}.")


def end_tv_usage(tenant_id):
    end_timestamp = datetime.utcnow().isoformat() + 'Z'
    log_activity(activity_type="TV", tenant_id=tenant_id, event_type="END", timestamp=end_timestamp)
    os.environ.pop(LAST_TV_USER_ENV, None)
    print(f"TV usage ended for tenant {tenant_id} at {end_timestamp}.")


def log_activity(activity_type, tenant_id, event_type="START", timestamp=None):
    if not timestamp:
        timestamp = datetime.utcnow().isoformat() + 'Z'
    
    if event_type == "START":
        log_message = f"Tenant_ID::{tenant_id}|Operation::{activity_type}|START_TS::{timestamp}"
    elif event_type == "END":
        log_message = f"Tenant_ID::{tenant_id}|Operation::{activity_type}|END_TS::{timestamp}"
    else:
        raise ValueError(f"Unknown event_type: {event_type}. Use 'START' or 'END'.")

    try:
        print(f"Logging activity: {log_message}")
        response = cloudwatch_logs_client.describe_log_streams(
            logGroupName=LOG_GROUP,
            orderBy='LastEventTime',
            descending=True,
            limit=1
        )

        if not response['logStreams']:
            log_stream_name = f"TenantActivityLogs-{tenant_id}-{datetime.now().strftime('%Y%m%d%H%M%S')}"
            print(f"Creating new log stream: {log_stream_name}")
            cloudwatch_logs_client.create_log_stream(logGroupName=LOG_GROUP, logStreamName=log_stream_name)
        else:
            log_stream_name = response['logStreams'][0]['logStreamName']
            print(f"Using existing log stream: {log_stream_name}")

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
        
        
def detect_cooking_activity(bucket, key, tenant_id):
    try:
        print(f"Detecting cooking activity for {tenant_id if tenant_id else 'No Tenant ID detected'}")

        # Detect labels in the image (to identify cooking activity)
        response = rekognition_client.detect_labels(
            Image={'S3Object': {'Bucket': bucket, 'Name': key}},
            MaxLabels=10,
            MinConfidence=75
        )

        # Print all detected labels with their confidence scores
        print("Detected Labels:")
        cooking_detected = False
        for label in response['Labels']:
            print(f"Label: {label['Name']}, Confidence: {label['Confidence']}%")
            if label['Name'].lower() in ['cooktop', 'kitchen', 'cooking pan', 'cookware']:
                cooking_detected = True
        
        # If any cooking-related labels are detected
        if cooking_detected:
            if tenant_id:
                print(f"Cooking and tenant face detected. Cooking is happening with tenant {tenant_id}.")
                start_cooking_activity(tenant_id)
            else:
                # Cooking is detected, but no tenant face is detected
                last_cooking_tenant = os.getenv(LAST_COOKING_USER_ENV, None)
                if last_cooking_tenant:
                    print(f"Cooking detected but no tenant face. Ending cooking activity for Tenant ID: {last_cooking_tenant}.")
                    end_cooking_activity(last_cooking_tenant)
        else:
            print("No cooking-related labels detected.")
    
    except ClientError as e:
        print(f"Error detecting cooking activity: {str(e)}")


def start_cooking_activity(tenant_id):
    start_timestamp = datetime.utcnow().isoformat() + 'Z'
    os.environ[LAST_COOKING_USER_ENV] = tenant_id
    log_activity(activity_type="Cooking", tenant_id=tenant_id, event_type="START", timestamp=start_timestamp)
    print(f"Cooking activity started for tenant {tenant_id} at {start_timestamp}.")


def end_cooking_activity(tenant_id):
    end_timestamp = datetime.utcnow().isoformat() + 'Z'
    log_activity(activity_type="Cooking", tenant_id=tenant_id, event_type="END", timestamp=end_timestamp)
    os.environ.pop(LAST_COOKING_USER_ENV, None)
    print(f"Cooking activity ended for tenant {tenant_id} at {end_timestamp}.")