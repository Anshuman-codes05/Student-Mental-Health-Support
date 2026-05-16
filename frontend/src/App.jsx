import React, { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate, useLocation } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { motion, AnimatePresence } from "framer-motion";

import MoodTracker from "./MoodTracker";
import Journal from "./Journal";
import Forum from "./Forum";
import Chatbot from "./Chatbot";
import Login from "./Login";
import Signup from "./Signup";
import Booking from "./Booking";
import ResourceHub from "./ResourceHub";
import AdminDashboard from "./AdminDashboard";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoadingAuth(false);
    });
    return unsubscribe;
  }, []);

  const logout = async () => {
    setLoadingAuth(true);
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setLoadingAuth(false);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, loadingAuth, logout }}>
      {!loadingAuth && children}
    </AuthContext.Provider>
  );
}

function App() {
  const { currentUser, loadingAuth, logout } = useContext(AuthContext);
  const location = useLocation();
  const isAuthPage = ["/login", "/signup"].includes(location.pathname);

  const navLinkClasses = ({ isActive }) =>
    `nav-pill ${isActive ? "nav-pill-active" : ""}`;

  return (
    <motion.div
      className="relative flex min-h-screen flex-col text-text-primary"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Floating accent blobs inside app layer */}
      <motion.div
        className="pointer-events-none absolute -left-32 top-20 h-64 w-64 rounded-full bg-primary-600/30 blur-3xl"
        animate={{ y: [0, -20, 0], x: [0, 15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-secondary/25 blur-3xl"
        animate={{ y: [0, 25, 0], x: [0, -20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Navigation */}
      <motion.nav
        className="sticky top-0 z-50 w-full px-4 pt-5 sm:px-6"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 18, delay: 0.1 }}
      >
        <div className="glass-panel-strong mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <motion.div className="flex items-center gap-4" whileHover={{ scale: 1.02 }}>
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 via-secondary to-accent text-xl shadow-glow">
              <span className="animate-wave">✨</span>
              <span className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-primary-400 to-secondary opacity-40 blur-md" />
            </div>
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-text-muted">
                Wellness HQ
              </p>
              <h2 className="font-heading text-xl font-bold text-gradient sm:text-2xl">
                Student Wellness Hub
              </h2>
            </div>
          </motion.div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
            {!loadingAuth && currentUser ? (
              <>
                <NavLink to="/" end className={navLinkClasses}>Mood</NavLink>
                <NavLink to="/journal" className={navLinkClasses}>Journal</NavLink>
                <NavLink to="/forum" className={navLinkClasses}>Forum</NavLink>
                <NavLink to="/chatbot" className={navLinkClasses}>Chatbot</NavLink>
                <NavLink to="/booking" className={navLinkClasses}>Bookings</NavLink>
                <NavLink to="/resources" className={navLinkClasses}>Resources</NavLink>
                {currentUser.email === "admin@example.com" && (
                  <NavLink to="/admin" className={navLinkClasses}>Admin</NavLink>
                )}
                <motion.button
                  type="button"
                  onClick={logout}
                  className="btn-ghost-danger"
                  disabled={loadingAuth}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navLinkClasses}>Login</NavLink>
                <NavLink to="/signup" className={navLinkClasses}>Sign Up</NavLink>
              </>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Hero — hidden on login/signup for cleaner auth pages */}
      {!isAuthPage && (
        <motion.header
          className="mx-auto mt-10 w-full max-w-5xl px-4 sm:px-6"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="hero-panel relative px-6 py-10 sm:px-12 sm:py-14">
            <div className="pointer-events-none absolute -right-8 -top-8 h-48 w-48 rounded-full bg-primary-500/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-6 h-40 w-40 rounded-full bg-secondary/20 blur-3xl" />

            <span className="premium-badge">
              <span className="premium-badge-dot" />
              Premium Experience
            </span>

            <motion.h1
              className="relative mt-6 font-heading text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <span className="text-gradient">Beautiful mental health support</span>
              <span className="mt-2 block text-text-primary">
                — calm, premium, and empowering.
              </span>
            </motion.h1>

            <motion.p
              className="relative mt-5 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              Mood tracking, journaling, peer connection, and AI guidance — wrapped in elegant, thoughtful design.
            </motion.p>

            <motion.div
              className="relative mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              <NavLink to={currentUser ? "/" : "/signup"} className="btn-primary px-8 py-3">
                {currentUser ? "Open dashboard" : "Get started free"}
              </NavLink>
              {!currentUser && (
                <NavLink to="/login" className="btn-outline px-8 py-3">
                  Sign in
                </NavLink>
              )}
            </motion.div>
          </div>
        </motion.header>
      )}

      {/* Main content */}
      <motion.main
        className="mx-auto mb-12 mt-8 w-full max-w-7xl flex-grow px-4 sm:px-6"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.7 }}
      >
        <motion.div className="content-shell p-5 sm:p-8 lg:p-10" layout>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              className="page-enter"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              <Routes location={location}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {!loadingAuth && currentUser ? (
                  <>
                    <Route path="/" element={<MoodTracker />} />
                    <Route path="/journal" element={<Journal />} />
                    <Route path="/forum" element={<Forum />} />
                    <Route path="/chatbot" element={<Chatbot />} />
                    <Route path="/booking" element={<Booking />} />
                    <Route path="/resources" element={<ResourceHub />} />
                    {currentUser.email === "admin@example.com" && (
                      <Route path="/admin" element={<AdminDashboard />} />
                    )}
                  </>
                ) : (
                  <Route path="*" element={<Login />} />
                )}
              </Routes>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.main>

      {/* Footer */}
      <motion.footer
        className="mt-auto border-t border-white/10 bg-gradient-to-r from-primary-900/80 via-background-secondary/90 to-primary-900/80 px-4 py-8 backdrop-blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <motion.div
          className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-4"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <p className="text-sm text-text-secondary">
            Made with <span className="inline-block animate-pulse-soft text-secondary">💜</span> by{" "}
            <span className="font-semibold text-text-primary">Anshuman</span>
          </p>
          <span className="hidden text-white/30 sm:inline">|</span>
          <p className="text-sm text-text-muted">Student Wellness Hub © {new Date().getFullYear()}</p>
        </motion.div>
        <p className="mt-2 text-center text-xs text-text-muted">
          Supporting student mental health through technology
        </p>
      </motion.footer>
    </motion.div>
  );
}

export default function AppWithAuth() {
  return (
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  );
}
