// src/Forum.jsx
import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion"; // Import motion

export default function Forum() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(false); // Used for fetching posts
  const [isPosting, setIsPosting] = useState(false); // New state for adding a post
  const [feedback, setFeedback] = useState(null); // New state for user feedback

  // Fetch posts from Firestore
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "forumPosts"), orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);
      const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postsData);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setFeedback({ type: "error", message: "Failed to load posts." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Add new post
  const handleAddPost = async () => {
    if (!newPost.trim()) {
      setFeedback({ type: "error", message: "Post content cannot be empty." });
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    setIsPosting(true); // Start posting
    setFeedback(null); // Clear previous feedback

    try {
      const postObj = {
        content: newPost,
        comments: [],
        likes: 0,
        timestamp: serverTimestamp(),
      };
      await addDoc(collection(db, "forumPosts"), postObj);
      setNewPost("");
      await fetchPosts(); // refresh posts after adding
      setFeedback({ type: "success", message: "Post added successfully!" });
    } catch (error) {
      console.error("Error adding post:", error);
      setFeedback({ type: "error", message: "Failed to add post. Please try again." });
    } finally {
      setIsPosting(false); // End posting
      setTimeout(() => setFeedback(null), 3000); // Clear feedback after 3 seconds
    }
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto p-8 bg-white rounded-3xl shadow-large border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl lg:text-5xl font-heading font-extrabold mb-8 text-primary tracking-tight">Forum 💬</h2>

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

      {/* New Post Input */}
      <motion.div
        className="flex flex-col sm:flex-row mb-10 space-y-4 sm:space-y-0 sm:space-x-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <input
          type="text"
          placeholder="Share your thoughts..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          className="input-field flex-1"
          disabled={isPosting}
        />
        <motion.button
          onClick={handleAddPost}
          className="btn-primary w-full sm:w-auto"
          disabled={isPosting}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isPosting ? "Posting..." : "Post"}
        </motion.button>
      </motion.div>

      {/* Loading indicator for posts fetch */}
      {loading && <p className="text-gray-600 mb-6 italic">Loading posts...</p>}

      {/* Posts List */}
      {!loading && posts.length === 0 && (
        <p className="text-gray-600 mb-6 italic">No posts yet. Be the first to share!</p>
      )}
      {!loading && posts.length > 0 && (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {posts.map((post, idx) => (
            <motion.div
              key={post.id}
              className="card-elevated p-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <p className="mb-3 text-text-primary text-lg font-semibold">{post.content}</p>
              <div className="text-sm text-text-secondary mb-3">
                Likes: {post.likes || 0}
              </div>
              {/* Comments */}
              <div className="ml-4 border-l-2 border-primary/30 pl-4 pt-2 mt-4 bg-background rounded-md py-3">
                <p className="text-text-primary text-base font-semibold mb-3">Comments:</p>
                {post.comments?.length > 0 ? (
                  post.comments.map((c, cIdx) => (
                    <p key={cIdx} className="text-text-secondary text-sm mb-2 leading-relaxed">
                      💬 {c}
                    </p>
                  ))
                ) : (
                  <p className="text-text-secondary text-sm italic">No comments yet. Be the first to reply!</p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
