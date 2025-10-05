// src/MoodTracker.jsx
import React, { useState, useEffect, useRef, useContext } from "react";
import { db } from "./firebase";
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import { Chart } from "chart.js/auto";
import { motion } from "framer-motion"; // Import motion
import { AuthContext } from "./App"; // Import AuthContext
import FirebaseTest from "./FirebaseTest"; // Import Firebase test

export default function MoodTracker() {
  const { currentUser } = useContext(AuthContext); // Get current user from auth context
  const [mood, setMood] = useState("");
  const [moodLogs, setMoodLogs] = useState([]);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [feedback, setFeedback] = useState(null); // New state for user feedback
  const [isLogging, setIsLogging] = useState(false); // New state for logging status
  const [loading, setLoading] = useState(false); // New state for loading moods

  const moodOptions = [
    { label: "😃 Happy", value: "Happy" },
    { label: "😞 Sad", value: "Sad" },
    { label: "😡 Angry", value: "Angry" },
    { label: "😌 Calm", value: "Calm" },
    { label: "😟 Anxious", value: "Anxious" },
  ];

  // Fetch mood logs from Firestore
  const fetchMoods = async () => {
    if (!currentUser) {
      console.log("No current user, clearing mood logs");
      setMoodLogs([]);
      return;
    }

    console.log("Fetching mood logs for user:", currentUser.uid);
    setLoading(true); // Start loading
    try {
      const q = query(collection(db, "moodLogs"), orderBy("timestamp", "asc"));
      const querySnapshot = await getDocs(q);
      console.log("Query snapshot:", querySnapshot.docs.length, "documents");
      const logs = querySnapshot.docs
        .map((doc) => doc.data())
        .filter((log) => log.userId === currentUser.uid); // Filter by current user
      console.log("Filtered logs for current user:", logs.length);
      setMoodLogs(logs);
    } catch (error) {
      console.error("Error fetching mood logs:", error);
      setFeedback({ type: "error", message: "Failed to load mood logs." });
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    console.log("MoodTracker mounted, currentUser:", currentUser?.uid);
    fetchMoods();
  }, [currentUser]); // Refetch when currentUser changes

  // Update chart whenever moodLogs change
  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");
    const labels = moodLogs.map((log, i) => `Day ${i + 1}`);
    const data = moodLogs.map((log) => {
      switch (log.mood) {
        case "Happy": return 5;
        case "Calm": return 4;
        case "Anxious": return 2;
        case "Sad": return 1;
        case "Angry": return 0;
        default: return 3;
      }
    });

    if (chartInstance.current) chartInstance.current.destroy();

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Mood over Time",
            data,
            fill: true,
            backgroundColor: 'rgba(107, 70, 193, 0.4)', // Using primary color with more opacity
            borderColor: 'var(--color-primary)', // Use primary color
            tension: 0.4,
            pointBackgroundColor: 'var(--color-primary)', // Add point color
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'var(--color-secondary)',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // Add this to allow custom sizing
        resizeDelay: 200, // Add a slight delay for resizing
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            min: 0,
            max: 5,
            ticks: {
              stepSize: 1,
              callback: (value) => {
                switch (value) {
                  case 0: return "Angry";
                  case 1: return "Sad";
                  case 2: return "Anxious";
                  case 3: return "Neutral";
                  case 4: return "Calm";
                  case 5: return "Happy";
                  default: return value;
                }
              },
              color: 'var(--color-text)', // Tick color
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)', // Grid line color
            },
          },
          x: {
            ticks: {
              color: 'var(--color-text)', // Tick color
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)', // Grid line color
            },
          },
        },
      },
    });
  }, [moodLogs]);

  const handleAddMood = async () => {
    if (!mood) {
      setFeedback({ type: "error", message: "Please select a mood!" });
      return;
    }

    if (!currentUser) {
      setFeedback({ type: "error", message: "Please log in to track your mood!" });
      return;
    }

    setIsLogging(true); // Start logging
    setFeedback(null); // Clear previous feedback

    try {
      console.log("Attempting to log mood:", { mood, currentUser: currentUser?.uid });
      await addDoc(collection(db, "moodLogs"), {
        mood,
        timestamp: new Date(),
        userId: currentUser.uid, // Add user ID to the mood log
        userEmail: currentUser.email, // Add user email for reference
      });
      console.log("Mood logged successfully");
      setMood("");
      await fetchMoods();
      setFeedback({ type: "success", message: `Mood '${mood}' logged successfully!` });
    } catch (error) {
      console.error("Error logging mood:", error);
      console.error("Error details:", {
        code: error.code,
        message: error.message,
        currentUser: currentUser?.uid
      });
      setFeedback({ type: "error", message: `Failed to log mood: ${error.message}` });
    } finally {
      setIsLogging(false); // End logging
      setTimeout(() => setFeedback(null), 3000); // Clear feedback after 3 seconds
    }
  };

  const moodEmoji = moodOptions.find(o => o.value === mood)?.label.split(' ')[0] || "";

  return (
    <motion.div
      className="max-w-4xl mx-auto p-8 bg-white rounded-3xl shadow-large border border-gray-100 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2 
        className="text-4xl lg:text-5xl font-heading font-extrabold mb-8 text-primary tracking-tight"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <span className="inline-block mr-3">✨</span>
        Mood Tracker
      </motion.h2>

      {!currentUser && (
        <motion.div
          className="mb-6 px-6 py-4 rounded-xl text-white font-medium shadow-soft bg-warning-500"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-center space-x-2">
            <span>⚠️</span>
            <span>Please log in to track your mood and view your mood history.</span>
          </div>
        </motion.div>
      )}

      {/* Firebase Test Component - Remove this after debugging */}
      <div className="mb-6">
        <FirebaseTest />
      </div>

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

      <motion.div
        className="flex flex-col lg:flex-row items-center justify-center mb-12 space-y-6 lg:space-y-0 lg:space-x-6 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="relative w-full lg:w-auto">
          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="input-field w-full lg:w-80 text-center appearance-none pr-12"
            disabled={isLogging || !currentUser}
          >
            <option value="" className="text-gray-500">Select your mood</option>
            {moodOptions.map((m) => (
              <option key={m.value} value={m.value} className="text-text py-2">
                {m.label}
              </option>
            ))}
          </select>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-primary pointer-events-none text-2xl">
            {moodEmoji || "▼"}
          </span>
        </div>
        <motion.button
          onClick={handleAddMood}
          className="btn-primary w-full lg:w-auto px-8 py-3 text-lg"
          disabled={isLogging || !currentUser}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isLogging ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Logging...</span>
            </div>
          ) : (
            "Log Mood"
          )}
        </motion.button>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {/* Mood History Section */}
        <div className="space-y-6">
          <h3 className="text-3xl font-heading font-bold text-primary tracking-wide text-center lg:text-left">
            📊 Mood History
          </h3>
          {moodLogs.length === 0 && !loading && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-text-secondary italic">No mood logs yet. Log your first mood!</p>
            </div>
          )}
          {loading && (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-primary italic">Loading mood history...</p>
            </div>
          )}
          {!loading && moodLogs.length > 0 && (
            <motion.div
              className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              {moodLogs.map((log, idx) => (
                <motion.div
                  key={idx}
                  className="card-elevated p-4 flex items-center justify-between"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">
                      {moodOptions.find(o => o.value === log.mood)?.label.split(' ')[0] || "😐"}
                    </span>
                    <span className="text-text-primary text-lg font-medium">{log.mood}</span>
                  </div>
                  <small className="text-text-muted text-sm">
                    {new Date(log.timestamp.seconds * 1000).toLocaleDateString()}
                  </small>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Mood Chart Section */}
        <div className="space-y-6">
          <h3 className="text-3xl font-heading font-bold text-primary tracking-wide text-center lg:text-left">
            📈 Mood Chart
          </h3>
          {moodLogs.length === 0 && !loading && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-text-secondary italic">Log moods to see your progress on the chart!</p>
            </div>
          )}
          {loading && (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-primary italic">Loading chart...</p>
            </div>
          )}
          {!loading && moodLogs.length > 0 && (
            <motion.div
              className="card-elevated p-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <canvas ref={chartRef} className="w-full h-80" />
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

