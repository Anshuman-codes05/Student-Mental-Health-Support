import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db } from "./firebase"; // Assuming firebase is configured for firestore
import { collection, getDocs } from "firebase/firestore";

export default function ResourceHub() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "resources"));
        const fetchedResources = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setResources(fetchedResources);
      } catch (err) {
        console.error("Error fetching resources:", err);
        setError("Failed to load resources. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  const resourceCategories = [
    { name: "Videos 🎥", type: "video" },
    { name: "Audio 🎧", type: "audio" },
    { name: "Guides 📚", type: "guide" },
  ];

  return (
    <motion.div
      className="max-w-5xl mx-auto p-8 bg-white rounded-3xl shadow-large border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl lg:text-5xl font-heading font-extrabold mb-8 text-primary tracking-tight">Psychoeducational Resource Hub 💡</h2>

      {loading && <p className="text-gray-600 italic mb-4">Loading resources...</p>}
      {error && (
        <div className="mb-6 px-6 py-4 rounded-xl text-white font-medium bg-error-500">
          {error}
        </div>
      )}

      {!loading && !error && resources.length === 0 && (
        <p className="text-gray-600 italic mb-4">No resources available yet.</p>
      )}

      {!loading && !error && resources.length > 0 && (
        <div className="space-y-10">
          {resourceCategories.map((category, catIdx) => (
            <motion.div
              key={category.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + catIdx * 0.1, duration: 0.5 }}
            >
              <h3 className="text-3xl font-heading font-bold mb-6 text-secondary tracking-wide border-b-2 border-accent pb-2 text-left">
                {category.name}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources
                  .filter(res => res.type === category.type)
                  .map((resource, resIdx) => (
                    <motion.div
                      key={resource.id}
                      className="card-elevated text-left"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + catIdx * 0.1 + resIdx * 0.05, duration: 0.4 }}
                    >
                      <h4 className="font-bold text-xl text-text-primary mb-2">{resource.title}</h4>
                      <p className="text-text-secondary text-base mb-3 leading-relaxed">{resource.description}</p>
                      {resource.url && (
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary-700 font-semibold transition duration-200 inline-flex items-center"
                        >
                          Learn More
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 ml-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      )}
                    </motion.div>
                  ))}
              </div>
              {resources.filter(res => res.type === category.type).length === 0 && (
                <p className="text-gray-500 italic mt-4">No {category.name.toLowerCase()} available yet.</p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
