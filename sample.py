import json
import pandas as pd
import matplotlib.pyplot as plt
import io
import base64
from langchain.llms import OpenAI
from langchain import PromptTemplate
from langchain_experimental.agents.agent_toolkits import create_pandas_dataframe_agent
from langchain.agents.agent_types import AgentType

# Initialize OpenAI LLM
llm = OpenAI(model_name="gpt-3.5-turbo-instruct", temperature=0)

def analyze_tenant_data(event, context):
    # Read CSV data (assuming it's stored in S3 or passed as a parameter)
    # For this example, we'll assume the CSV data is passed in the event
    csv_data = event.get('csv_data')
    data = pd.read_csv(io.StringIO(csv_data))
    
    # Create pandas dataframe agent
    agent = create_pandas_dataframe_agent(
        llm,
        data,
        verbose=False,
        agent_type=AgentType.ZERO_SHOT_REACT_DESCRIPTION
    )
    
    # Analyze data for a specific tenant
    tenant_id = event.get('tenant_id', 1)
    
    tenant_prompt = PromptTemplate(
        input_variables=["tenant"],
        template="Filter the data where tenant is {tenant}"
    )
    tenant_data = agent.run(tenant_prompt.format(tenant=tenant_id))
    
    # Generate summary
    summary_prompt = (
        "Please summarize the usage data, with useful insights that can help the user understand their usage pattern"
        f"{tenant_data}"
    )
    summary = llm(summary_prompt)
    
    # Generate usage graphs
    utilities = ['electricity', 'water', 'gas']
    graphs = {}
    
    for utility in utilities:
        graph_prompt = PromptTemplate(
            input_variables=["tenant", "utility"],
            template=f"Generate usage graph for the {{utility}} utility usage of {{tenant}} based on the following data with {'yellow' if utility == 'electricity' else 'blue' if utility == 'water' else 'orange'} color and no label in x-axis"
        )
        graph_result = agent.run(graph_prompt.format(tenant=f"tenant{tenant_id}", utility=utility))
        
        # Save the graph as base64 encoded string
        img_buffer = io.BytesIO()
        plt.savefig(img_buffer, format='png')
        img_buffer.seek(0)
        img_base64 = base64.b64encode(img_buffer.getvalue()).decode('utf-8')
        graphs[utility] = img_base64
        plt.close()
    
    # Generate pie chart
    pie_chart = agent.run("Create a pie chart with the Activity cost to the total cost")
    img_buffer = io.BytesIO()
    plt.savefig(img_buffer, format='png')
    img_buffer.seek(0)
    pie_chart_base64 = base64.b64encode(img_buffer.getvalue()).decode('utf-8')
    plt.close()
    
    # Prepare the response
    response = {
        'summary': summary,
        'graphs': graphs,
        'pie_chart': pie_chart_base64,
        'total_electricity_cost': agent.run(f"What is total sum of activity=Electricity for tenant {tenant_id}"),
        'total_cost': agent.run(f"what is the total cost for tenant {tenant_id}")
    }
    
    return {
        'statusCode': 200,
        'body': json.dumps(response)
    }