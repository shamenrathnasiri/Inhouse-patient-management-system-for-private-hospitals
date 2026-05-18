import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaUserAlt, FaLock, FaHospitalAlt, FaUserTag, FaArrowLeft } from 'react-icons/fa';

const RegisterComponent = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "attendant",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const checkResponse = await axios.post("http://localhost:5000/check-user", {
        username: formData.username,
      });

      if (checkResponse.data.exists) {
        setErrorMessage("Username is already taken. Please choose another one.");
        setIsLoading(false);
        return;
      }

      await axios.post("http://localhost:5000/register-user", formData);
      setSuccessMessage("Registration successful! Redirecting...");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setErrorMessage("Error registering user. Please try again.");
      console.error("Error registering user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    { value: "attendant", label: "Attendant" },
    { value: "nurse", label: "Head of Nurse" },
    { value: "doctor", label: "Doctor" },
  ];

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-dark-950">
      {/* Background effects */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent-500/8 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary-600/6 rounded-full blur-[100px]" />

      <div className="relative z-10 w-full max-w-lg px-6 py-8 animate-fade-in-up">
        {/* Back Link */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 mb-6 text-sm font-medium text-dark-400 hover:text-primary-400 transition-colors"
        >
          <FaArrowLeft className="w-3 h-3" />
          Back to Login
        </Link>

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-accent-500/10 border border-accent-500/20">
            <FaHospitalAlt className="w-8 h-8 text-accent-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="mt-2 text-dark-400">Join the Hospital Management Portal</p>
        </div>

        {/* Register Card */}
        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label htmlFor="reg-username" className="form-label">Username</label>
              <div className="relative">
                <FaUserAlt className="absolute text-dark-500 left-4 top-1/2 -translate-y-1/2" />
                <input
                  id="reg-username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="input-field pl-11"
                  placeholder="Choose a username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="form-label">Password</label>
              <div className="relative">
                <FaLock className="absolute text-dark-500 left-4 top-1/2 -translate-y-1/2" />
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="input-field pl-11 pr-12"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="form-label flex items-center gap-2">
                <FaUserTag className="text-dark-500" />
                Select Role
              </label>
              <div className="grid grid-cols-3 gap-3 mt-2">
                {roles.map((role) => (
                  <label
                    key={role.value}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl cursor-pointer transition-all duration-300 border ${
                      formData.role === role.value
                        ? 'bg-primary-500/15 border-primary-500/30 text-primary-300'
                        : 'bg-dark-900/40 border-dark-700/40 text-dark-400 hover:border-dark-600/50 hover:bg-dark-800/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role.value}
                      checked={formData.role === role.value}
                      onChange={handleInputChange}
                      className="hidden"
                    />
                    <span className="text-xl">{role.icon}</span>
                    <span className="text-xs font-medium text-center">{role.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Messages */}
            {errorMessage && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <svg className="w-4 h-4 text-red-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-400">{errorMessage}</p>
              </div>
            )}
            {successMessage && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-accent-500/10 border border-accent-500/20">
                <svg className="w-4 h-4 text-accent-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-accent-400">{successMessage}</p>
              </div>
            )}

            {/* Submit */}
            <button
              id="register-submit-btn"
              type="submit"
              disabled={isLoading}
              className={`w-full btn-accent flex items-center justify-center gap-2 py-3.5 text-base ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>

            <p className="text-sm text-center text-dark-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary-400 hover:text-primary-300 transition-colors">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterComponent;
