import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Assessment() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userInfo, setUserInfo] = useState({ name: '', email: '', gender: '' });

  const handleInfoSubmit = (e) => {
    e.preventDefault();
    setStep(2); // Move to the image selection section
  };

  // Male Cards (Norwood Scale roughly)
  const maleStages = [
    { id: 1, title: "Stage 1", desc: "Minor recession", img: "https://assureclinic.com/wp-content/uploads/2024/09/1-1.jpg" },
    { id: 2, title: "Stage 2", desc: "Triangular recession", img: "https://assureclinic.com/wp-content/uploads/2024/09/2-1.jpg" },
    { id: 4, title: "Stage 3", desc: "Crown hair loss starts", img: "https://assureclinic.com/wp-content/uploads/2024/09/4-1.jpg" },
    { id: 3, title: "Stage 4", desc: "Deep recession (M shape)", img: "https://assureclinic.com/wp-content/uploads/2024/09/5-1.jpg" },
    { id: 5, title: "Stage 5", desc: "Bridge between crown/front narrowing", img: "https://assureclinic.com/wp-content/uploads/2024/09/6-1.jpg" },
    { id: 6, title: "Stage 6", desc: "Bridge disappears", img: "https://assureclinic.com/wp-content/uploads/2024/09/7.jpg" },
    { id: 7, title: "Stage 7", desc: "Only a horseshoe band remains", img: "src/assets/stage7Male.png" },
  ];

  // Female Cards (Ludwig Scale roughly)
  const femaleStages = [
    { id: 1, title: "Stage 1", desc: "Mild thinning at the part", img: "src/assets/femaleS1.png" },
    { id: 2, title: "Stage 2", desc: "Increased widening of the part", img: "src/assets/femaleS2.png" },
    { id: 3, title: "Stage 3", desc: "Diffuse thinning across the top", img: "src/assets/femaleS3.png" },
    // { id: 4, title: "Stage 4", desc: "Extensive thinning/visible scalp", img: "src/assets/femaleS4.png" },
  ];

  const stagesToDisplay = userInfo.gender === 'Male' ? maleStages : femaleStages;

  const handleStageClick = (stageId) => {
    // Navigate to the stage page, but secretly pass the user's gender in the background!
    navigate(`/stage/${stageId}`, { state: { gender: userInfo.gender } });
  };

  return (
    <div className="min-h-screen bg-brand-bg py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        
        {step === 1 && (
          <div className="max-w-md mx-auto bg-brand-white p-8 rounded-2xl shadow-card border border-brand-border">
            <h2 className="text-2xl font-semibold text-brand-text mb-6">Let's get started</h2>
            <form onSubmit={handleInfoSubmit} className="space-y-4">
              <input type="text" required placeholder="Full Name" 
                className="w-full p-3 border border-brand-border rounded-xl focus:ring-1 focus:ring-brand-green"
                onChange={(e) => setUserInfo({...userInfo, name: e.target.value})} />
              
              <input type="email" required placeholder="Email Address" 
                className="w-full p-3 border border-brand-border rounded-xl focus:ring-1 focus:ring-brand-green"
                onChange={(e) => setUserInfo({...userInfo, email: e.target.value})} />
              
              <select required className="w-full p-3 border border-brand-border rounded-xl focus:ring-1 focus:ring-brand-green"
                onChange={(e) => setUserInfo({...userInfo, gender: e.target.value})}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>

              <button type="submit" className="w-full bg-brand-green text-brand-white p-3 rounded-xl font-semibold hover:brightness-95 transition">
                Next Step
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-semibold text-brand-text mb-2 text-center">Select your current stage</h2>
            <p className="text-brand-muted text-center mb-8">Choose the image that best matches your hair right now.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              
              {/* Option 1: Good Hair Condition (Always routes to Prediction) */}
              <div 
                onClick={() => navigate('/predict')}
                className="cursor-pointer bg-brand-white rounded-xl border-2 border-brand-green/30 p-4 shadow-soft hover:shadow-card hover:border-brand-green transition group"
              >
                <div className="h-32 bg-green-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-100 transition">
                  <span className="text-4xl">✨</span>
                </div>
                <h3 className="font-semibold text-brand-text">Good Hair Condition</h3>
                <p className="text-xs text-brand-muted mt-1">I want to prevent future hair fall.</p>
              </div>

              {/* Dynamic Stages (Routes to StageTreatment with the ID in the URL) */}
              {stagesToDisplay.map((stage) => (
                <div 
                  key={stage.id} 
                  onClick={() => handleStageClick(stage.id)}
                  className="cursor-pointer bg-brand-white rounded-xl border border-brand-border p-4 shadow-soft hover:shadow-card transition"
                >
                  <img src={stage.img} alt={stage.title} className="w-full h-32 object-cover rounded-lg mb-4 bg-gray-100" />
                  <h3 className="font-semibold text-brand-text">{stage.title}</h3>
                  <p className="text-xs text-brand-muted mt-1">{stage.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}