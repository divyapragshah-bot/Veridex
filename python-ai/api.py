"""
Veridex Python AI Layer
=======================
Optional ML microservice for enhanced URL phishing classification.
Runs independently and can be called by the Node.js backend.

Run:
  python api.py
  # or:
  flask --app api run --port 8000
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from model import predict_url, extract_url_features
import traceback

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'online', 'service': 'Veridex Python AI', 'version': '1.0.0'})

@app.route('/predict-url', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        if not data or 'url' not in data:
            return jsonify({'error': 'URL is required'}), 400

        url = data['url'].strip()
        features = extract_url_features(url)
        result = predict_url(url, features)

        return jsonify({
            'success': True,
            'url': url,
            'prediction': result['prediction'],       # 'phishing' or 'legitimate'
            'confidence': result['confidence'],        # 0.0 - 1.0
            'riskScore': result['risk_score'],         # 0 - 100
            'features': features,
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print('\n🐍  Veridex Python AI running on http://localhost:8000')
    print('📡  Health: http://localhost:8000/health\n')
    app.run(host='0.0.0.0', port=8000, debug=True)
