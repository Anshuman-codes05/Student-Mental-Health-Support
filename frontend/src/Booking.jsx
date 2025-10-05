import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db } from "./firebase"; // Assuming firebase is configured for firestore
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";

export default function Booking() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [counselor, setCounselor] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);

  const counselorOptions = [
    { label: "Dr. Smith", value: "Dr. Smith" },
    { label: "Ms. Johnson", value: "Ms. Johnson" },
    { label: "Mr. Lee", value: "Mr. Lee" },
  ];

  const timeOptions = [
    "09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"
  ];

  const fetchAppointments = async () => {
    setIsLoadingAppointments(true);
    try {
      const q = query(collection(db, "appointments"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const fetchedAppointments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAppointments(fetchedAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setFeedback({ type: "error", message: "Failed to load appointments." });
    } finally {
      setIsLoadingAppointments(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !counselor) {
      setFeedback({ type: "error", message: "Please fill all booking details." });
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      await addDoc(collection(db, "appointments"), {
        date: selectedDate,
        time: selectedTime,
        counselor: counselor,
        timestamp: new Date(),
        status: "booked",
      });
      setFeedback({ type: "success", message: "Appointment booked successfully!" });
      setSelectedDate("");
      setSelectedTime("");
      setCounselor("");
      fetchAppointments(); // Refresh the list of appointments
    } catch (error) {
      console.error("Error booking appointment:", error);
      setFeedback({ type: "error", message: "Failed to book appointment. Please try again." });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto p-8 bg-white rounded-3xl shadow-large border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl lg:text-5xl font-heading font-extrabold mb-8 text-primary tracking-tight">Book an Appointment 🗓️</h2>

      {feedback && (
        <motion.div
          className={`mb-6 px-6 py-4 rounded-xl text-white font-medium shadow-soft ${feedback.type === 'success' ? 'bg-success-500' : 'bg-error-500'}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-center space-x-2">
            <span>{feedback.type === 'success' ? '✅' : '❌'}</span>
            <span>{feedback.message}</span>
          </div>
        </motion.div>
      )}

      <form onSubmit={handleBooking} className="space-y-6 mb-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.3 }}>
          <label htmlFor="date" className="block text-base font-medium text-text-primary mb-2 text-left">Select Date</label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input-field"
            disabled={isSubmitting}
            required
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.3 }}>
          <label htmlFor="time" className="block text-base font-medium text-text-primary mb-2 text-left">Select Time</label>
          <select
            id="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="input-field appearance-none pr-10"
            disabled={isSubmitting}
            required
          >
            <option value="">Choose a time</option>
            {timeOptions.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.3 }}>
          <label htmlFor="counselor" className="block text-base font-medium text-text-primary mb-2 text-left">Select Counselor</label>
          <select
            id="counselor"
            value={counselor}
            onChange={(e) => setCounselor(e.target.value)}
            className="input-field appearance-none pr-10"
            disabled={isSubmitting}
            required
          >
            <option value="">Choose a counselor</option>
            {counselorOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.3 }}>
          <motion.button
            type="submit"
            className="btn-primary w-full"
            disabled={isSubmitting}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Booking...</span>
              </div>
            ) : (
              "Confirm Booking"
            )}
          </motion.button>
        </motion.div>
      </form>

      <h3 className="text-3xl font-heading font-bold mt-12 mb-6 text-primary tracking-wide">Your Appointments</h3>
      {isLoadingAppointments && <p className="text-gray-600 italic mb-4">Loading appointments...</p>}
      {!isLoadingAppointments && appointments.length === 0 && (
        <p className="text-gray-600 italic mb-4">No appointments booked yet.</p>
      )}
      {!isLoadingAppointments && appointments.length > 0 && (
        <motion.ul
          className="list-none space-y-4 text-left max-h-80 overflow-y-auto pr-2 custom-scrollbar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {appointments.map((appt, idx) => (
            <motion.li
              key={appt.id}
              className="card-elevated p-4 flex items-center justify-between"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <div>
                <p className="text-text-primary text-lg font-medium">Counselor: {appt.counselor}</p>
                <p className="text-text-secondary text-sm">Date: {appt.date}</p>
                <p className="text-text-secondary text-sm">Time: {appt.time}</p>
              </div>
              <small className="text-primary text-sm">Booked: {new Date(appt.timestamp.seconds * 1000).toLocaleString()}</small>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </motion.div>
  );
}
