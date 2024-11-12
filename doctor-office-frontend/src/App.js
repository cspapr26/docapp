import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = "k8s-default-appingre-5fda151b2b-1177123344.us-west-1.elb.amazonaws.com" || 'http://localhost:3000'; // Use localhost for browser access

function App() {
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({ patientName: '', doctorName: '', date: '' });

  const fetchAppointments = () => {
    console.log('Fetching appointments from:', API_URL);
    fetch(`http://k8s-default-appingre-5fda151b2b-1177123344.us-west-1.elb.amazonaws.com/api/appointments`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch appointments: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Fetched appointments:', data);
        setAppointments(data);
      })
      .catch(err => {
        console.error('Error fetching appointments:', err);
        alert('Failed to load appointments. Please try again later.');
      });
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!form.patientName || !form.doctorName || !form.date) {
      alert("Please fill out all fields.");
      return;
    }

    console.log('Submitting appointment:', form);
    fetch(`http://k8s-default-appingre-5fda151b2b-1177123344.us-west-1.elb.amazonaws.com/api/appointments/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to save appointment: ${res.statusText}`);
        }
        return res.json();
      })
      .then(newAppointment => {
        console.log('New appointment saved:', newAppointment);
        setForm({ patientName: '', doctorName: '', date: '' });
        fetchAppointments(); // Refetch appointments after saving
      })
      .catch(err => {
        console.error('Error saving appointment:', err);
        alert("Failed to save appointment. Please try again later.");
      });
  };

  return (
    <div className="App">
      <div className="logo-header">
        <svg className="app-logo-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 100" width="100%" height="100%">
          <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle">
            Doctor's Office Appointments
          </text>
        </svg>
      </div>

      <form className="appointment-form" onSubmit={handleSubmit}>
        <input
          className="form-input"
          placeholder="Patient Name"
          value={form.patientName}
          onChange={(e) => setForm({ ...form, patientName: e.target.value })}
        />
        <input
          className="form-input"
          placeholder="Doctor Name"
          value={form.doctorName}
          onChange={(e) => setForm({ ...form, doctorName: e.target.value })}
        />
        <input
          className="form-input"
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
        <button className="submit-button" type="submit">Book Appointment</button>
      </form>

      {appointments.length > 0 ? (
        <ul className="appointments-list">
          {appointments.map((appt) => (
            <li className="appointment-item" key={appt._id}>
              <strong>{appt.patientName}</strong> with Dr. <strong>{appt.doctorName}</strong> on{' '}
              <strong>{new Date(appt.date).toLocaleDateString()}</strong>
            </li>
          ))}
        </ul>
      ) : (
        <p>No appointments available.</p>
      )}
    </div>
  );
}

export default App;