// src/pages/Fundraising.jsx
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Fundraising() {
  const { role, user } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [form, setForm] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCampaigns();
  }, []);

  async function fetchCampaigns() {
    setLoading(true);
    try {
      const q = query(collection(db, "fundraising"));
      const snap = await getDocs(q);
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setCampaigns(list);
    } catch (err) {
      console.error("Error fetching campaigns:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleFormChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSaveCampaign(e) {
    e.preventDefault();
    setError("");

    if (!user || role !== "admin") {
      setError("Only admins can manage campaigns.");
      return;
    }

    if (!form.title || !form.goal || !form.deadline) {
      setError("Title, Goal, and Deadline are required.");
      return;
    }

    try {
      if (editingCampaign) {
        await updateDoc(doc(db, "fundraising", editingCampaign.id), form);
      } else {
        const id = Date.now().toString();
        await setDoc(doc(db, "fundraising", id), {
          ...form,
          createdAt: new Date().toISOString(),
          createdBy: user.uid,
        });
      }

      await fetchCampaigns();
      setShowModal(false);
      setForm({});
      setEditingCampaign(null);
    } catch (err) {
      console.error(err);
      setError("Failed to save campaign.");
    }
  }

  async function handleDeleteCampaign(id) {
    if (!window.confirm("Are you sure you want to delete this campaign?")) return;
    try {
      await deleteDoc(doc(db, "fundraising", id));
      await fetchCampaigns();
    } catch (err) {
      console.error(err);
      alert("Failed to delete campaign.");
    }
  }

  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-2xl font-bold mb-4">Fundraising Campaigns</h1>

      {role === "admin" && (
        <motion.button
          className="bg-gray-600 text-white px-3 py-1 rounded mb-4"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setEditingCampaign(null);
            setForm({});
            setShowModal(true);
          }}
        >
          + Add Campaign
        </motion.button>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <motion.div
          className="overflow-auto border rounded"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-black">Title</th>
                <th className="p-2 text-black">Purpose</th>
                <th className="p-2 text-black">Goal</th>
                <th className="p-2 text-black">Raised</th>
                <th className="p-2 text-black">Deadline</th>
                <th className="p-2 text-black">Created At</th>
                <th className="p-2 text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {campaigns.map((c) => (
                  <motion.tr
                    key={c.id}
                    className="border-t"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4 }}
                  >
                    <td className="p-2">{c.title}</td>
                    <td className="p-2">{c.purpose}</td>
                    <td className="p-2">{c.goal}</td>
                    <td className="p-2">{c.raised || 0}</td>
                    <td className="p-2">{c.deadline}</td>
                    <td className="p-2">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-2 flex gap-2">
                      {role === "admin" && (
                        <>
                          <motion.button
                            className="bg-yellow-500 text-white px-2 py-1 rounded"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setEditingCampaign(c);
                              setForm(c);
                              setShowModal(true);
                            }}
                          >
                            Edit
                          </motion.button>
                          <motion.button
                            className="bg-red-600 text-white px-2 py-1 rounded"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDeleteCampaign(c.id)}
                          >
                            Delete
                          </motion.button>
                        </>
                      )}
                      <motion.button
                        className="bg-blue-600 text-white px-2 py-1 rounded"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          (window.location.href = `/payments?campaignId=${c.id}`)
                        }
                      >
                        Donate
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded w-96 text-black"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg font-bold mb-3">
                {editingCampaign ? "Edit Campaign" : "Add Campaign"}
              </h2>

              <input
                name="title"
                value={form.title || ""}
                placeholder="Title"
                onChange={handleFormChange}
                className="w-full mb-2 p-2 border"
              />
              <input
                name="purpose"
                value={form.purpose || ""}
                placeholder="Purpose"
                onChange={handleFormChange}
                className="w-full mb-2 p-2 border"
              />
              <input
                name="goal"
                value={form.goal || ""}
                placeholder="Goal"
                onChange={handleFormChange}
                className="w-full mb-2 p-2 border"
              />
              <input
                name="raised"
                value={form.raised || ""}
                placeholder="Raised"
                onChange={handleFormChange}
                className="w-full mb-2 p-2 border"
              />
              <input
                type="date"
                name="deadline"
                value={form.deadline || ""}
                onChange={handleFormChange}
                className="w-full mb-2 p-2 border"
              />

              {error && <p className="text-red-500 mb-2">{error}</p>}

              <div className="flex gap-2">
                <motion.button
                  className="bg-green-600 text-white px-3 py-1 rounded"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSaveCampaign}
                >
                  Save
                </motion.button>
                <motion.button
                  className="bg-gray-300 px-3 py-1 rounded"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
