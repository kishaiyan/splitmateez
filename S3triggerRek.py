import boto3
import json

s3 = boto3.client('s3')
rekognition = boto3.client('rekognition')

# Set your bucket names
original_bucket_name = 'tempbucketmd3'
results_bucket_name = 'rekresults'

def lambda_handler(event, context):
    # Get the bucket name and object key from the event
    bucket_name = event['Records'][0]['s3']['bucket']['name']
    object_key = event['Records'][0]['s3']['object']['key']

    # Ensure we are processing objects from the original bucket
    if bucket_name == original_bucket_name:
        # Get the image from S3
        image_object = s3.get_object(Bucket=bucket_name, Key=object_key)
        image_content = image_object['Body'].read()

        # Call Amazon Rekognition to analyze the image
        response = rekognition.detect_labels(Image={'Bytes': image_content})

        # Extract labels
        labels = response['Labels']

        # Save the labels to the results bucket as a JSON file
        result_key = object_key.replace('.jpg', '_labels.json')
        s3.put_object(
            Bucket=results_bucket_name,
            Key=result_key,
            Body=json.dumps(labels),
            ContentType='application/json'
        )

        print(f"Image labels for {object_key} stored in {results_bucket_name} as {result_key}")

    return {
        'statusCode': 200,
        'body': json.dumps('Image processed successfully')
    }
