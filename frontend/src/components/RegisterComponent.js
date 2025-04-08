import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import bgimage from "../images/regbg.jpg";

const RegisterComponent = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "attendant", // Default role
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
      // Check if the username already exists
      const checkResponse = await axios.post("http://localhost:5000/check-user", {
        username: formData.username,
      });

      if (checkResponse.data.exists) {
        setErrorMessage("Username is already taken. Please choose another one.");
        return;
      }

      // If the username is available, proceed with registration
      const response = await axios.post("http://localhost:5000/register-user", formData);
      setSuccessMessage("Registration successful! You can now log in.");

      setTimeout(() => {
        navigate("/login"); // Redirect to login after successful registration
      }, 2000);
    } catch (error) {
      // Handle server-side or network errors
      setErrorMessage("Error registering user. Please try again.");
      console.error("Error registering user:", error);
    }
  };

  return (
    <div className="relative w-full h-screen">
      {/* Background Image */}
      <img
        src={bgimage}
        alt="background"
        className="absolute top-0 left-0 object-cover w-full h-full brightness-75"
      />

      {/* Centered Form */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg bg-opacity-90">
          <h2 className="text-2xl font-semibold text-center text-gray-700">Register</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col">
              <label htmlFor="username" className="text-sm text-gray-600">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                required
                className="px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="text-sm text-gray-600">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
                className="px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-sm font-bold text-gray-600">Select Role</label>
              {["attendant", "nurse", "doctor"].map((role) => (
                <div key={role} className="flex items-center">
                  <input
                    type="radio"
                    id={role}
                    name="role"
                    value={role}
                    checked={formData.role === role}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label htmlFor={role} className="text-sm text-gray-700 capitalize">
                    {role === "nurse" ? "Head of Nurse" : role}
                  </label>
                </div>
              ))}
            </div>

            {errorMessage && <p className="text-center text-red-500">{errorMessage}</p>}
            {successMessage && <p className="text-center text-green-500">{successMessage}</p>}

            <button
              type="submit"
              className="w-full py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterComponent;
