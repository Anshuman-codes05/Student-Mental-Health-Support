import React, { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { motion } from "framer-motion"; // Import motion

import MoodTracker from "./MoodTracker";
import Journal from "./Journal";
import Forum from "./Forum";
import Chatbot from "./Chatbot";
import Login from "./Login";
import Signup from "./Signup";
import Booking from "./Booking"; // Import Booking component
import ResourceHub from "./ResourceHub"; // Import ResourceHub component
import AdminDashboard from "./AdminDashboard"; // Import AdminDashboard component

// Create an Auth Context
export const AuthContext = createContext(null);

// Auth Provider component to manage and provide auth state
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true); // Tracks if Firebase is still checking auth state
  const navigate = useNavigate(); // For redirecting after logout

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoadingAuth(false);
    });
    return unsubscribe;
  }, []);

  const logout = async () => {
    setLoadingAuth(true); // Indicate that logout is in progress
    try {
      await signOut(auth);
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setLoadingAuth(false);
    }
  };

  const value = {
    currentUser,
    loadingAuth,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loadingAuth && children}
    </AuthContext.Provider>
  );
}

function App() {
  const { currentUser, loadingAuth, logout } = useContext(AuthContext);

  const navLinkClasses = ({ isActive }) =>
    `px-4 py-2 rounded-xl text-base font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 ` +
    (isActive
      ? "bg-white/20 text-white shadow-soft backdrop-blur-sm border border-white/30 focus:ring-white/50 focus:ring-offset-primary"
      : "text-white/90 hover:bg-white/10 hover:text-white focus:ring-white/50 focus:ring-offset-primary");

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background text-text-primary font-sans flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Enhanced Background Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-accent-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-6000"></div>
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary-100 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-blob animation-delay-8000"></div>

      {/* Enhanced Navigation Bar */}
      <motion.nav
        className="w-full sticky top-0 z-50 bg-gradient-to-r from-primary/90 to-secondary/90 backdrop-blur-lg border-b border-white/20 shadow-large rounded-b-3xl mb-8 py-2"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.2 }}
      >
        <div className="container mx-auto flex flex-wrap justify-center sm:justify-between items-center py-4 px-4 sm:px-8">
          <motion.div 
            className="flex items-center space-x-3 mb-4 sm:mb-0"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="relative">
              <img src="/vite.svg" className="h-12 w-12 animate-bounce-gentle" alt="Logo" />
              <div className="absolute inset-0 bg-primary-400 rounded-full blur-md opacity-30 animate-pulse-soft"></div>
            </div>
            <span className="text-2xl font-heading font-bold text-white tracking-wide">DMHS</span>
            <span className="text-sm font-medium text-white/80 hidden sm:block">Mental Health Support</span>
          </motion.div>
          <div className="flex flex-wrap justify-center space-x-4 sm:space-x-6">
            {!loadingAuth && currentUser ? (
              // Authenticated navigation
              <>
                <NavLink to="/" className={navLinkClasses}>
                  Mood Tracker
                </NavLink>
                <NavLink to="/journal" className={navLinkClasses}>
                  Journal
                </NavLink>
                <NavLink to="/forum" className={navLinkClasses}>
                  Forum
                </NavLink>
                <NavLink to="/chatbot" className={navLinkClasses}>
                  Chatbot
                </NavLink>
                <NavLink to="/booking" className={navLinkClasses}> {/* New NavLink for Booking */}
                  Bookings
                </NavLink>
                <NavLink to="/resources" className={navLinkClasses}> {/* New NavLink for Resource Hub */}
                  Resources
                </NavLink>
                {currentUser.email === "admin@example.com" && (
                  <NavLink to="/admin" className={navLinkClasses}> {/* New NavLink for Admin Dashboard */}
                    Admin
                  </NavLink>
                )}
                <motion.button
                  onClick={logout}
                  className="px-4 py-2 rounded-xl text-base font-medium transition-all duration-300 text-white bg-error-500 hover:bg-error-600 shadow-soft focus:outline-none focus:ring-2 focus:ring-error-500 focus:ring-offset-2 focus:ring-offset-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loadingAuth}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Logout
                </motion.button>
              </>
            ) : (
              // Unauthenticated navigation
              <>
                <NavLink to="/login" className={navLinkClasses}>
                  Login
                </NavLink>
                <NavLink to="/signup" className={navLinkClasses}>
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Enhanced Header */}
      <motion.header
        className="mt-12 mb-10 text-center px-4 max-w-5xl"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
      >
        <motion.h1 
          className="text-4xl sm:text-6xl lg:text-7xl font-heading font-extrabold mb-6 leading-tight text-primary text-shadow-md"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
        >
          <span className="inline-block animate-wave text-5xl sm:text-7xl lg:text-8xl">👋</span>
          <br />
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            DMHS
          </span>
          <br />
          <span className="text-2xl sm:text-3xl lg:text-4xl text-text-secondary font-medium">
            Student Mental Health Support
          </span>
        </motion.h1>
        <motion.p 
          className="text-lg sm:text-xl lg:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          Track your mood, journal your thoughts, connect with peers, and chat with AI support — all in one beautiful, supportive environment.
        </motion.p>
      </motion.header>

      {/* Enhanced Main Content Area */}
      <motion.main
        className="flex-grow w-full container mx-auto px-4 max-w-7xl mb-12"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
        layout /* Add layout prop for smoother transitions between route changes */
      >
        <motion.div
          className="bg-white rounded-3xl shadow-large p-6 sm:p-8 lg:p-12 border border-gray-100 hover:shadow-glow transition-all duration-500 transform hover:scale-[1.01] relative overflow-hidden backdrop-blur-sm"
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5, ease: "easeOut" }}
        >
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 via-transparent to-secondary-50/30 pointer-events-none"></div>
          <div className="relative z-10">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected Routes (only accessible when currentUser is set) */}
              {(!loadingAuth && currentUser) ? (
                <>
                  <Route path="/" element={<MoodTracker />} />
                  <Route path="/journal" element={<Journal />} />
                  <Route path="/forum" element={<Forum />} />
                  <Route path="/chatbot" element={<Chatbot />} />
                  <Route path="/booking" element={<Booking />} /> {/* New Protected Route for Booking */}
                  <Route path="/resources" element={<ResourceHub />} /> {/* New Protected Route for Resource Hub */}
                  {currentUser.email === "admin@example.com" && (
                    <Route path="/admin" element={<AdminDashboard />} /> // New Protected Route for Admin Dashboard
                  )}
                </>
              ) : (
                // Redirect unauthenticated users from protected routes to login
                <Route path="*" element={<Login />} />
              )}
            </Routes>
          </div>
        </motion.div>
      </motion.main>

      {/* Enhanced Footer */}
      <motion.footer
        className="w-full bg-gradient-to-r from-primary via-primary-600 to-secondary text-white py-8 shadow-large mt-auto rounded-t-3xl border-t border-white/10"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.8 }}
      >
        <div className="container mx-auto text-center px-4">
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <p className="text-sm sm:text-base opacity-90">
              Made with <span className="text-red-300 animate-pulse-soft">💜</span> by <span className="font-semibold">Anshuman</span>
            </p>
            <span className="hidden sm:block text-white/50">|</span>
            <p className="text-sm sm:text-base opacity-90">
              DMHS Project © {new Date().getFullYear()}
            </p>
          </motion.div>
          <motion.p 
            className="text-xs opacity-70 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            Supporting student mental health through technology
          </motion.p>
        </div>
      </motion.footer>
    </motion.div>
  );
}

// Wrap App with AuthProvider to provide auth context globally
export default function AppWithAuth() {
  return (
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  );
}

