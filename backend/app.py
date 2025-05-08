from flask import Flask, request, jsonify, send_file, session
from flask_cors import CORS
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import io
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import date
from database import db, Patient, User, Treatment, ChatMessage 
import base64
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader


app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = 'hospital'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///patients.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()
    
# DELETE a patient by ID
@app.route('/patient/delete/<int:patient_id>', methods=['DELETE'])
def delete_patient(patient_id):
    patient = Patient.query.get(patient_id)
    if not patient:
        return jsonify({'error': 'Patient not found'}), 404

    db.session.delete(patient)
    db.session.commit()
    return jsonify({'message': 'Patient deleted successfully'}), 200

    
@app.route('/chat/send', methods=['POST'])
def send_message():
    data = request.json
    new_msg = ChatMessage(
        sender=data['sender'],
        receiver=data['receiver'],
        message=data['message']
    )
    db.session.add(new_msg)
    db.session.commit()
    return jsonify({"status": "Message sent"}), 201

@app.route('/chat/messages', methods=['GET'])
def get_messages():
    print("lsdjflkdsj")
    user1 = request.args.get('user1')
    user2 = request.args.get('user2')

    messages = ChatMessage.query.filter(
        ((ChatMessage.sender == user1) & (ChatMessage.receiver == user2)) |
        ((ChatMessage.sender == user2) & (ChatMessage.receiver == user1))
    ).order_by(ChatMessage.timestamp).all()

    result = [
        {
            "id": msg.id,
            "sender": msg.sender,
            "receiver": msg.receiver,
            "message": msg.message,
            "timestamp": msg.timestamp.strftime('%Y-%m-%d %H:%M:%S')
        }
        for msg in messages
    ]

    return jsonify(result)


# Register patient
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



@app.route('/generate-pdf/<int:id>', methods=['GET'])
def generate_pdf(id):
    patient = Patient.query.get_or_404(id)
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    # Header
    p.setFont("Helvetica-Bold", 16)
    p.drawCentredString(width / 2, height - 50, "City General Hospital")
    p.setFont("Helvetica-Bold", 12)
    y = height - 100
    p.drawString(100, y, "Patient Report")
    p.line(100, y - 5, 500, y - 5)

    # Patient Details
    p.setFont("Helvetica", 10)
    details = [
        ("Name", patient.name),
        ("Age", str(patient.age)),
        ("DOB", str(patient.dob)),
        ("Admit Date", str(patient.admit_date)),
        ("Discharge Date", str(patient.discharge_date)),
    ]
    y -= 30
    for label, value in details:
        p.drawString(100, y, f"{label}: {value}")
        y -= 20

    # Treatments
    if hasattr(patient, 'treatments') and patient.treatments:
        p.setFont("Helvetica-Bold", 11)
        p.drawString(100, y, "Treatment History:")
        y -= 20
        p.setFont("Helvetica", 10)

        for t in patient.treatments:
            p.drawString(120, y, f"Date: {t.date}")
            y -= 15
            p.drawString(140, y, f"Symptom: {t.symptom}")
            y -= 15
            p.drawString(140, y, f"Condition: {t.condition}")
            y -= 15
            p.drawString(140, y, f"Prescription: {t.prescription}")
            y -= 25

    # Doctor's Signature
    p.setFont("Helvetica-Bold", 12)
    if patient.doctor_signature:
        try:
            # Extract base64 image data (remove prefix if exists)
            if "," in patient.doctor_signature:
                header, encoded = patient.doctor_signature.split(",", 1)
            else:
                encoded = patient.doctor_signature
            signature_bytes = base64.b64decode(encoded)
            signature_image = ImageReader(io.BytesIO(signature_bytes))

            # Label and image
            p.drawString(100, y, "Doctor's Signature:")
            y -= 50  # make space for image
            p.drawImage(signature_image, 100, y, width=150, height=40, mask='auto')
            y -= 60  # additional spacing after image
        except Exception as e:
            p.drawString(100, y, "Doctor's Signature: [Error displaying image]")
            y -= 20
    else:
        p.drawString(100, y, "Doctor's Signature: __________________")
        y -= 20

    # Finalize PDF
    p.showPage()
    p.save()
    buffer.seek(0)

    return send_file(
        buffer,
        as_attachment=True,
        download_name=f"{patient.name}_report.pdf",
        mimetype='application/pdf'
    )


# Register user
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

# Login user
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

# Check user exists
@app.route('/check-user', methods=['POST'])
def check_user():
    username = request.json.get('username')
    user = User.query.filter_by(username=username).first()
    return jsonify({'exists': bool(user)}), 200

# Get all patients
@app.route('/patients', methods=['GET'])
def get_patients():
    patients = Patient.query.all()
    return jsonify([{"id": p.id, "name": p.name} for p in patients])

# Get single patient details
@app.route('/patients/<int:id>', methods=['GET'])
def get_patient(id):
    patient = Patient.query.get_or_404(id)
    treatments = [{
        "symptom": t.symptom,
        "condition": t.condition,
        "date": t.date,
        "prescription": t.prescription
    } for t in patient.treatments]

    return jsonify({
        'id': patient.id,
        'name': patient.name,
        'age': patient.age,
        'dob': patient.dob,
        'admit_date': patient.admit_date,
        'discharge_date': patient.discharge_date,
        'treatments': treatments
    }), 200
    

@app.route('/discharge/<int:id>', methods=['POST'])
def discharge_patient(id):
    data = request.json
    discharge_date = data.get('discharge_date')
    doctor_signature = data.get('doctor_signature')

    patient = Patient.query.get_or_404(id)
    patient.discharge_date = discharge_date
    patient.doctor_signature = doctor_signature  # <--- Store it

    db.session.commit()
    return jsonify({"message": "Patient discharged successfully."}), 200

        
    
@app.route('/patients/all-details', methods=['GET'])
def get_all_patients_with_details():
    patients = Patient.query.all()
    result = []

    for p in patients:
        treatments = [{
            "symptom": t.symptom,
            "condition": t.condition,
            "date": t.date,
            "prescription": t.prescription
        } for t in p.treatments]

        result.append({
            "id": p.id,
            "name": p.name,
            "age": p.age,
            "dob": p.dob,
            "admit_date": p.admit_date,
            "discharge_date": p.discharge_date,
            "treatments": treatments
        })

    return jsonify(result), 200

@app.route('/patients/with-prescriptions', methods=['GET'])
def get_patients_with_prescriptions():
    # Join Patient and Treatment, filter where prescription is not null or empty
    results = db.session.query(Patient.id, Patient.name).join(Treatment).filter(Treatment.prescription != None, Treatment.prescription != '').distinct().all()

    patients = [{"id": p.id, "name": p.name,} for p in results]
    return jsonify(patients), 200

@app.route('/patients/add-treatment-no-prescription', methods=['POST'])
def add_treatment_without_prescription():
    data = request.get_json()
    patient_id = data.get('patient_id')
    symptom = data.get('symptom')
    condition = data.get('condition')
    date = data.get('date')

    if not all([patient_id, symptom, condition, date]):
        return jsonify({'error': 'Missing required fields'}), 400

    patient = Patient.query.get(patient_id)
    if not patient:
        return jsonify({'error': 'Patient not found'}), 404

    treatment = Treatment(
        patient_id=patient_id,
        symptom=symptom,
        condition=condition,
        date=date,
        prescription=""  # Explicitly setting prescription as None
    )

    db.session.add(treatment)
    db.session.commit()

    return jsonify({'message': 'Treatment without prescription added successfully'}), 201

@app.route('/view-treatments/<int:patient_id>', methods=['GET'])
def view_treatments_by_patient(patient_id):
    try:
        treatments = Treatment.query.filter_by(patient_id=patient_id).all()
        
        if not treatments:
            return jsonify({'message': 'No treatments found for this patient.'}), 404

        treatment_list = [{
            'id': treatment.id,
            'patient_id': treatment.patient_id,
            'symptom': treatment.symptom,
            'condition': treatment.condition,
            'date': treatment.date,
            'prescription': treatment.prescription
        } for treatment in treatments]

        return jsonify({'treatments': treatment_list}), 200

    except Exception as e:
        return jsonify({'error': 'Failed to fetch treatments', 'details': str(e)}), 500

@app.route('/add-prescription/<int:id>', methods=['PUT'])
def add_prescription(id):
    data = request.json
    prescription = data.get('prescription')
    treatment = Treatment.query.get(id)
    if not treatment:
        return jsonify({'error': 'Treatment not found'}), 404
    treatment.prescription = prescription
    db.session.commit()
    return jsonify({'message': 'Prescription added successfully'})


if __name__ == '__main__':
    app.run(debug=True)
