import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase'; // Import auth from your firebase.js
import { motion } from "framer-motion"; // Import motion

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/'); // Redirect to home page on successful login
    } catch (err) {
      setError(err.message); // Display Firebase error message
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="flex min-h-[50vh] items-center justify-center p-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="glass-panel w-full max-w-md space-y-8 p-8 sm:p-10"
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
            <span className="text-2xl">👋</span>
          </motion.div>
          <h2 className="font-heading text-4xl font-extrabold tracking-tight text-gradient">
            Welcome Back!
          </h2>
          <p className="text-lg text-text-secondary">
            Sign in to access your personalized mental wellness tools.
          </p>
        </div>
        {error && (
          <motion.div
            className="rounded-xl border border-error-500/40 bg-error-500/15 p-4 text-sm text-error-400"
            role="alert"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-2">
              <span>❌</span>
              <span>{error}</span>
            </div>
          </motion.div>
        )}
        <form className="space-y-6" onSubmit={handleLogin}>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.3 }}>
            <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="input-field"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.3 }}>
            <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="input-field"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.3 }}>
            <motion.button
              type="submit"
              onClick={handleLogin}
              disabled={loading}
              className="btn-primary w-full text-lg py-4"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Logging In...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </motion.div>
        </form>
        <motion.div
          className="border-t border-white/10 pt-4 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.3 }}
        >
          <p className="text-text-secondary mb-2">Don't have an account?</p>
          <Link 
            to="/signup" 
            className="rounded-lg px-3 py-1 font-medium text-primary-300 transition hover:text-white"
          >
            Sign Up
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
