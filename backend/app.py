from flask import Flask, request, jsonify, send_file, session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS  
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import io
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
app.config['SECRET_KEY'] = 'hospital'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///patients.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Patient Model
class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    dob = db.Column(db.String(10), nullable=False)
    admit_date = db.Column(db.String(10), nullable=False)
    diseases = db.Column(db.String(200))
    symptoms = db.Column(db.String(200))
    treatment = db.Column(db.String(200))
    condition = db.Column(db.String(200))
    discharge_date = db.Column(db.String(10))

# Create database
with app.app_context():
    db.create_all()

# Register a new patient
@app.route('/register', methods=['POST'])
def register_patient():
    data = request.json
    new_patient = Patient(
        name=data['name'],
        age=data['age'],
        dob=data['dob'],
        admit_date=data['admit_date']
    )
    db.session.add(new_patient)
    db.session.commit()
    return jsonify({"message": "Patient registered successfully"}), 201

# Update patient details
@app.route('/update/<int:id>', methods=['PUT'])
def update_patient(id):
    patient = Patient.query.get_or_404(id)
    data = request.json
    if 'diseases' in data:
        patient.diseases = data['diseases']
    if 'symptoms' in data:
        patient.symptoms = data['symptoms']
    if 'treatment' in data:
        patient.treatment = data['treatment']
    if 'condition' in data:
        patient.condition = data['condition']
    if 'discharge_date' in data:
        patient.discharge_date = data['discharge_date']
    db.session.commit()
    return jsonify({"message": "Patient updated successfully"}), 200

# Generate PDF Report with Hospital Header and Signature
@app.route('/generate-pdf/<int:id>', methods=['GET'])
def generate_pdf(id):
    patient = Patient.query.get_or_404(id)
    
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    
    width, height = letter

    # Hospital Name as Header
    p.setFont("Helvetica-Bold", 16)
    p.drawCentredString(width / 2, height - 50, "City General Hospital")

    # Table Header
    p.setFont("Helvetica-Bold", 12)
    y_position = height - 100
    p.drawString(100, y_position, "Patient Report")

    # Draw a line under the header
    p.line(100, y_position - 5, 500, y_position - 5)

    # Table Content
    p.setFont("Helvetica", 10)
    details = [
        ("Patient Name", patient.name),
        ("Age", str(patient.age)),
        ("Date of Birth", patient.dob),
        ("Admit Date", patient.admit_date),
        ("Diseases", patient.diseases if patient.diseases else "N/A"),
        ("Symptoms", patient.symptoms if patient.symptoms else "N/A"),
        ("Treatment", patient.treatment if patient.treatment else "N/A"),
        ("Condition", patient.condition if patient.condition else "N/A"),
        ("Discharge Date", patient.discharge_date if patient.discharge_date else "N/A"),
    ]

    y_position -= 30
    for label, value in details:
        p.drawString(100, y_position, f"{label}: {value}")
        y_position -= 20

    # Doctor's Signature Area
    p.setFont("Helvetica-Bold", 12)
    p.drawString(100, y_position - 40, "Doctor's Signature: __________________")

    # Save and return the PDF
    p.showPage()
    p.save()
    buffer.seek(0)
    return send_file(buffer, as_attachment=True, download_name=f"{patient.name}_report.pdf", mimetype='application/pdf')

# User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(50), nullable=False)

# Create database
with app.app_context():
    db.create_all()

# Register User
@app.route('/register-user', methods=['POST'])
def register_user():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')

    # Check if username already exists
    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({"message": "Username already exists"}), 400

    hashed_password = generate_password_hash(password)

    new_user = User(username=username, password=hashed_password, role=role)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

# Login User
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(username=username).first()

    if user and check_password_hash(user.password, password):
        session["username"] = username  # Store username in session
        return jsonify({"message": "Login successful!", "role": user.role}), 200

    return jsonify({"message": "Invalid credentials"}), 401

# Check if username exists
@app.route('/check-user', methods=['POST'])
def check_user():
    username = request.json.get('username')
    user = User.query.filter_by(username=username).first()
    if user:
        return jsonify({'exists': True}), 200
    else:
       return jsonify({'exists': False}), 200

# Get all patients
@app.route('/patients', methods=['GET'])
def get_patients():
    patients = Patient.query.all()
    patients_list = [{"id": patient.id, "name": patient.name} for patient in patients]
    return jsonify(patients_list)

# Get a single patient
@app.route('/patients/<int:id>', methods=['GET'])
def get_patient(id):
    patient = Patient.query.get(id)
    if patient:
        return jsonify({
            'id': patient.id,
            'name': patient.name,
            'age': patient.age,
            'dob': patient.dob,
            'admit_date': patient.admit_date,
            'symptoms': patient.symptoms,
            'condition': patient.condition,
            'diseases': patient.diseases,
            'treatment': patient.treatment,
            'discharge_date': patient.discharge_date
        }), 200
    else:
        return jsonify({'message': 'Patient not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)
