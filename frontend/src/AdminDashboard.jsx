import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
// import { db } from "./firebase"; // Uncomment and use if fetching data from Firestore

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    moodTrends: [],
    journalSentiment: { labels: [], data: [] },
    forumStats: { totalPosts: 0, totalComments: 0 },
    appointments: { totalBooked: 0, counselorDistribution: {} },
    resourceUsage: { videoViews: 0, audioPlays: 0, guideDownloads: 0 },
  });

  useEffect(() => {
    // Simulate fetching data
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // In a real application, you would fetch aggregated data from your backend/Firestore
        // For now, let's use some mock data
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

        setDashboardData({
          moodTrends: [
            { month: "Jan", happy: 50, sad: 20, anxious: 30 },
            { month: "Feb", happy: 60, sad: 15, anxious: 25 },
            { month: "Mar", happy: 55, sad: 25, anxious: 20 },
            { month: "Apr", happy: 65, sad: 10, anxious: 25 },
          ],
          journalSentiment: {
            labels: ["Positive", "Neutral", "Negative"],
            data: [70, 20, 10],
          },
          forumStats: { totalPosts: 120, totalComments: 350 },
          appointments: { totalBooked: 45, counselorDistribution: { "Dr. Smith": 20, "Ms. Johnson": 15, "Mr. Lee": 10 } },
          resourceUsage: { videoViews: 500, audioPlays: 300, guideDownloads: 150 },
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data.");
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <motion.div
      className="max-w-6xl mx-auto p-8 bg-white rounded-3xl shadow-large border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl lg:text-5xl font-heading font-extrabold mb-8 text-primary tracking-tight">Admin Dashboard 📊</h2>

      {loading && <p className="text-gray-600 italic mb-4">Loading dashboard data...</p>}
      {error && (
        <div className="mb-6 px-6 py-4 rounded-xl text-white font-medium bg-error-500">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Mood Trends Card */}
          <motion.div
            className="card-elevated text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h3 className="font-bold text-2xl text-text-primary mb-4">Mood Trends</h3>
            <p className="text-text-secondary">Overview of student moods over time.</p>
            {/* Placeholder for a chart or more detailed data */}
            <div className="mt-4 text-sm text-text-secondary">Data points: {dashboardData.moodTrends.length}</div>
          </motion.div>

          {/* Journal Sentiment Card */}
          <motion.div
            className="card-elevated text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h3 className="font-bold text-2xl text-text-primary mb-4">Journal Sentiment</h3>
            <p className="text-text-secondary">Aggregated sentiment from journal entries.</p>
            {/* Placeholder for a chart or more detailed data */}
            <div className="mt-4 text-sm text-text-secondary">{dashboardData.journalSentiment.labels.join(", ")}</div>
          </motion.div>

          {/* Forum Statistics Card */}
          <motion.div
            className="card-elevated text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h3 className="font-bold text-2xl text-text-primary mb-4">Forum Activity</h3>
            <p className="text-text-secondary">Insights into peer support platform engagement.</p>
            <div className="mt-4 text-sm text-text-secondary">Total Posts: {dashboardData.forumStats.totalPosts}, Comments: {dashboardData.forumStats.totalComments}</div>
          </motion.div>

          {/* Appointment Statistics Card */}
          <motion.div
            className="card-elevated text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <h3 className="font-bold text-2xl text-text-primary mb-4">Appointment Stats</h3>
            <p className="text-text-secondary">Overview of counsellor booking trends.</p>
            <div className="mt-4 text-sm text-text-secondary">Total Booked: {dashboardData.appointments.totalBooked}</div>
          </motion.div>

          {/* Resource Usage Card */}
          <motion.div
            className="card-elevated text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <h3 className="font-bold text-2xl text-text-primary mb-4">Resource Usage</h3>
            <p className="text-text-secondary">Popularity of psychoeducational resources.</p>
            <div className="mt-4 text-sm text-text-secondary">Videos: {dashboardData.resourceUsage.videoViews}, Audio: {dashboardData.resourceUsage.audioPlays}, Guides: {dashboardData.resourceUsage.guideDownloads}</div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
