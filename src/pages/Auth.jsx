// src/pages/Login.jsx
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Get role from Firestore
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.role === "admin") navigate("/directory");
        else if (data.role === "student") navigate("/directory");
        else if (data.role === "alumni") navigate("/directory");
      } else {
        setError("No role info found. Please register again.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white to-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome Back! 
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
          >
            Login
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => navigate("/Register")}
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
          >
            Sign Up
          </motion.button>

          <p
            onClick={() => navigate("/sendPasswordResetEmail")}
            className="text-blue-500 hover:text-gray-600 cursor-pointer font-medium text-center mt-2"
          >
            Forgot Password?
          </p>
        </form>
      </motion.div>
    </div>
  );
}
