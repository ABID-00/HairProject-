from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pandas as pd
import joblib

app = Flask(__name__)
CORS(app)

# Load model files
BASE_DIR = os.path.dirname(__file__)

model = joblib.load(os.path.join(BASE_DIR, "hairfall_model.pkl"))
scaler = joblib.load(os.path.join(BASE_DIR, "scaler.pkl"))
model_columns = joblib.load(os.path.join(BASE_DIR, "model_columns.pkl"))


def generate_suggestions(user_data):
    suggestions = []

    if user_data.get('Stress') in ['Moderate', 'High']:
        suggestions.append("Stress Management: High stress triggers hair thinning. Consider meditation or yoga.")

    if user_data.get('Nutritional Deficiencies') != 'No':
        suggestions.append(f"Dietary Check: Address your {user_data.get('Nutritional Deficiencies')} with a doctor.")

    if user_data.get('Poor Hair Care Habits') == 'Yes':
        suggestions.append("Hair Care: Avoid tight hairstyles, excessive heat styling, and harsh chemical treatments.")

    if user_data.get('Smoking') == 'Yes':
        suggestions.append("Lifestyle: Smoking restricts blood flow to hair follicles. Quitting can improve hair health.")

    if user_data.get('Environmental Factors') == 'Yes':
        suggestions.append("Environment: If you have hard water, consider a shower filter.")

    if not suggestions:
        suggestions.append("Consult a Dermatologist: This may be genetic or hormonal.")

    return suggestions


@app.route('/')
def home():
    return "Flask API is running!"


@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        user_data = request.json

        df = pd.DataFrame([user_data])
        df_encoded = pd.get_dummies(df)
        df_encoded = df_encoded.reindex(columns=model_columns, fill_value=0)

        df_scaled = scaler.transform(df_encoded)

        prediction = int(model.predict(df_scaled)[0])

        suggestions = generate_suggestions(user_data)

        result = "YES (High Possibility of Hair Fall)" if prediction == 1 else "NO (Low Possibility of Hair Fall)"

        return jsonify({
            'prediction_result': result,
            'suggestions': suggestions
        })

    except Exception as e:
        print("🔥 ERROR OCCURRED:", str(e))
        return jsonify({'error': str(e)}), 500


@app.route('/api/get_suggestions', methods=['POST'])
def get_suggestions():
    try:
        user_data = request.json
        stage = user_data.get('Stage')

        suggestions = generate_suggestions(user_data)

        if stage in ['1', '2']:
            suggestions.insert(0, "Stage Treatment: Early stage treatment is highly effective.")
        elif stage in ['3', '4', '5']:
            suggestions.insert(0, "Stage Treatment: Medical treatment recommended.")
        elif stage in ['6', '7']:
            suggestions.insert(0, "Stage Treatment: Hair transplant may be required.")

        return jsonify({'suggestions': suggestions})

    except Exception as e:
        print("🔥 ERROR OCCURRED:", str(e))
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    import os
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)