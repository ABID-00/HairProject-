import React, { useState } from 'react';
import { useParams, useLocation, Link} from 'react-router-dom';


export default function StageTreatment() {
  const { stageId } = useParams(); // Gets the stage number from the URL
  // 1. Catch the gender passed from Assessment.jsx
  const location = useLocation();
  const gender = location.state?.gender || "Unknown"; 

  // 2. Check if this is a severe stage requiring a doctor
  const isSevereStage = (gender === 'Male' && (stageId === '7' || stageId === '6')) || (gender === 'Female' && stageId === '4');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Added all the form data states from Predict.jsx (omitted Age as it's not needed for suggestions)
  const [formData, setFormData] = useState({
    Genetics: '',
    'Hormonal Changes': '',
    'Medical Conditions': '',
    'Medications & Treatments': '',
    'Nutritional Deficiencies': '',
    Stress: '',
    'Poor Hair Care Habits': '',
    'Environmental Factors': '',
    Smoking: '',
    'Weight Loss': '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // 1. Create a copy of the form data
    const payloadToSend = {
        ...formData,
        Stage: stageId // Pass the stage down to the backend!
    };

    // 2. CONVERT COMPLEX DROPDOWNS TO "Yes"
    if (payloadToSend['Medical Conditions'] !== 'No' && payloadToSend['Medical Conditions'] !== '') {
        payloadToSend['Medical Conditions'] = 'Yes';
    }
    
    if (payloadToSend['Medications & Treatments'] !== 'No' && payloadToSend['Medications & Treatments'] !== '') {
        payloadToSend['Medications & Treatments'] = 'Yes';
    }

    try {
      // 3. Connect to the suggestions endpoint
      const response = await fetch('https://hairproject.onrender.com/api/get_suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadToSend),
      });

      const data = await response.json();
      
      // 4. ONLY set suggestions here!
      setSuggestions(data.suggestions);
      
    } catch (error) {
      console.error("Error connecting to backend:", error);
      alert("Failed to connect to the backend. Make sure your Flask app is running!");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSevereStage) {
    return (
      <div className="min-h-screen bg-brand-bg py-16 md:py-24">
        <div className="max-w-2xl mx-auto px-6 text-center animate-fade-in">
          <div className="bg-brand-white p-10 rounded-2xl border border-brand-border shadow-card">
            
            <div className="h-20 w-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
              🩺
            </div>
            
            <h2 className="text-3xl font-semibold text-brand-text mb-4">
              Medical Consultation Recommended
            </h2>
            
            <p className="text-brand-muted text-lg leading-relaxed mb-8">
              Based on your selection (Stage {stageId}), lifestyle changes and standard routines are usually not enough to restore hair density. We highly recommend consulting with a clinical expert to discuss advanced restorative options.
            </p>
            
            <Link 
              to="/contact" 
              className="inline-block w-full sm:w-auto bg-brand-green text-brand-white font-semibold px-8 py-4 rounded-xl hover:brightness-95 hover:scale-[1.02] transition duration-300 shadow-soft"
            >
              Book a Free Doctor Consultation
            </Link>

            <button 
               onClick={() => window.history.back()}
               className="mt-6 block w-full text-sm font-semibold text-brand-muted hover:text-brand-text transition"
            >
               Go back to Assessment
            </button>
            
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg py-16">
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-semibold text-brand-text">
            Stage {stageId} <span className="text-brand-green">Action Plan</span>
          </h1>
          <p className="mt-4 text-brand-muted">Tell us about your lifestyle so we can tailor your treatment plan.</p>
        </div>

        <div className="rounded-2xl border border-brand-border bg-brand-white p-8 shadow-card">
             <form onSubmit={handleSubmit} className="space-y-8">
                
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

                <button type="submit" disabled={isLoading} className="w-full bg-brand-green text-brand-white font-semibold p-4 rounded-xl mt-4 hover:brightness-95 transition disabled:opacity-70">
                  {isLoading ? 'Generating Plan...' : 'Get My Suggestions'}
                </button>
             </form>

             {/* Results Area */}
             {suggestions && suggestions.length > 0 && (
                <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-xl animate-fade-in">
                    <h3 className="text-xl font-semibold text-brand-text mb-4">Your Custom Treatment Plan (Stage {stageId})</h3>
                    <ul className="space-y-3">
                      {suggestions.map((s, i) => (
                        <li key={i} className="flex gap-3 text-sm text-brand-muted leading-relaxed">
                          <span className="text-brand-green mt-1">✓</span> 
                          {s}
                        </li>
                      ))}
                    </ul>
                </div>
             )}
        </div>
      </div>
    </div>
  );
}