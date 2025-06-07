import { useState } from "react";
import { FaUser, FaLock, FaEnvelope, FaUserTag } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "@/api/axios"; // Assuming this path is correct for your project
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // For user notifications

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    role: "", // This will hold 'USER' or 'ADMIN'
  });
  const navigate = useNavigate();

  // Handle changes in form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Basic client-side validation (can be expanded)
    if (!formData.username || !formData.password || !formData.email || !formData.role) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    // Simple email regex for client-side check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }


    try {
      await axios.post("/auth/register", formData);
      toast.success("Registration successful! Please log in."); // User-friendly success message
      navigate("/login"); // Redirect to login page after successful registration
    } catch (error) {
      // Handle different error responses from the backend
      if (error.response && error.response.status === 409) {
        toast.error("Username or email already exists. Please try another.");
      } else {
        toast.error("Registration failed. Please try again later.");
      }
      console.error("User registration failed:", error); // Log the full error for debugging
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
      {/* Registration card container */}
      <div className="relative bg-white/95 backdrop-blur-xl p-6 sm:p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-md lg:max-w-lg transform hover:scale-[1.02] transition-all duration-300 border border-white/20">
        {/* Registration icon */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-5 sm:mb-6 shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 sm:h-8 sm:w-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 7a4 4 0 10-8 0 4 4 0 008 0zM12 14v6m-6-6h12"
            />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-7 sm:mb-8">
          Register to QuizWiz
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          {/* Username Input */}
          <div
            className={`relative flex items-center border-2 rounded-xl px-3 py-2 sm:px-4 sm:py-3 transition-all duration-300 border-gray-200 bg-gray-50 hover:border-gray-300 focus-within:ring-4 focus-within:ring-indigo-100 focus-within:border-indigo-400`}
          >
            <FaUser className="text-gray-400 mr-2 sm:mr-3 text-base sm:text-lg" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full outline-none bg-transparent text-gray-700 placeholder-gray-400 text-sm sm:text-base"
              required
            />
          </div>

          {/* Password Input */}
          <div
            className={`relative flex items-center border-2 rounded-xl px-3 py-2 sm:px-4 sm:py-3 transition-all duration-300 border-gray-200 bg-gray-50 hover:border-gray-300 focus-within:ring-4 focus-within:ring-indigo-100 focus-within:border-indigo-400`}
          >
            <FaLock className="text-gray-400 mr-2 sm:mr-3 text-base sm:text-lg" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full outline-none bg-transparent text-gray-700 placeholder-gray-400 text-sm sm:text-base"
              required
            />
          </div>

          {/* Email Input */}
          <div
            className={`relative flex items-center border-2 rounded-xl px-3 py-2 sm:px-4 sm:py-3 transition-all duration-300 border-gray-200 bg-gray-50 hover:border-gray-300 focus-within:ring-4 focus-within:ring-indigo-100 focus-within:border-indigo-400`}
          >
            <FaEnvelope className="text-gray-400 mr-2 sm:mr-3 text-base sm:text-lg" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full outline-none bg-transparent text-gray-700 placeholder-gray-400 text-sm sm:text-base"
              required
            />
          </div>

          {/* Role Select */}
          <div
            className={`relative flex items-center border-2 rounded-xl px-3 py-2 sm:px-4 sm:py-3 transition-all duration-300 border-gray-200 bg-gray-50 hover:border-gray-300 focus-within:ring-4 focus-within:ring-indigo-100 focus-within:border-indigo-400`}
          >
            <FaUserTag className="text-gray-400 mr-2 sm:mr-3 text-base sm:text-lg" />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full outline-none bg-transparent text-gray-700 text-sm sm:text-base cursor-pointer"
              required
            >
              <option value="" disabled className="text-gray-400">
                Select Role
              </option>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 sm:py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:translate-y-[-2px] disabled:opacity-60 disabled:cursor-not-allowed text-base sm:text-lg"
          >
            Register
          </button>
        </form>

        {/* Login link */}
        <div className="mt-5 sm:mt-6 text-center text-sm sm:text-base text-gray-600">
          Already registered?{" "}
          <Link
            to="/login"
            className="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline transition-colors duration-200"
          >
            Login
          </Link>
        </div>

        {/* Security message */}
        <div className="mt-5 sm:mt-6 flex items-center justify-center text-xs text-gray-400">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full mr-2"></div>
          <span>Secured with 256-bit SSL encryption</span>
        </div>
      </div>
    </div>
  );
}