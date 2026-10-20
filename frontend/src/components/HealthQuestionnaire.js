import { useState } from 'react';
import api from '../utils/api';

const QUESTIONS = [
  { key: 'feelingWell', label: 'Feeling well today (no fever or cold)?' },
  { key: 'onMedication', label: 'Currently taking medication or antibiotics?' },
  { key: 'recentSurgery', label: 'Surgery or a tattoo in the last 6 months?' },
  { key: 'chronicIllness', label: 'Any chronic illness (diabetes, heart disease)?' },
  { key: 'consumedAlcohol', label: 'Consumed alcohol in the last 24 hours?' },
  { key: 'weightAbove50', label: 'Weight above 50 kg?' }
];

export default function HealthQuestionnaire() {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const handleAnswer = (key, value) => setAnswers({ ...answers, [key]: value });

  const handleSubmit = async () => {
    const res = await api.post('/donors/health-screening', answers);
    setResult(res.data);
  };

  return (
    <div className="panel">
      <h3>Pre-donation health screening</h3>

      {QUESTIONS.map(q => (
        <div className="question-row" key={q.key}>
          <p>{q.label}</p>
          <div className="radio-group">
            <label><input type="radio" name={q.key} onChange={() => handleAnswer(q.key, true)} /> Yes</label>
            <label><input type="radio" name={q.key} onChange={() => handleAnswer(q.key, false)} /> No</label>
          </div>
        </div>
      ))}

      <button className="btn btn-primary btn-sm" style={{ marginTop: 16 }} onClick={handleSubmit}>
        Submit screening
      </button>

      {result && (
        <div className={`eligibility-banner ${result.eligible ? 'eligible' : 'not-eligible'}`}>
          {result.message}
        </div>
      )}

      <span className="disclaimer">
        This is a preliminary screening only. Final eligibility is confirmed by medical staff at the donation site.
      </span>
    </div>
  );
}
