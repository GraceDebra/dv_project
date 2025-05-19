from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import joblib
import os

app = Flask(__name__)
CORS(app)

# Load model from backend directory
# model_path = os.path.join(os.path.dirname(__file__), 'risk_model.pkl')
model = joblib.load(open("risk_model.pkl", "rb"))
model_accuracy = joblib.load('model_accuracy.pkl')

EMPLOYMENT_MAP = {
    "unemployed": 0,
    "semi employed": 1,
    "employed": 2
}

EDUCATION_MAP = {
    "primary": 0,
    "secondary": 1,
    "tertiary": 2
}

MARITAL_STATUS_MAP = {
    "single": 1,
    "married": 0,
#     "divorced": 2,
#     "widowed": 3
}

VIOLENCE_MAP = {
    "no": 0,
    "yes": 1
}


@app.route('/')
def home():
       return jsonify({"message": "Risk assessment API is running"})

@app.route('/predict', methods=['POST'])
def predict():
       data = request.json  # Get data from the request
       # data = request.json

       try:
              features = [
                     # int(data['age']),
                     float(data['income']),
                     EDUCATION_MAP[data['education'].lower()],
                     EMPLOYMENT_MAP[data['employment'].lower()],
                     MARITAL_STATUS_MAP[data['marital_status'].lower()],
                     VIOLENCE_MAP[data['violence'].lower()]
              ]
              
              prediction = model.predict([features])
              return jsonify({'risk_level': prediction[0], 'accuracy_score': round(model_accuracy * 100, 2)})
       except KeyError as e:
              return jsonify({'error': f"Missing or invalid value for: {e}"}), 400
       # prediction = model.predict([data])  # Make prediction
       # return jsonify({'risk_level': prediction[0]})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
