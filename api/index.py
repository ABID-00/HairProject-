from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib

app = Flask(__name__)
# Enable CORS so your React frontend (usually on port 3000 or 5173) can talk to Flask (port 5000)
CORS(app) 

# Load the trained model files
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
        suggestions.append("Consult a Dermatologist: This may be genetic or hormonal. A doctor can provide targeted treatments.")
        
    return suggestions

@app.route('/')
def home():
    return "Flask API is running!"    

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        # 1. Get data from React
        user_data = request.json
        
        # 2. Convert to Pandas DataFrame
        df = pd.DataFrame([user_data])
        
        # 3. Match the One-Hot Encoding the model expects
        df_encoded = pd.get_dummies(df)
        df_encoded = df_encoded.reindex(columns=model_columns, fill_value=0)
        
        # 4. Scale the data
        df_scaled = scaler.transform(df_encoded)
        
        # 5. Make Prediction
        prediction = int(model.predict(df_scaled)[0])
        
        # 6. Get Suggestions
        suggestions = generate_suggestions(user_data)
        
        # 7. Format the result
        result = "YES (High Possibility of Hair Fall)" if prediction == 1 else "NO (Low Possibility of Hair Fall)"
        
        # 8. Send back to React
        return jsonify({
            'prediction_result': result,
            'suggestions': suggestions
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/get_suggestions', methods=['POST'])
def get_suggestions():
    try:
        user_data = request.json
        stage = user_data.get('Stage')
        
        # 1. Get the base lifestyle suggestions
        suggestions = generate_suggestions(user_data)
        
        # 2. Add Stage-Specific Medical advice
        if stage in ['1', '2']:
            suggestions.insert(0, "Stage Treatment: At this early stage, topical treatments like Minoxidil are highly effective.")
        elif stage in ['3', '4', '5']:
            suggestions.insert(0, "Stage Treatment: Consider consulting a doctor for oral medications (like Finasteride) combined with Minoxidil, or PRP therapy.")
        elif stage in ['6', '7']:
            suggestions.insert(0, "Stage Treatment: At this advanced stage, topical treatments may have limited effect. Hair transplant surgery is typically the most viable option for restoration.")
            
        return jsonify({'suggestions': suggestions})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run()