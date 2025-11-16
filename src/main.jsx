import React from 'react';
import ReactDOM from 'react-dom/client';
import { useState, useEffect } from 'react';

function App() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/devices');
        const data = await response.json();
        setDevices(data);
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>🛡️ NaashonSecureIoT</h1>
      <p><strong>Status:</strong> Vite + React is working!</p>
      <p>Port: 5174 | Vite v7.2.2</p>
      <button onClick={() => alert('Button works!')}>
        Test Button
      </button>
      <h2>Devices</h2>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {devices.map(device => (
          <div key={device.id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '0.5rem' }}>
            <h3>{device.name}</h3>
            <p>Status: {device.status}</p>
            <p>Value: {device.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
