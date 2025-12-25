# Inhouse Patient Management System for Private Hospitals

## Overview
The Inhouse Patient Management System is a comprehensive solution designed to streamline the management of patients, staff, and treatments in private hospitals. This system is divided into two main components:

1. **Frontend**: Built with React.js, it provides an intuitive and user-friendly interface for hospital staff.
2. **Backend**: Powered by Flask, it handles the server-side logic, database interactions, and API endpoints.

---

## Features

### Frontend
- **Attendant Module**:
  - Add new patients.
  - View all patients.
  - Access detailed patient information.
- **Doctor Module**:
  - Chat functionality.
  - Discharge patients.
  - Generate PDF reports.
  - View and manage treatments.
- **Nurse Module**:
  - Update treatment details.
  - View patient treatments.
- **Authentication**:
  - Login and registration components.
- **Navigation**:
  - Sidebar and content navigation for seamless user experience.

### Backend
- **Database Management**:
  - Utilizes MySQL for storing patient, user, and treatment data.
- **API Endpoints**:
  - Patient management (add, delete, update).
  - Chat functionality.
  - Treatment updates.
- **PDF Generation**:
  - Generate detailed patient reports in PDF format.
- **Security**:
  - Password hashing for secure authentication.

---

## Installation

### Prerequisites
- Node.js and npm (for the frontend).
- Python 3.x and pip (for the backend).
- MySQL database.

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Configure the database in `app.py`:
   - Update the `SQLALCHEMY_DATABASE_URI` with your MySQL credentials.
4. Start the Flask server:
   ```bash
   python app.py
   ```

---

## Usage
- Access the frontend at `http://localhost:3000`.
- The backend API runs at `http://localhost:5000`.

---

## Contributing
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-branch
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-branch
   ```
5. Open a pull request.

---

## License
This project is licensed under the MIT License. See the LICENSE file for details.