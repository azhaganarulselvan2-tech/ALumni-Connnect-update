import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const auth = getAuth();

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Check your inbox.");
    } catch (err) {
      setError("❌ " + err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-10 text-black">
      <div className="bg-gray-100 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-600 text-center mb-6">
          Forgot Password
        </h2>

        <form onSubmit={handlePasswordReset} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-lg p-3 font-semibold"
          >
            Reset Password
          </button>
        </form>

        {message && (
          <p className="mt-4 text-green-400 text-center">{message}</p>
        )}
        {error && <p className="mt-4 text-red-400 text-center">{error}</p>}
      </div>
    </div>
  );
}

export default ForgotPassword;
