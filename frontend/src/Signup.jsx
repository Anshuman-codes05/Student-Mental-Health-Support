import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase'; // Import auth from your firebase.js
import { motion } from "framer-motion"; // Import motion

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/'); // Redirect to home page on successful signup
    } catch (err) {
      setError(err.message); // Display Firebase error message
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4 bg-background"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-full max-w-md p-8 space-y-8 bg-white rounded-3xl shadow-large border border-gray-100 transform transition duration-500 hover:scale-[1.01]"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="text-center space-y-4">
          <motion.div
            className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5, type: "spring" }}
          >
            <span className="text-2xl">✨</span>
          </motion.div>
          <h2 className="text-4xl font-heading font-extrabold text-primary tracking-tight">
            Join Us Today!
          </h2>
          <p className="text-lg text-text-secondary">
            Create your account to unlock all features.
          </p>
        </div>
        {error && (
          <motion.div
            className="p-3 text-sm text-red-700 bg-red-100 rounded-lg"
            role="alert"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        )}
        <form className="space-y-6" onSubmit={handleSignup}>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.3 }}>
            <label htmlFor="email" className="block text-sm font-medium text-text sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-text focus-ring-primary text-lg transition duration-200 bg-background"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.3 }}>
            <label htmlFor="password" className="block text-sm font-medium text-text sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-text focus-ring-primary text-lg transition duration-200 bg-background"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.3 }}>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-text sr-only">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-text focus-ring-primary text-lg transition duration-200 bg-background"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.3 }}>
            <motion.div
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-semibold rounded-lg text-white bg-primary hover:bg-secondary focus-ring-primary transition duration-300 ease-in-out transform hover:scale-[1.005] disabled:opacity-60 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                type="submit"
                onClick={handleSignup}
                disabled={loading}
                className="w-full h-full bg-transparent text-white font-semibold"
              >
                {loading ? 'Signing Up...' : 'Sign Up'}
              </button>
            </motion.div>
          </motion.div>
        </form>
        <motion.div
          className="text-sm text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.3 }}
        >
          <Link to="/login" className="font-medium text-primary hover:text-secondary transition duration-200 focus-ring-primary">
            Already have an account? Sign In
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
