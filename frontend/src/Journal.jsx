// src/Journal.jsx
import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion"; // Import motion

export default function Journal() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const [entries, setEntries] = useState([]);
  const [editId, setEditId] = useState(null);
  const [feedback, setFeedback] = useState(null); // New state for user feedback
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for submission status
  const [isLoadingEntries, setIsLoadingEntries] = useState(true); // New state for loading entries

  // Fetch journal entries
  useEffect(() => {
    const fetchEntries = async () => {
      setIsLoadingEntries(true); // Start loading
      try {
        const snapshot = await getDocs(collection(db, "journalEntries"));
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        // Sort by newest first
        data.sort((a, b) => b.timestamp?.toDate() - a.timestamp?.toDate());
        setEntries(data);
      } catch (error) {
        console.error("Error fetching journal entries:", error);
        setFeedback({ type: "error", message: "Failed to load entries." });
      } finally {
        setIsLoadingEntries(false); // End loading
      }
    };
    fetchEntries();
  }, []);

  const handleAddOrUpdateEntry = async () => {
    if (!title || !content) {
      setFeedback({ type: "error", message: "Please fill both title and content." });
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    setIsSubmitting(true); // Start submitting
    setFeedback(null); // Clear previous feedback

    try {
      if (editId) {
        // Update existing entry
        await updateDoc(doc(db, "journalEntries", editId), { title, content, mood });
        setEntries(entries.map(e => e.id === editId ? { ...e, title, content, mood } : e));
        setEditId(null);
        setFeedback({ type: "success", message: "Entry updated successfully!" });
      } else {
        // Add new entry
        const newEntry = { title, content, mood, timestamp: new Date() };
        const docRef = await addDoc(collection(db, "journalEntries"), newEntry);
        setEntries([{ id: docRef.id, ...newEntry }, ...entries]);
        setFeedback({ type: "success", message: "Entry added successfully!" });
      }
      setTitle("");
      setContent("");
      setMood("");
    } catch (error) {
      console.error("Error adding/updating journal entry:", error);
      setFeedback({ type: "error", message: "Failed to save entry. Please try again." });
    } finally {
      setIsSubmitting(false); // End submitting
      setTimeout(() => setFeedback(null), 3000); // Clear feedback after 3 seconds
    }
  };

  const handleEdit = (entry) => {
    if (isSubmitting) return; // Prevent editing while submitting
    setFeedback(null); // Clear feedback on edit attempt
    setTitle(entry.title);
    setContent(entry.content);
    setMood(entry.mood || "");
    setEditId(entry.id);
  };

  const handleDelete = async (id) => {
    if (isSubmitting) return; // Prevent deleting while submitting
    if (!window.confirm("Are you sure you want to delete this entry?")) return;

    setIsSubmitting(true); // Start submitting (for deletion)
    setFeedback(null); // Clear previous feedback
    try {
      await deleteDoc(doc(db, "journalEntries", id));
      setEntries(entries.filter((entry) => entry.id !== id));
      setFeedback({ type: "success", message: "Entry deleted successfully!" });
    } catch (error) {
      console.error("Error deleting journal entry:", error);
      setFeedback({ type: "error", message: "Failed to delete entry. Please try again." });
    } finally {
      setIsSubmitting(false); // End submitting
      setTimeout(() => setFeedback(null), 3000); // Clear feedback after 3 seconds
    }
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto p-8 bg-white rounded-3xl shadow-large border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl lg:text-5xl font-heading font-extrabold mb-8 text-primary tracking-tight">Journal Entries ✍️</h2>

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
        className="mb-10 space-y-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-field"
          disabled={isSubmitting}
        />
        <textarea
          placeholder="Write your thoughts..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="input-field h-40 resize-y"
          disabled={isSubmitting}
        />
        <input
          type="text"
          placeholder="Mood (optional, e.g., 😊, 😔)"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          className="input-field"
          disabled={isSubmitting}
        />
        <motion.button
          onClick={handleAddOrUpdateEntry}
          className="btn-primary w-full"
          disabled={isSubmitting}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isSubmitting ? (editId ? "Updating..." : "Adding...") : (editId ? "Update Entry" : "Add Entry")}
        </motion.button>
      </motion.div>

      <h3 className="text-3xl font-heading font-bold mb-6 text-primary tracking-wide">Your Entries</h3>
      {isLoadingEntries && <p className="text-gray-600 italic mb-4">Loading entries...</p>}
      {!isLoadingEntries && entries.length === 0 && (
        <p className="text-gray-600 italic mb-4">No journal entries yet. Add your first entry!</p>
      )}
      {!isLoadingEntries && entries.length > 0 && (
        <motion.ul
          className="space-y-5 max-h-80 overflow-y-auto pr-2 custom-scrollbar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {entries.map((entry, idx) => (
            <motion.li
              key={entry.id}
              className="card-elevated flex flex-col sm:flex-row justify-between items-start sm:items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <div className="mb-3 sm:mb-0 flex-1">
                <div className="font-bold text-xl text-text-primary mb-1">{entry.title} {entry.mood && <span className="ml-2 text-2xl">{entry.mood}</span>}</div>
                <p className="text-text-secondary text-base leading-relaxed mb-3">{entry.content}</p>
                <small className="text-primary text-sm block">
                  {entry.timestamp?.toDate().toLocaleString()}
                </small>
              </div>
              <div className="flex space-x-3 mt-4 sm:mt-0">
                <motion.button
                  onClick={() => handleEdit(entry)}
                  className="btn-secondary px-5 py-2"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Edit
                </motion.button>
                <motion.button
                  onClick={() => handleDelete(entry.id)}
                  className="px-5 py-2 rounded-xl bg-error-500 text-white font-medium shadow-soft hover:bg-error-600 focus:outline-none focus:ring-2 focus:ring-error-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Delete
                </motion.button>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </motion.div>
  );
}
