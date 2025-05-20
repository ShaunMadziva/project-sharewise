from flask import Flask, jsonify, request
import matplotlib.pyplot as plt
import plotly.graph_objs as go
import io
import base64

app = Flask(__name__)

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Welcome to the Sharewise API for data visualisations."})

@app.route("/generate-visualisation", methods=["POST"])
def generate_visualisation():
    data = request.json

    x = data.get('x', [])
    y = data.get('y', [])

    if not x or not y or len(x) != len(y):
        return jsonify({'error': 'Invalid data received'}), 400

    # Generate a Plotly bar chart
    plotly_fig = go.Figure(data=[go.Bar(x=x, y=y)])
    plotly_fig.update_layout(
        title="Requests per Item",
        xaxis_title="Item Name",
        yaxis_title="Total Requests"
    )

    fig_html = plotly_fig.to_html(full_html=False, include_plotlyjs='cdn')

    return jsonify({'visualisation_html': fig_html})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3001)