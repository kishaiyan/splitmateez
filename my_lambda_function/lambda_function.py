from dotenv import load_dotenv
load_dotenv()
from flask import Flask, request, jsonify
import datetime
import textwrap
import matplotlib.pyplot as plt
import boto3
from io import BytesIO
from langchain_openai import OpenAI
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from collections import defaultdict
import os
import pandas as pd
from reportlab.lib.units import inch


app = Flask(__name__)

if "OPENAI_API_KEY" not in os.environ and not os.getenv("OPENAI_API_KEY"):

    raise ValueError("OpenAI APi key is missing")

@app.route('/generateReport', methods=['GET'])
def lambda_handler():
    try:
        # Initialize OpenAI
        llm = OpenAI()
        
        # Read CSV from S3
        s3 = boto3.client('s3')
        bucket_name = 'tenantactivitylogs'
        file_key = 'tenant_activity_logs.csv'
        upload_bucket='tenantreport'
        
        try:
            obj = s3.get_object(Bucket=bucket_name, Key=file_key)
            df = pd.read_csv(obj['Body'])
        except s3.exceptions.NoSuchKey:
            return jsonify({
                'statusCode': 404,
                'error': f'File "{file_key}" not found in bucket "{bucket_name}"'
            })
        except s3.exceptions.NoSuchBucket:
            return jsonify({
                'statusCode': 404,
                'error': f'Bucket "{bucket_name}" does not exist'
            })
        
        # Process tenant data
        tenant_id = request.args.get('tenant_id')
        if not tenant_id:
            return jsonify({
                'statusCode': 400,
                'error': 'tenant_id is required'
            })
        print("tenant id:", tenant_id)
        
        # Check if tenant data is empty
        tenant_data = get_tenant_data(df, tenant_id)
        if tenant_data.shape[0]==0:
            return jsonify({
                'statusCode': 301,
                'message': 'Start using utilities to generate report'
            })
        
        results = process_tenant_data(df, llm, tenant_id)

        # Create PDF
        pdf_buffer = create_pdf_report(results, tenant_id)

        # Upload PDF to S3
        s3 = boto3.client('s3')
        pdf_key = f'{tenant_id}_{int(datetime.datetime.now().timestamp())}_report.pdf'
        s3.put_object(Bucket=upload_bucket, Key=pdf_key, Body=pdf_buffer.getvalue())

        # Return summary and PDF URL
        return jsonify({
            'statusCode': 200,
            'summary': results['summary'],
            'pdf_url': f"https://{upload_bucket}.s3.amazonaws.com/{pdf_key}"
        })

    except Exception as e:
        return jsonify({
            'statusCode': 500,
            'error': f'An unexpected error occurred: {str(e)}'
        })

def process_tenant_data(df, llm, tenant_id):
    # Filter data for specific tenant
    tenant_data = get_tenant_data(df, tenant_id)
    
    # Convert filtered DataFrame to format needed for graphs
    data = defaultdict(list)
    filtered_data = tenant_data[tenant_data['Activity']=='Light']
    print("Filtered data shape:", filtered_data.shape)
    data['Electricity'] = filtered_data['Cost'].tolist()
    print("Electricity data:", data['Electricity'])
    
    # data['Water'] = tenant_data['Water'].tolist()
    # data['Gas'] = tenant_data['Gas'].tolist()
    summary = get_usage_summary(llm, tenant_data)
    
   
    
    # Generate utility graphs
    return {
        "summary": summary,
        "electricity_graph": generate_utility_graph(data['Electricity'], "Electricity", "yellow"),
        # "water_graph": generate_utility_graph(data['Water'], "Water", "blue"),
        # "gas_graph": generate_utility_graph(data['Gas'], "Gas", "orange")
    }

def create_pdf_report(results, tenant_id):
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    # Title Styling
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, height - 50, f"Utility Usage Report")

    # Summary Styling with Left Alignment and Approximate Justification
    c.setFont("Helvetica", 12)
    summary_lines = textwrap.wrap(results['summary'], width=80)
    summary_height = len(summary_lines) * 15  # Total height for summary
    summary_start = height - 80
    
    # Draw the summary text with left alignment and spacing adjustments for readability
    for i, line in enumerate(summary_lines):
        # Adjust line positions
        c.drawString(50, summary_start - (i * 15), line)
    
    # Place the graph right after the summary
    graph_start = summary_start - summary_height - 30  # Adjust the padding after the 
    graph = results[f'electricity_graph']
    img_data = BytesIO()
    graph.savefig(img_data, format='png')
    img_data.seek(0)
    img = ImageReader(img_data)
    
    # Graph Dimensions and Position
    graph_width, graph_height = 5 * inch, 3 * inch
    c.drawImage(img, 50, graph_start - graph_height, width=graph_width, height=graph_height)
    plt.close(graph)

    c.save()
    buffer.seek(0)
    return buffer

def generate_utility_graph(data, title, color):
    print(data)
    fig = plt.figure()  # Create and store the figure object
    plt.plot(data, color=color)
    plt.title(title)
    plt.xlabel('Time')
    plt.ylabel('Usage')
    plt.grid()
    return fig  # Return the figure object instead of plt

def get_tenant_data(df, tenant_id):
    print("Df shape:",df.shape)
    # Filter DataFrame for specific tenant
    tenant_df = df[df['TenantID'] == tenant_id]
    return tenant_df

def get_usage_summary(llm, tenant_data):
    summary_prompt = (
        "Please summarize the usage data, providing useful insights to help the user understand their usage pattern: "
        f"{tenant_data.to_dict('records')}"
    )
    return llm.invoke(summary_prompt)

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000,debug=True)