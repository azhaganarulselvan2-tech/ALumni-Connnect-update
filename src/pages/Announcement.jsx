// src/pages/Announcements.jsx
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Announcements() {
  const { user, role, loading } = useAuth();
  const [messages, setMessages] = useState([]);
  const [form, setForm] = useState({ subject: "", body: "", targetRole: "all" });
  const [showModal, setShowModal] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  // Fetch announcements
  const fetchMessages = async () => {
    try {
      const q = query(
        collection(db, "notifications"),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Error fetching announcements:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleFormChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.subject.trim() || !form.body.trim()) {
      setError("Subject and Body are required.");
      return;
    }

    if (!user || role !== "admin") {
      setError("Only admins can perform this action.");
      return;
    }

    setPosting(true);
    try {
      if (editingMessage) {
        // Update existing announcement
        await updateDoc(doc(db, "notifications", editingMessage.id), {
          ...form,
          updatedAt: serverTimestamp(),
        });
      } else {
        // Add new announcement
        await addDoc(collection(db, "notifications"), {
          ...form,
          createdAt: serverTimestamp(),
        });
      }

      setForm({ subject: "", body: "", targetRole: "all" });
      setEditingMessage(null);
      setShowModal(false);
      fetchMessages();
    } catch (err) {
      console.error("Error saving announcement:", err);
      setError("Failed to save announcement.");
    }
    setPosting(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;

    try {
      await deleteDoc(doc(db, "notifications", id));
      fetchMessages();
    } catch (err) {
      console.error("Error deleting announcement:", err);
      alert("Failed to delete announcement.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!user) return <p className="text-center mt-10 text-gray-400">Login to view announcements.</p>;

  return (
    <motion.section
      className="grid gap-6 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-white">Announcements</h2>

      {/* Admin Add Button */}
      {role === "admin" && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
          onClick={() => {
            setForm({ subject: "", body: "", targetRole: "all" });
            setEditingMessage(null);
            setShowModal(true);
          }}
        >
          + Add Announcement
        </motion.button>
      )}

      {/* Announcement List */}
      {messages.length === 0 ? (
        <p className="text-gray-400">No announcements yet.</p>
      ) : (
        <motion.div layout className="grid gap-3">
          {messages.map((m) => (
            <motion.div
              key={m.id}
              className="p-4 border rounded bg-white shadow-sm"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="font-bold text-black">{m.subject}</h3>
              <p className="text-black">{m.body}</p>
              <p className="text-xs text-gray-500">
                Target Role: {m.targetRole} •{" "}
                {m.createdAt?.toDate
                  ? m.createdAt.toDate().toLocaleString()
                  : "Just now"}
              </p>

              {/* Admin Edit/Delete */}
              {role === "admin" && (
                <div className="flex gap-2 mt-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                    onClick={() => {
                      setEditingMessage(m);
                      setForm({
                        subject: m.subject,
                        body: m.body,
                        targetRole: m.targetRole,
                      });
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(m.id)}
                  >
                    Delete
                  </motion.button>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded w-96"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg font-bold mb-3 text-black">
                {editingMessage ? "Edit Announcement" : "Add Announcement"}
              </h2>
              {error && <p className="text-red-500 mb-2">{error}</p>}

              <form onSubmit={handleSave} className="grid gap-2">
                <input
                  name="subject"
                  value={form.subject}
                  placeholder="Subject"
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded text-black bg-white"
                  required
                />
                <textarea
                  name="body"
                  value={form.body}
                  placeholder="Body"
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded text-black bg-white"
                  required
                />
                <select
                  name="targetRole"
                  value={form.targetRole}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded text-black bg-white"
                >
                  <option value="all">All</option>
                  <option value="admin">Admin</option>
                  <option value="student">Student</option>
                  <option value="alumni">Alumni</option>
                </select>

                <div className="flex gap-2 mt-2">
                  <motion.button
                    type="submit"
                    className="bg-green-600 text-white px-3 py-1 rounded"
                    disabled={posting}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {posting ? "Saving..." : "Save"}
                  </motion.button>
                  <motion.button
                    type="button"
                    className="bg-gray-300 px-3 py-1 rounded text-black"
                    onClick={() => {
                      setShowModal(false);
                      setEditingMessage(null);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
