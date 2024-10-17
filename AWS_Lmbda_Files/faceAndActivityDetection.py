import json
import boto3
from botocore.exceptions import ClientError
from datetime import datetime
import os

# Initialize AWS SDK clients
rekognition_client = boto3.client('rekognition')
cloudwatch_logs_client = boto3.client('logs')
s3_client = boto3.client('s3')

# Fetch bucket and log group names from environment variables
TEMP_BUCKET = os.getenv('TEMP_BUCKET', 'default_temp_bucket')
PERMANENT_BUCKET = os.getenv('PERMANENT_BUCKET', 'default_permanent_bucket')
LOG_GROUP = os.getenv('LOG_GROUP', 'default_log_group')


# Main lambda handler
def lambda_handler(event, context):
    try:
        # Get the uploaded frame key from the Temp-S3 bucket (event-triggered)
        frame_key = event['Records'][0]['s3']['object']['key']
        
        # Validate the image format and integrity before processing
        validate_image_format_and_integrity(TEMP_BUCKET, frame_key)
        
        # Compare faces in the frame with permanent faces
        tenant_id = compare_faces_with_tenants(TEMP_BUCKET, frame_key)
        print(f"Tenant_ID Detected: {tenant_id}")
        
        # If a tenant is identified, analyze the light status and log activity
        if tenant_id:
            detect_light_activity_using_brightness(TEMP_BUCKET, frame_key, tenant_id)
            detect_cooking_activity(TEMP_BUCKET, frame_key, tenant_id) 
        return {
            'statusCode': 200,
            'body': json.dumps('Face detection and activity logging completed successfully!')
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps('Error in processing!')
        }

# Validate image format and check if the file is empty
def validate_image_format_and_integrity(bucket, key):
    # Check if the file has a valid image format (JPEG/PNG)
    if not (key.lower().endswith('.jpg') or key.lower().endswith('.jpeg') or key.lower().endswith('.png')):
        raise ValueError(f"Invalid image format for file {key}. Rekognition only supports JPEG and PNG formats.")
    
    # Check if the file is empty
    obj_metadata = s3_client.head_object(Bucket=bucket, Key=key)
    if obj_metadata['ContentLength'] == 0:
        raise ValueError(f"The file {key} is empty.")

# Compare faces in the uploaded frame with stored tenant images in Permanent-S3
def compare_faces_with_tenants(source_bucket, source_key):
    try:
        # List all images from the Permanent-S3 bucket
        s3_objects = s3_client.list_objects_v2(Bucket=PERMANENT_BUCKET)
        if 'Contents' not in s3_objects:
            print("No images found in Permanent-S3 bucket.")
            return None
        
        # Loop through each image in the Permanent-S3 bucket
        for obj in s3_objects['Contents']:
            permanent_key = obj['Key']  # Get image key (file name) from S3
            
            # Process only files from the public/ directory
            if not permanent_key.startswith('public/'):
                print(f"Skipping {permanent_key}. Not in public/ directory.")
                continue

            # Validate image format (only .jpg, .jpeg, .png allowed)
            if not (permanent_key.lower().endswith('.jpg') or permanent_key.lower().endswith('.jpeg') or permanent_key.lower().endswith('.png')):
                print(f"Skipping {permanent_key}. Unsupported image format.")
                continue

            tenant_id = extract_uuid_from_filename(permanent_key)
            
            # Log the image being processed
            print(f"Processing image: {permanent_key}")

            # Compare faces using Rekognition
            response = rekognition_client.compare_faces(
                SourceImage={'S3Object': {'Bucket': source_bucket, 'Name': source_key}},
                TargetImage={'S3Object': {'Bucket': PERMANENT_BUCKET, 'Name': permanent_key}},
                SimilarityThreshold=10
            )

            # Log the Rekognition response
            print(f"Rekognition response for image {permanent_key}: {json.dumps(response)}")

            # If a match is found, return the tenant_id
            if response['FaceMatches']:
                print(f"Match found with tenant ID: {tenant_id}")
                return tenant_id  # Return the tenant_id when a match is found

            # Log when processing finishes
            print(f"Processing finished for image: {permanent_key}")
        
    except ClientError as e:
        print(f"Error comparing faces for image: {permanent_key}. Error: {str(e)}")
    
    print("No matching tenant found.")
    return None  # If no match was found, return None

# Extract the UUID from the file name (removes 'public/' and file extension)
def extract_uuid_from_filename(filename):
    # Remove any directory path and return only the file name without extension
    filename_without_path = filename.split('/')[-1]  # This removes the 'public/' part
    return filename_without_path.split('.')[0]  # This extracts the UUID part before the file extension

# Use Rekognition's Brightness attribute to determine light status
def detect_light_activity_using_brightness(bucket, key, tenant_id):
    try:
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
                # Log light turning ON
                log_activity(activity_type="Light", tenant_id=tenant_id, event_type="START")
                os.environ['LIGHT_STATUS'] = "ON"  # Update the environment variable to ON
            elif previous_light_status == "ON" and current_light_status == "OFF":
                # Log light turning OFF
                log_activity(activity_type="Light", tenant_id=tenant_id, event_type="END")
                os.environ['LIGHT_STATUS'] = "OFF"  # Update the environment variable to OFF
        
        else:
            print("No face detected for brightness analysis.")
    
    except ClientError as e:
        print(f"Error detecting light activity: {str(e)}")

# Detect cooking activity based on object detection
def detect_cooking_activity(bucket, key, tenant_id):
    try:
        # Detect labels in the image (to identify frying pan and flame)
        response = rekognition_client.detect_labels(
            Image={'S3Object': {'Bucket': bucket, 'Name': key}},
            MaxLabels=10,
            MinConfidence=75
        )

        # Print all detected labels with their confidence scores
        print("Detected Labels:")
        for label in response['Labels']:
            print(f"Label: {label['Name']}, Confidence: {label['Confidence']}%")

        # Initialize flags for objects
        frying_pan_detected = False
        flame_detected = False

        # Check labels for 'frying pan' and 'flame' or 'fire'
        for label in response['Labels']:
            if label['Name'].lower() == 'Cooking Pan':
                frying_pan_detected = True
                print("Frying Pan detected.")
            elif label['Name'].lower() == 'fire' or label['Name'].lower() == 'flame':
                flame_detected = True
                print("Flame detected.")

        # If both frying pan and flame are detected, log the cooking activity
        if frying_pan_detected and flame_detected:
            start_timestamp = datetime.utcnow().isoformat() + 'Z'
            log_activity(activity_type="Cooking", tenant_id=tenant_id, event_type="START")
            print(f"Cooking activity started for tenant {tenant_id} at {start_timestamp}")
        else:
            print("Cooking not detected: Frying pan or flame missing.")
    
    except ClientError as e:
        print(f"Error detecting cooking activity: {str(e)}")


# Log activity to CloudWatch Logs
def log_activity(activity_type, tenant_id, event_type="START"):
    # Get the current timestamp
    timestamp = datetime.utcnow().isoformat() + 'Z'
    
    # Use different keys for start and end events
    if event_type == "START":
        log_message = f"Tenant_ID::{tenant_id}|Operation::{activity_type}|START_TS::{timestamp}"
    elif event_type == "END":
        log_message = f"Tenant_ID::{tenant_id}|Operation::{activity_type}|END_TS::{timestamp}"
    else:
        raise ValueError(f"Unknown event_type: {event_type}. Use 'START' or 'END'.")

    try:
        # Check for existing log streams or create a new one
        response = cloudwatch_logs_client.describe_log_streams(
            logGroupName=LOG_GROUP,
            orderBy='LastEventTime',
            descending=True,
            limit=1
        )

        if not response['logStreams']:
            log_stream_name = f"TenantActivityLogs-{tenant_id}-{datetime.now().strftime('%Y%m%d%H%M%S')}"
            cloudwatch_logs_client.create_log_stream(logGroupName=LOG_GROUP, logStreamName=log_stream_name)
        else:
            log_stream_name = response['logStreams'][0]['logStreamName']

        # Log the event
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
