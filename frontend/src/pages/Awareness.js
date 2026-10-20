const FACTS = [
  { icon: '💧', title: 'One donation, three lives', text: 'A single blood donation can be separated into red cells, plasma, and platelets — helping up to three different patients.' },
  { icon: '⏱️', title: 'It takes about 10 minutes', text: 'The actual blood draw is quick. The whole visit, including a short health check, usually takes under an hour.' },
  { icon: '🔁', title: 'Your body replenishes it', text: 'Plasma is replaced within 24 hours and red blood cells within a few weeks — the standard 90-day gap keeps donation safe.' },
  { icon: '🚑', title: 'Demand is constant', text: 'Accident victims, surgery patients, and people with chronic conditions like thalassemia need blood every single day.' },
  { icon: '🩺', title: 'It is a free health check', text: 'Every donation includes a basic screening of your pulse, blood pressure, hemoglobin, and temperature.' },
  { icon: '🤝', title: 'No perfect substitute exists', text: 'Blood cannot be manufactured — voluntary donors are the only source for patients who need a transfusion.' },
];

export default function Awareness() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Why donate blood?</h1>
        <p>A few minutes of your time can be the difference between life and death for someone nearby. Here's why it matters.</p>
      </div>

      <div className="card-grid">
        {FACTS.map(f => (
          <div className="info-card" key={f.title}>
            <div className="card-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </div>
        ))}
      </div>

      <div className="panel" style={{ marginTop: 'var(--space-6)' }}>
        <h3>Ready to help?</h3>
        <p style={{ marginBottom: 'var(--space-4)' }}>
          Register as a donor and set your blood type and location so requesters nearby can find you when it matters most.
        </p>
        <a className="btn btn-primary" href="/register">Become a donor</a>
      </div>
    </div>
  );
}
