import { useState } from "react";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};
    if (!username.trim()) newErrors.username = "Username is required";
    if (!password.trim()) newErrors.password = "Password is required";
    if (password.length > 0 && password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle user login
  const handleLogin = async () => {
    if (!validateForm()) return; // Stop if validation fails

    setLoading(true); // Indicate loading state
    try {
      const res = await axios.post("/auth/login", { username, password });
      const { role, username: name } = res.data;

      // Store user data in local storage
      localStorage.setItem("username", name);
      localStorage.setItem("role", role);

      toast.success(`Welcome back, ${name}!`); // Success notification

      // Navigate to quiz list after a short delay
      setTimeout(() => {
        navigate("/quizlist");
      }, 1000);
    } catch (err) {
      toast.error("Login failed. Please check your credentials."); // Error notification
      console.error("Login error:", err); // Log the error for debugging
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Handle Enter key press for form submission
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
      {/* Main login card container */}
      <div className="relative bg-white/95 backdrop-blur-xl p-6 sm:p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-md lg:max-w-lg transform hover:scale-[1.02] transition-all duration-300 border border-white/20">
        <div className="text-center mb-6 sm:mb-8">
          {/* User icon */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
            <FaUser className="text-white text-xl sm:text-2xl" />
          </div>
          {/* Welcome text */}
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1 sm:mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">
            Sign in to your account to continue
          </p>
        </div>

        {/* Input fields and login button */}
        <div className="space-y-5 sm:space-y-6">
          {/* Username input */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <div
              className={`relative flex items-center border-2 rounded-xl px-3 py-2 sm:px-4 sm:py-3 transition-all duration-300 ${
                errors.username
                  ? "border-red-300 bg-red-50"
                  : username
                  ? "border-indigo-400 bg-indigo-50"
                  : "border-gray-200 bg-gray-50 hover:border-gray-300"
              } focus-within:ring-4 focus-within:ring-indigo-100 focus-within:border-indigo-400`}
            >
              <FaUser
                className={`mr-2 sm:mr-3 transition-colors duration-300 ${
                  errors.username
                    ? "text-red-400"
                    : username
                    ? "text-indigo-500"
                    : "text-gray-400"
                }`}
              />
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full outline-none bg-transparent text-gray-700 placeholder-gray-400 text-sm sm:text-base"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errors.username) setErrors({ ...errors, username: "" });
                }}
                onKeyPress={handleKeyPress}
              />
            </div>
            {errors.username && (
              <p className="text-red-500 text-xs mt-1 animate-pulse">
                {errors.username}
              </p>
            )}
          </div>

          {/* Password input */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div
              className={`relative flex items-center border-2 rounded-xl px-3 py-2 sm:px-4 sm:py-3 transition-all duration-300 ${
                errors.password
                  ? "border-red-300 bg-red-50"
                  : password
                  ? "border-indigo-400 bg-indigo-50"
                  : "border-gray-200 bg-gray-50 hover:border-gray-300"
              } focus-within:ring-4 focus-within:ring-indigo-100 focus-within:border-indigo-400`}
            >
              <FaLock
                className={`mr-2 sm:mr-3 transition-colors duration-300 ${
                  errors.password
                    ? "text-red-400"
                    : password
                    ? "text-indigo-500"
                    : "text-gray-400"
                }`}
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full outline-none bg-transparent text-gray-700 placeholder-gray-400 text-sm sm:text-base"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: "" });
                }}
                onKeyPress={handleKeyPress}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-gray-400 hover:text-indigo-500 transition-colors duration-200 text-sm sm:text-base"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 animate-pulse">
                {errors.password}
              </p>
            )}
          </div>

          {/* Sign In button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 sm:py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:translate-y-[-2px] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group text-base sm:text-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative flex items-center justify-center">
              {loading ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </span>
          </button>

          {/* Forgot password link */}
          <div className="text-center">
            <button className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline transition-colors duration-200">
              Forgot your password?
            </button>
          </div>
        </div>

        {/* Separator */}
        <div className="my-6 sm:my-8 flex items-center">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-3 text-sm text-gray-500 bg-white">or</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* Create Account link */}
        <div className="text-center">
          <p className="text-gray-600 text-sm sm:text-base">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline transition-colors duration-200"
            >
              Create Account
            </button>
          </p>
        </div>

        {/* Security message */}
        <div className="mt-5 sm:mt-6 flex items-center justify-center text-xs text-gray-400">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full mr-2"></div>
          <span>Secured with 256-bit SSL encryption</span>
        </div>
      </div>
    </div>
  );
};

export default Login;