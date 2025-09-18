// src/pages/Register.jsx
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Register() {
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { email, password, ...extra } = formData;

      if (role !== "alumni") {
        extra.company = "-";
        extra.batch = "-";
      }
      if (role !== "student") {
        extra.location = "-";
        extra.profession = "Student";
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        role,
        email,
        ...extra,
      });

      navigate("/directory");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white-50 to-gray-100">
      <AnimatePresence mode="wait">
        {!role ? (
          // Role Selection Screen
          <motion.div
            key="role-selection"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-2xl p-10 text-center"
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
              Register As
            </h1>
            <div className="space-y-4 w-64">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setRole("admin")}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
              >
                College Admin
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setRole("student")}
                className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
              >
                Student
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setRole("alumni")}
                className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700 transition"
              >
                Alumni
              </motion.button>
              <a className="block mt-6 text-sm text-blue-500 hover:text-gray-700" href="/">
                Back to Home
              </a>
            </div>
          </motion.div>
        ) : (
          // Registration Form Screen
          <motion.div
            key="form-screen"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-lg bg-white rounded-xl shadow-2xl p-8"
          >
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              {role.charAt(0).toUpperCase() + role.slice(1)} Registration
            </h1>

            <form onSubmit={handleRegister} className="space-y-4">
              {/* Common fields */}
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <input
                type="date"
                name="dob"
                placeholder="Date of Birth"
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
              />

              {/* Alumni-only fields */}
              {role === "alumni" && (
                <>
                  <input
                    type="text"
                    name="graduateYear"
                    placeholder="Graduation Year"
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                  <input
                    type="text"
                    name="collegeName"
                    placeholder="College Name"
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                  <input
                    type="year"
                    name="batch"
                    placeholder="Batch (e.g. CSE-2018)"
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                 <input
                    type="text"
                    name="profession"
                    placeholder="Profession"
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                  <input
                    type="text"
                    name="company"
                    placeholder="Company"
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                  <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                </>
              )}

              {/* Admin-only field */}
              {role === "admin" && (
                <>
                <input
                  type="text"
                  name="employeeId"
                  placeholder="Employee ID"
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                />
                <input
                type="text"
                name="profession"
                placeholder="Profession"
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                />
                </>
              )}

              {/* Student-only fields */}
              {role === "student" && (
                <>
                  <input
                    type="text"
                    name="registrationNo"
                    placeholder="Registration No"
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                  <input
                    type="text"
                    name="batch"
                    placeholder="Batch (e.g. CSE-2022)"
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                  <input
                    type="text"
                    name="yearToGraduate"
                    placeholder="Year to Graduate"
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                <input
                  type="text"
                  name="profession"
                  value="Student"
                  readOnly
                  placeholder="Profession"
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg border bg-gray-500 border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                />
                
                  <input
                    type="text"
                    name="collegeName"
                    placeholder="College Name"
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                  <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                </>
              )}

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
              >
                Register
              </motion.button>
            </form>

            <button
              className="mt-6 text-sm text-gray-500 hover:text-gray-700"
              onClick={() => setRole("")}
            >
              ← Back to Role Selection
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
