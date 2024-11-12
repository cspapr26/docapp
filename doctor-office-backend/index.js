const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000', 'http://frontend:3001'], // Allow multiple origins
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Appointment Schema
const AppointmentSchema = new mongoose.Schema({
  patientName: String,
  doctorName: String,
  date: Date,
});

const Appointment = mongoose.model('Appointment', AppointmentSchema);

// Get all appointments
app.get('/api/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find();
    console.log('Fetched appointments:', appointments); // Log fetched appointments
    res.json(appointments);
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Create a new appointment
app.post('/api/appointments', async (req, res) => {
  try {
    console.log('Received new appointment:', req.body);

    const appointment = new Appointment(req.body);
    await appointment.save();

    console.log('Appointment saved successfully:', appointment);

    res.json(appointment);
  } catch (err) {
    console.error('Error saving appointment:', err);
    res.status(500).json({ error: 'Failed to save appointment' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});