
from flask import Flask, request, jsonify, send_file, session
from flask_cors import CORS
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import io
from werkzeug.security import generate_password_hash, check_password_hash

from database import db, Patient, User, Symptom, Condition

app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = 'hospital'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///patients.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()

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

@app.route('/update/<int:id>', methods=['PUT'])
def update_patient(id):
    patient = Patient.query.get_or_404(id)
    data = request.json

    patient.diseases = data.get('diseases', patient.diseases)
    patient.treatment = data.get('treatment', patient.treatment)
    patient.discharge_date = data.get('discharge_date', patient.discharge_date)

    Symptom.query.filter_by(patient_id=id).delete()
    for s in data.get('symptoms', []):
        new_symptom = Symptom(description=s['description'], date=s['date'], patient_id=id)
        db.session.add(new_symptom)

    Condition.query.filter_by(patient_id=id).delete()
    for c in data.get('conditions', []):
        new_condition = Condition(description=c['description'], date=c['date'], patient_id=id)
        db.session.add(new_condition)

    db.session.commit()
    return jsonify({"message": "Patient updated successfully"}), 200

@app.route('/delete/<int:id>', methods=['DELETE'])
def delete_patient(id):
    patient = Patient.query.get(id)
    if not patient:
        return jsonify({"message": "Patient not found"}), 404

    db.session.delete(patient)
    db.session.commit()
    return jsonify({"message": "Patient deleted successfully"}), 200

@app.route('/generate-pdf/<int:id>', methods=['GET'])
def generate_pdf(id):
    patient = Patient.query.get_or_404(id)
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    p.setFont("Helvetica-Bold", 16)
    p.drawCentredString(width / 2, height - 50, "City General Hospital")
    p.setFont("Helvetica-Bold", 12)
    y_position = height - 100
    p.drawString(100, y_position, "Patient Report")
    p.line(100, y_position - 5, 500, y_position - 5)

    p.setFont("Helvetica", 10)
    details = [
        ("Patient Name", patient.name),
        ("Age", str(patient.age)),
        ("Date of Birth", patient.dob),
        ("Admit Date", patient.admit_date),
        ("Diseases", patient.diseases),
        ("Treatment", patient.treatment),
        ("Discharge Date", patient.discharge_date),
    ]
    y_position -= 30
    for label, value in details:
        p.drawString(100, y_position, f"{label}: {value}")
        y_position -= 20

    p.drawString(100, y_position, "Symptoms:")
    y_position -= 20
    for symptom in patient.symptoms:
        p.drawString(120, y_position, f"{symptom.date} - {symptom.description}")
        y_position -= 15

    p.drawString(100, y_position, "Conditions:")
    y_position -= 20
    for condition in patient.conditions:
        p.drawString(120, y_position, f"{condition.date} - {condition.description}")
        y_position -= 15

    p.setFont("Helvetica-Bold", 12)
    p.drawString(100, y_position - 40, "Doctor's Signature: __________________")

    p.showPage()
    p.save()
    buffer.seek(0)
    return send_file(buffer, as_attachment=True, download_name=f"{patient.name}_report.pdf", mimetype='application/pdf')

@app.route('/register-user', methods=['POST'])
def register_user():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')

    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({"message": "Username already exists"}), 400

    hashed_password = generate_password_hash(password)
    new_user = User(username=username, password=hashed_password, role=role)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(username=username).first()
    if user and check_password_hash(user.password, password):
        session["username"] = username
        return jsonify({"message": "Login successful!", "role": user.role}), 200

    return jsonify({"message": "Invalid credentials"}), 401

@app.route('/check-user', methods=['POST'])
def check_user():
    username = request.json.get('username')
    user = User.query.filter_by(username=username).first()
    return jsonify({'exists': bool(user)}), 200

@app.route('/patients', methods=['GET'])
def get_patients():
    patients = Patient.query.all()
    return jsonify([{"id": p.id, "name": p.name} for p in patients])

@app.route('/patients/<int:id>', methods=['GET'])
def get_patient(id):
    patient = Patient.query.get_or_404(id)
    symptoms = [{"description": s.description, "date": s.date} for s in patient.symptoms]
    conditions = [{"description": c.description, "date": c.date} for c in patient.conditions]
    return jsonify({
        'id': patient.id,
        'name': patient.name,
        'age': patient.age,
        'dob': patient.dob,
        'admit_date': patient.admit_date,
        'diseases': patient.diseases,
        'treatment': patient.treatment,
        'discharge_date': patient.discharge_date,
        'symptoms': symptoms,
        'conditions': conditions
    }), 200

if __name__ == '__main__':
    app.run(debug=True)
