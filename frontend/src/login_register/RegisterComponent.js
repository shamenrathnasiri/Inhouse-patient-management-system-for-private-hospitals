import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import bgimage from "../assets/images/regbg.jpg";

const RegisterComponent = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "attendant",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
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

    try {
      const checkResponse = await axios.post("http://localhost:5000/check-user", {
        username: formData.username,
      });

      if (checkResponse.data.exists) {
        setErrorMessage("Username is already taken. Please choose another one.");
        return;
      }

      await axios.post("http://localhost:5000/register-user", formData);
      setSuccessMessage("✅ Registration successful! Redirecting...");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setErrorMessage("❌ Error registering user. Please try again.");
      console.error("Error registering user:", error);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-center bg-cover"
      style={{ backgroundImage: `url(${bgimage})` }}
    >
      <div className="w-full max-w-lg p-10 shadow-2xl bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-xl animate-fadeIn">
        <h2 className="mb-6 text-3xl font-extrabold text-center text-blue-700">
          Sign Up to Hospital Portal
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 mt-1 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Your username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 mt-1 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">Select Role</label>
            <div className="flex space-x-4">
              {["attendant", "nurse", "doctor"].map((role) => (
                <label key={role} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={formData.role === role}
                    onChange={handleInputChange}
                    className="accent-blue-600"
                  />
                  <span className="text-gray-700 capitalize">
                    {role === "nurse" ? "Head of Nurse" : role}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {errorMessage && <p className="text-sm text-center text-red-500">{errorMessage}</p>}
          {successMessage && <p className="text-sm text-center text-green-600">{successMessage}</p>}

          <button
            type="submit"
            className="w-full py-2 font-semibold text-white transition duration-300 bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Register
          </button>
        </form>
      </div>

      <style>
        {`
          .animate-fadeIn {
            animation: fadeIn 1s ease-in-out;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}
      </style>
    </div>
  );
};

export default RegisterComponent;
