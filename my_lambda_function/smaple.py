import json
import matplotlib.pyplot as plt
import boto3
from io import BytesIO
from langchain_openai import OpenAI
from langchain.prompts import PromptTemplate
from langchain_experimental.agents.agent_toolkits import create_csv_agent
from langchain.agents.agent_types import AgentType
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from collections import defaultdict

def lambda_handler(event, context):
    # Initialize OpenAI and CSV agent
    llm = OpenAI()
    agent = create_csv_agent(
        llm,
        "s3://tenantactivitylogs/tenant_activity_logs.csv",
        verbose=False,
        agent_type=AgentType.ZERO_SHOT_REACT_DESCRIPTION
    )
    print("Here")
    # Process tenant data
    tenant_id = event.get('tenant_id', 1)
    results = process_tenant_data(agent, llm, tenant_id)
    print("Creating PDF")
    # Create PDF
    pdf_buffer = create_pdf_report(results, tenant_id)

    # Upload PDF to S3
    s3 = boto3.client('s3')
    bucket_name = 'tenantreport'
    pdf_key = f'tenant_{tenant_id}_report.pdf'
    s3.put_object(Bucket=bucket_name, Key=pdf_key, Body=pdf_buffer.getvalue())

    # Return summary and PDF URL
    return {
        'statusCode': 200,
        'body': json.dumps({
            'summary': results['summary'],
            'pdf_url': f"https://{bucket_name}.s3.amazonaws.com/{pdf_key}"
        })
    }

def process_tenant_data(agent, llm, tenant_id):
    tenant_data = get_tenant_data(agent, tenant_id)
    summary = get_usage_summary(llm, tenant_data)
    
    # Using collections to handle data
    data = defaultdict(list)
    
    for entry in eval(tenant_data):  # Assuming tenant_data is a list of dictionaries
        data['Electricity'].append(entry['Electricity'])
        data['Water'].append(entry['Water'])
        data['Gas'].append(entry['Gas'])

    # Generate utility graphs
    return {
        "summary": summary,
        "electricity_graph": generate_utility_graph(data['Electricity'], "Electricity", "yellow"),
        "water_graph": generate_utility_graph(data['Water'], "Water", "blue"),
        "gas_graph": generate_utility_graph(data['Gas'], "Gas", "orange")
    }

def create_pdf_report(results, tenant_id):
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    # Add title
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, height - 50, f"Utility Usage Report for Tenant {tenant_id}")

    # Add summary
    c.setFont("Helvetica", 12)
    summary_lines = [results['summary'][i:i + 80] for i in range(0, len(results['summary']), 80)]
    for i, line in enumerate(summary_lines):
        c.drawString(50, height - 80 - (i * 15), line)

    # Add graphs
    graph_y_positions = [height - 300, height - 550, height - 800]
    for i, utility in enumerate(['electricity', 'water', 'gas']):
        graph = results[f'{utility}_graph']
        img_data = BytesIO()
        graph.savefig(img_data, format='png')
        img_data.seek(0)
        img = ImageReader(img_data)
        c.drawImage(img, 50, graph_y_positions[i], width=500, height=200)
        plt.close(graph)  # Close the figure to free up memory

    c.save()
    buffer.seek(0)
    return buffer

def generate_utility_graph(data, title, color):
    plt.figure()
    plt.plot(data, color=color)
    plt.title(title)
    plt.xlabel('Time')
    plt.ylabel('Usage')
    plt.grid()
    return plt

def get_tenant_data(agent, tenant_id):
    tenant_prompt = PromptTemplate(
        input_variables=["tenant"],
        template="Filter the data where tenant is {tenant}"
    )
    return agent.run(tenant_prompt.format(tenant=tenant_id))

def get_usage_summary(llm, tenant_data):
    summary_prompt = (
        "Please summarize the usage data, providing useful insights to help the user understand their usage pattern: "
        f"{tenant_data}"
    )
    return llm.invoke(summary_prompt)