import React, { useState } from 'react';

export default function Predict() {
  const [formData, setFormData] = useState({
    Genetics: '',
    'Hormonal Changes': '',
    'Medical Conditions': '',
    'Medications & Treatments': '',
    'Nutritional Deficiencies': '',
    Stress: '',
    Age: '',
    'Poor Hair Care Habits': '',
    'Environmental Factors': '',
    Smoking: '',
    'Weight Loss': '',
  });

  const [predictionResult, setPredictionResult] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // 1. Create a copy of the form data to send to the backend
    const payloadToSend = {
        ...formData,
        Age: parseInt(formData.Age) // Ensure Age is sent as a number
    };

    // 2. CONVERT COMPLEX DROPDOWNS TO "Yes"
    // If it's not "No" and not empty, it must be a specific condition, so change it to "Yes"
    if (payloadToSend['Medical Conditions'] !== 'No' && payloadToSend['Medical Conditions'] !== '') {
        payloadToSend['Medical Conditions'] = 'Yes';
    }
    
    if (payloadToSend['Medications & Treatments'] !== 'No' && payloadToSend['Medications & Treatments'] !== '') {
        payloadToSend['Medications & Treatments'] = 'Yes';
    }

    try {
      const response = await fetch('https://hairproject.onrender.com/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // 3. Send the modified payload instead of the raw formData
        body: JSON.stringify(payloadToSend), 
      });

      const data = await response.json();
      setPredictionResult(data.prediction_result);
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error("Error connecting to backend:", error);
      alert("Failed to connect to the prediction server. Make sure your Flask app is running!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        
        {/* Header Section */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-semibold text-brand-text">
            Hair Health <span className="text-brand-green">Assessment</span>
          </h1>
          <p className="mt-4 text-base md:text-lg text-brand-muted leading-relaxed">
            Fill out this quick clinical assessment to understand your hair fall and get a personalized care plan.
          </p>
        </div>

        {/* Form Section */}
        <div className="rounded-2xl border border-brand-border bg-brand-white p-8 md:p-12 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* 1. Age */}
            <div>
              <label className="block text-sm font-semibold text-brand-text mb-2">Age</label>
              <input
                type="number"
                name="Age"
                required
                min="15"
                max="100"
                value={formData.Age}
                onChange={handleChange}
                className="w-full rounded-xl border border-brand-border bg-brand-white px-4 py-3 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green transition duration-300"
                placeholder="Enter your age"
              />
            </div>

            {/* Grid for Yes/No Questions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* 2. Genetics */}
              <div>
                <label className="block text-sm font-semibold text-brand-text mb-2">Family History of Baldness (Genetics)</label>
                <select name="Genetics" required value={formData.Genetics} onChange={handleChange} className="w-full rounded-xl border border-brand-border bg-brand-white px-4 py-3 text-sm focus:border-brand-green focus:outline-none transition duration-300">
                  <option value="" disabled>Select an option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* 3. Hormonal Changes */}
              <div>
                <label className="block text-sm font-semibold text-brand-text mb-2">Recent Hormonal Changes</label>
                <select name="Hormonal Changes" required value={formData['Hormonal Changes']} onChange={handleChange} className="w-full rounded-xl border border-brand-border bg-brand-white px-4 py-3 text-sm focus:border-brand-green focus:outline-none transition duration-300">
                  <option value="" disabled>Select an option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* 8. Poor Hair Care Habits */}
              <div>
                <label className="block text-sm font-semibold text-brand-text mb-2">Poor Hair Care Habits</label>
                <select name="Poor Hair Care Habits" required value={formData['Poor Hair Care Habits']} onChange={handleChange} className="w-full rounded-xl border border-brand-border bg-brand-white px-4 py-3 text-sm focus:border-brand-green focus:outline-none transition duration-300">
                  <option value="" disabled>Select an option</option>
                  <option value="Yes">Yes (Tight styling, excessive heat, harsh chemicals)</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* 9. Environmental Factors */}
              <div>
                <label className="block text-sm font-semibold text-brand-text mb-2">Harsh Environmental Factors</label>
                <select name="Environmental Factors" required value={formData['Environmental Factors']} onChange={handleChange} className="w-full rounded-xl border border-brand-border bg-brand-white px-4 py-3 text-sm focus:border-brand-green focus:outline-none transition duration-300">
                  <option value="" disabled>Select an option</option>
                  <option value="Yes">Yes (Hard water, high pollution)</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* 10. Smoking */}
              <div>
                <label className="block text-sm font-semibold text-brand-text mb-2">Do you smoke?</label>
                <select name="Smoking" required value={formData.Smoking} onChange={handleChange} className="w-full rounded-xl border border-brand-border bg-brand-white px-4 py-3 text-sm focus:border-brand-green focus:outline-none transition duration-300">
                  <option value="" disabled>Select an option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* 11. Weight Loss */}
              <div>
                <label className="block text-sm font-semibold text-brand-text mb-2">Significant Recent Weight Loss</label>
                <select name="Weight Loss" required value={formData['Weight Loss']} onChange={handleChange} className="w-full rounded-xl border border-brand-border bg-brand-white px-4 py-3 text-sm focus:border-brand-green focus:outline-none transition duration-300">
                  <option value="" disabled>Select an option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

               {/* 6. Stress */}
               <div>
                <label className="block text-sm font-semibold text-brand-text mb-2">Current Stress Level</label>
                <select name="Stress" required value={formData.Stress} onChange={handleChange} className="w-full rounded-xl border border-brand-border bg-brand-white px-4 py-3 text-sm focus:border-brand-green focus:outline-none transition duration-300">
                  <option value="" disabled>Select an option</option>
                  <option value="Low">Low</option>
                  <option value="Moderate">Moderate</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <hr className="border-brand-border my-6" />

            {/* Complex Dropdowns */}
            <div className="space-y-6">
              {/* 4. Medical Conditions */}
              <div>
                <label className="block text-sm font-semibold text-brand-text mb-2">Medical Conditions</label>
                <select name="Medical Conditions" required value={formData['Medical Conditions']} onChange={handleChange} className="w-full rounded-xl border border-brand-border bg-brand-white px-4 py-3 text-sm focus:border-brand-green focus:outline-none transition duration-300">
                  <option value="" disabled>Select an option</option>
                  <option value="No">None</option>
                  <option value="Alopecia Areata">Alopecia Areata</option>
                  <option value="Thyroid Problems">Thyroid Problems</option>
                  <option value="Scalp Infection">Scalp Infection</option>
                  <option value="Psoriasis">Psoriasis</option>
                  <option value="Dermatitis">Dermatitis</option>
                </select>
              </div>

              {/* 5. Medications & Treatments */}
              <div>
                <label className="block text-sm font-semibold text-brand-text mb-2">Medications & Treatments</label>
                <select name="Medications & Treatments" required value={formData['Medications & Treatments']} onChange={handleChange} className="w-full rounded-xl border border-brand-border bg-brand-white px-4 py-3 text-sm focus:border-brand-green focus:outline-none transition duration-300">
                  <option value="" disabled>Select an option</option>
                  <option value="No">None</option>
                  <option value="Chemotherapy">Chemotherapy</option>
                  <option value="Heart Medication">Heart Medication</option>
                  <option value="Antidepressants">Antidepressants</option>
                  <option value="Steroids">Steroids</option>
                </select>
              </div>

              {/* 7. Nutritional Deficiencies */}
              <div>
                <label className="block text-sm font-semibold text-brand-text mb-2">Nutritional Deficiencies</label>
                <select name="Nutritional Deficiencies" required value={formData['Nutritional Deficiencies']} onChange={handleChange} className="w-full rounded-xl border border-brand-border bg-brand-white px-4 py-3 text-sm focus:border-brand-green focus:outline-none transition duration-300">
                  <option value="" disabled>Select an option</option>
                  <option value="No">None</option>
                  <option value="Iron deficiency">Iron deficiency</option>
                  <option value="Vitamin D deficiency">Vitamin D deficiency</option>
                  <option value="Biotin deficiency">Biotin deficiency</option>
                  <option value="Omega-3 fatty acid deficiency">Omega-3 fatty acid deficiency</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center rounded-xl bg-brand-green text-brand-white px-6 py-4 text-base font-semibold shadow-soft hover:brightness-95 hover:scale-[1.01] active:scale-[0.99] transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Analyzing Profile...' : 'Get My Prediction'}
              </button>
            </div>
          </form>

          {/* Results Section */}
          {predictionResult && (
            <div className="mt-10 pt-8 border-t border-brand-border animate-fade-in">
              <div className={`p-6 rounded-xl border ${predictionResult.includes("YES") ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}>
                <h3 className="text-xl font-semibold text-brand-text mb-2">
                  Assessment Result:
                </h3>
                <p className={`text-2xl font-bold ${predictionResult.includes("YES") ? "text-red-600" : "text-green-600"}`}>
                  {predictionResult}
                </p>
                
                {suggestions && suggestions.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-brand-text mb-3 uppercase tracking-wider">Your Personalized Action Plan</h4>
                    <ul className="space-y-3">
                      {suggestions.map((suggestion, index) => (
                        <li key={index} className="flex gap-3 text-sm text-brand-muted leading-relaxed">
                          <span className="text-brand-green mt-1">✓</span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}