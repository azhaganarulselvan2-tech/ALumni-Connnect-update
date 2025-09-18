// src/pages/Internship.jsx
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  setDoc,
  deleteDoc,
  doc,
  query,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Internship() {
  const { user, role, loading } = useAuth();
  const [posts, setPosts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    company: "",
    description: "",
    postedBy: "",
    contact: "",
    domain: "",
    type: "",
  });
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, posts, domainFilter, typeFilter]);

  async function fetchPosts() {
    try {
      const q = query(collection(db, "internships"));
      const snap = await getDocs(q);
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPosts(list);
      setFiltered(list);
    } catch (err) {
      console.error("Error fetching internships:", err);
    }
  }

  function applyFilters() {
    let data = [...posts];

    if (search.trim()) {
      const s = search.toLowerCase();
      data = data.filter(
        (p) =>
          (p.title || "").toLowerCase().includes(s) ||
          (p.company || "").toLowerCase().includes(s) ||
          (p.description || "").toLowerCase().includes(s) ||
          (p.postedBy || "").toLowerCase().includes(s) ||
          (p.contact || "").toLowerCase().includes(s) ||
          (p.domain || "").toLowerCase().includes(s) ||
          (p.type || "").toLowerCase().includes(s)
      );
    }

    if (domainFilter !== "All") {
      data = data.filter(
        (p) => (p.domain || "").toLowerCase() === domainFilter.toLowerCase()
      );
    }

    if (typeFilter !== "All") {
      data = data.filter(
        (p) => (p.type || "").toLowerCase() === typeFilter.toLowerCase()
      );
    }

    setFiltered(data);
  }

  function handleFormChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSavePost(e) {
    e.preventDefault();
    setError("");

    if (!user || (role !== "admin" && role !== "alumni")) {
      setError("Only admins and alumni can manage opportunities.");
      return;
    }

    if (
      !form.title ||
      !form.company ||
      !form.description ||
      !form.postedBy ||
      !form.contact ||
      !form.domain ||
      !form.type
    ) {
      setError("All fields are required.");
      return;
    }

    try {
      if (editingId) {
        await updateDoc(doc(db, "internships", editingId), form);
      } else {
        const id = Date.now().toString();
        await setDoc(doc(db, "internships", id), {
          ...form,
          createdBy: user.uid,
          createdAt: serverTimestamp(),
        });
      }
      await fetchPosts();
      setShowModal(false);
      setForm({
        title: "",
        company: "",
        description: "",
        postedBy: "",
        contact: "",
        domain: "",
        type: "",
      });
      setEditingId(null);
    } catch (err) {
      console.error(err);
      setError("Failed to save opportunity.");
    }
  }

  async function handleDeletePost(id) {
    if (!window.confirm("Delete this opportunity?")) return;
    try {
      await deleteDoc(doc(db, "internships", id));
      await fetchPosts();
    } catch (err) {
      console.error(err);
      alert("Failed to delete opportunity.");
    }
  }

  function openEdit(post) {
    setForm(post);
    setEditingId(post.id);
    setShowModal(true);
  }

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 min-h-screen bg-gray-200 text-black">
      <h1 className="text-2xl font-bold mb-4">Internship & Opportunities</h1>

      {/* Filters + Search */}
      <div className="flex flex-wrap mb-4 items-center gap-3">
        <input
          type="text"
          placeholder="Search opportunities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-64 text-black"
        />

        <select
          value={domainFilter}
          onChange={(e) => setDomainFilter(e.target.value)}
          className="border p-2 rounded text-black"
        >
          <option>All Domains</option>
          <option>Technology</option>
          <option>Finance</option>
          <option>Healthcare</option>
          <option>Research</option>
          <option>Education</option>
          <option>Design</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border p-2 rounded text-black"
        >
          <option>All Type</option>
          <option>Internship</option>
          <option>Job</option>
          <option>Hackathon</option>
          <option>Fellowship</option>
          <option>Scholarship</option>
          <option>Other</option>
        </select>

        {(role === "admin" || role === "alumni") && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="ml-auto bg-gray-600 text-white px-3 py-1 rounded"
            onClick={() => {
              setForm({
                title: "",
                company: "",
                description: "",
                postedBy: "",
                contact: "",
                domain: "",
                type: "",
              });
              setEditingId(null);
              setShowModal(true);
            }}
          >
            + Add Opportunity
          </motion.button>
        )}
      </div>

      {/* Posts List */}
      {filtered.length === 0 ? (
        <p>No opportunities found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              className="border rounded p-4 bg-gray-100 shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <h2 className="text-lg font-bold">{p.title}</h2>
              <p className="text-sm text-black-400">Company: {p.company}</p>
              <p className="text-sm text-black-400">Domain: {p.domain}</p>
              <p className="text-sm text-black-400">Type: {p.type}</p>
              <p className="mt-1 text-sm text-black-300">Posted By: {p.postedBy}</p>
              <p className="mt-1 text-sm text-black-300">Contact: {p.contact}</p>
              <p className="mt-2 line-clamp-3">{p.description}</p>

              {(role === "admin" || role === "alumni") && (
                <div className="mt-3 flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-yellow-600 text-white px-3 py-1 rounded"
                    onClick={() => openEdit(p)}
                  >
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => handleDeletePost(p.id)}
                  >
                    Delete
                  </motion.button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal (Add/Edit) */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-900 p-6 rounded w-96 text-white"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg font-bold mb-3">
                {editingId ? "Edit Opportunity" : "Add Opportunity"}
              </h2>

              <input
                name="title"
                placeholder="Title"
                value={form.title || ""}
                onChange={handleFormChange}
                className="w-full mb-2 p-2 border text-black rounded"
              />
              <input
                name="company"
                placeholder="Company"
                value={form.company || ""}
                onChange={handleFormChange}
                className="w-full mb-2 p-2 border text-black rounded"
              />
              <input
                name="postedBy"
                placeholder="Posted By"
                value={form.postedBy || ""}
                onChange={handleFormChange}
                className="w-full mb-2 p-2 border text-black rounded"
              />
              <input
                name="contact"
                placeholder="Contact Info"
                value={form.contact || ""}
                onChange={handleFormChange}
                className="w-full mb-2 p-2 border text-black rounded"
              />
              <select
                name="domain"
                value={form.domain || ""}
                onChange={handleFormChange}
                className="w-full mb-2 p-2 border text-black rounded"
              >
                <option value="">Select Domain</option>
                <option>Technology</option>
                <option>Finance</option>
                <option>Healthcare</option>
                <option>Research</option>
                <option>Education</option>
                <option>Design</option>
              </select>
              <select
                name="type"
                value={form.type || ""}
                onChange={handleFormChange}
                className="w-full mb-2 p-2 border text-black rounded"
              >
                <option value="">Select Type</option>
                <option>Internship</option>
                <option>Job</option>
                <option>Hackathon</option>
                <option>Fellowship</option>
                <option>Scholarship</option>
                <option>Other</option>
              </select>
              <textarea
                name="description"
                placeholder="Description"
                value={form.description || ""}
                onChange={handleFormChange}
                className="w-full mb-2 p-2 border text-black rounded"
              />

              {error && <p className="text-red-500 mb-2">{error}</p>}

              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                  onClick={handleSavePost}
                >
                  {editingId ? "Update" : "Create"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gray-300 px-3 py-1 rounded text-black"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
