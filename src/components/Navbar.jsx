import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { motion } from "framer-motion";

export default function Navbar() {
  const { user } = useAuth();
  const role = user?.role; // Assuming user object has a role property
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // 👈 Redirect to Register.jsx route
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-white shadow-md p-4 flex justify-between items-center"
    >
      {/* Logo */}
      <Link
        to="/Home"
        className="font-extrabold text-xl text-blue-600 hover:text-blue-700 transition"
      >
       <img src="src/assets/favicon2.png" alt="AlumniConnect Logo" className="h-14" />
      </Link>

      {/* Navigation Links */}
      <nav className="flex gap-6">
        {[
          { path: "/directory", label: "Directory" },
          { path: "/events", label: "Events" },
          { path: "/mentorship", label: "Mentorship" },
          { path: "/fundraising", label: "Fundraising" },
          { path: "/Achievement", label: "Achievement" },
          { path: "/chatbot", label: "Chatbot" },
        ].map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `font-medium transition ${
                isActive
                  ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                  : "text-gray-500 hover:text-blue-500"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User Actions */}
      <div className="flex gap-4 items-center">
        {user ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
          >
            Logout
          </motion.button>
        ) : (
          <Link
            to="/"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Login
          </Link>
        )}

        {user && (
          <Link
            to="/announcements"
            className="text-gray-600 hover:text-blue-600 font-medium"
          >
            Announcements
          </Link>
        )}

        {role === "admin" && (
          <Link
            to="/admin"
            className="text-gray-600 hover:text-blue-600 font-medium"
          >
            Admin
          </Link>
        )}
      </div>
    </motion.header>
  );
}
