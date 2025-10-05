import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export default function FirebaseTest() {
  const [status, setStatus] = useState('Testing...');
  const [error, setError] = useState(null);

  useEffect(() => {
    testFirebase();
  }, []);

  const testFirebase = async () => {
    try {
      console.log('Testing Firebase connection...');
      
      // Test reading from Firestore
      const testCollection = collection(db, 'test');
      const snapshot = await getDocs(testCollection);
      console.log('Firebase read test successful:', snapshot.docs.length, 'documents');
      
      // Test writing to Firestore
      const testDoc = await addDoc(collection(db, 'test'), {
        message: 'Firebase test',
        timestamp: new Date(),
      });
      console.log('Firebase write test successful:', testDoc.id);
      
      setStatus('Firebase connection successful!');
    } catch (err) {
      console.error('Firebase test failed:', err);
      setError(err.message);
      setStatus('Firebase connection failed');
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-bold mb-2">Firebase Test</h3>
      <p className="text-sm mb-2">Status: {status}</p>
      {error && (
        <p className="text-red-500 text-sm">Error: {error}</p>
      )}
    </div>
  );
}
