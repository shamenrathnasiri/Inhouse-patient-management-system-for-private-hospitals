import React, { useState } from 'react';
import axios from 'axios';
import { FaUserPlus, FaUser, FaBirthdayCake, FaCalendarPlus, FaIdBadge } from 'react-icons/fa';

const AddPatient = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    dob: '',
    admit_date: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // clear per-field error while typing
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateField = (name, value) => {
    let msg = '';
    if (name === 'name') {
      if (!value || value.trim().length < 2) msg = 'Please enter the full name (at least 2 characters).';
    }
    if (name === 'age') {
      const n = Number(value);
      if (!value) msg = 'Please enter age.';
      else if (Number.isNaN(n) || n <= 0 || n > 130) msg = 'Enter a valid age.';
    }
    if ((name === 'dob' || name === 'admit_date') && value) {
      // basic ISO date compare
      const date = new Date(value);
      if (isNaN(date.getTime())) msg = 'Enter a valid date.';
    }
    setFieldErrors((prev) => ({ ...prev, [name]: msg }));
    return msg === '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true);

    // validate required fields
    const validName = validateField('name', formData.name);
    const validAge = validateField('age', formData.age);
    const validDob = validateField('dob', formData.dob);
    const validAdmit = validateField('admit_date', formData.admit_date);
    if (!validName || !validAge || !validDob || !validAdmit) {
      setIsLoading(false);
      setError('Please fix the highlighted fields.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/register', formData);
      setMessage(response.data.message);

      setFormData({
        name: '',
        age: '',
        dob: '',
        admit_date: '',
      });

      setFieldErrors({});

      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setError('Error registering patient. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-500/10 border border-primary-500/20">
          <FaUserPlus className="w-5 h-5 text-primary-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Register New Patient</h2>
          <p className="text-sm text-dark-400">Add a new patient to the system</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="glass-card p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="form-label flex items-center gap-2" htmlFor="patient-name">
              <FaUser className="text-dark-500" /> Patient Name
            </label>
            <input
              id="patient-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              onBlur={(e) => validateField(e.target.name, e.target.value)}
              className="input-field"
              placeholder="Enter patient full name"
              autoFocus
              aria-invalid={!!fieldErrors.name}
              aria-describedby={fieldErrors.name ? 'name-error' : undefined}
              required
            />
            {fieldErrors.name && <p id="name-error" className="text-xs text-red-400 mt-1">{fieldErrors.name}</p>}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="form-label flex items-center gap-2" htmlFor="patient-age">
                <FaIdBadge className="text-dark-500" /> Age
              </label>
              <input
                id="patient-age"
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                  onBlur={(e) => validateField(e.target.name, e.target.value)}
                className="input-field"
                placeholder="Age"
                  min="0"
                  max="130"
                  aria-invalid={!!fieldErrors.age}
                  aria-describedby={fieldErrors.age ? 'age-error' : undefined}
                required
              />
                {fieldErrors.age && <p id="age-error" className="text-xs text-red-400 mt-1">{fieldErrors.age}</p>}
            </div>

            <div>
              <label className="form-label flex items-center gap-2" htmlFor="patient-dob">
                <FaBirthdayCake className="text-dark-500" /> Date of Birth
              </label>
              <input
                id="patient-dob"
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                  onBlur={(e) => validateField(e.target.name, e.target.value)}
                className="input-field"
                required
              />
                <p className="text-xs text-dark-400 mt-1">Format: YYYY-MM-DD</p>
                {fieldErrors.dob && <p className="text-xs text-red-400 mt-1">{fieldErrors.dob}</p>}
            </div>
          </div>

          <div>
            <label className="form-label flex items-center gap-2" htmlFor="patient-admit">
              <FaCalendarPlus className="text-dark-500" /> Admission Date
            </label>
            <input
              id="patient-admit"
              type="date"
              name="admit_date"
              value={formData.admit_date}
              onChange={handleInputChange}
              onBlur={(e) => validateField(e.target.name, e.target.value)}
              className="input-field"
              required
            />
            <p className="text-xs text-dark-400 mt-1">Admission date cannot be in the future.</p>
            {fieldErrors.admit_date && <p className="text-xs text-red-400 mt-1">{fieldErrors.admit_date}</p>}
          </div>

          {/* Messages */}
          {message && (
            <div role="status" aria-live="polite" className="flex items-center gap-2 px-4 py-3 rounded-xl bg-accent-500/10 border border-accent-500/20 animate-fade-in">
              <svg className="w-4 h-4 text-accent-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-accent-400">{message}</p>
            </div>
          )}
          {error && (
            <div role="alert" className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 animate-fade-in">
              <svg className="w-4 h-4 text-red-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <button
            id="register-patient-btn"
            type="submit"
            disabled={isLoading}
            className={`btn-primary w-full py-3.5 flex items-center justify-center gap-2 ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <>
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Registering...
              </>
            ) : (
              <>
                <FaUserPlus className="w-4 h-4" />
                Register Patient
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPatient;
