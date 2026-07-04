from flask import Flask, request, jsonify, send_file, session
from flask_cors import CORS
from datetime import datetime, date
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
import io
import base64
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import and_, or_
from database import db, Patient, User, Treatment, ChatMessage
import google.generativeai as genai

# Configure Google Gemini AI
# Replace with your actual API key from https://aistudio.google.com/apikey
GEMINI_API_KEY = 'AQ.Ab8RN6LnNtLprR9N5hm5LS7PnpXFqJkNzJPaKOYv3RbNquEHzA'
genai.configure(api_key=GEMINI_API_KEY)


# Auto-create the database if it doesn't exist
def ensure_database_exists():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password=''
        )
        cursor = connection.cursor()
        cursor.execute("CREATE DATABASE IF NOT EXISTS hospital_db")
        print("Database 'hospital_db' is ready.")
        cursor.close()
        connection.close()
    except Exception as e:
        print(f"Error creating database: {e}")

ensure_database_exists()

app = Flask(__name__)
CORS(app, supports_credentials=True)

app.config['SECRET_KEY'] = 'hospital'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root@localhost/hospital_db'
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
    if not data or not all(k in data for k in ('sender', 'receiver', 'message')):
        return jsonify({"error": "Missing required fields: sender, receiver, message"}), 400
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
    user1 = request.args.get('user1')
    user2 = request.args.get('user2')

    if not user1 or not user2:
        return jsonify({"error": "Both user1 and user2 parameters are required"}), 400

    messages = ChatMessage.query.filter(
        or_(
            and_(ChatMessage.sender == user1, ChatMessage.receiver == user2),
            and_(ChatMessage.sender == user2, ChatMessage.receiver == user1)
        )
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


# Get unread message count for a user
@app.route('/chat/unread-count', methods=['GET'])
def unread_count():
    user = request.args.get('user')
    if not user:
        return jsonify({"error": "User parameter required"}), 400
    count = ChatMessage.query.filter_by(receiver=user, is_read=False).count()
    return jsonify({"unread_count": count})

# Mark all messages as read for a user
@app.route('/chat/mark-read', methods=['POST'])
def mark_read():
    data = request.json
    user = data.get('user')
    if not user:
        return jsonify({"error": "User parameter required"}), 400
    ChatMessage.query.filter_by(receiver=user, is_read=False).update({"is_read": True})
    db.session.commit()
    return jsonify({"status": "Messages marked as read"}), 200

# Register patient
@app.route('/register', methods=['POST'])
def register_patient():
    data = request.json
    if not data or not all(k in data for k in ('name', 'age', 'dob', 'admit_date')):
        return jsonify({"error": "Missing required fields: name, age, dob, admit_date"}), 400
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

    # AI-Generated Medical Report
    if patient.ai_report:
        if y < 150:
            p.showPage()
            y = height - 50
        p.setFont("Helvetica-Bold", 11)
        p.drawString(100, y, "AI-Generated Medical Summary:")
        p.line(100, y - 5, 500, y - 5)
        y -= 25
        p.setFont("Helvetica", 9)
        
        # Word-wrap the AI report text
        for line in patient.ai_report.split('\n'):
            # Wrap long lines
            words = line.split()
            current_line = ""
            for word in words:
                test_line = current_line + " " + word if current_line else word
                if p.stringWidth(test_line, "Helvetica", 9) < 400:
                    current_line = test_line
                else:
                    if y < 60:
                        p.showPage()
                        y = height - 50
                        p.setFont("Helvetica", 9)
                    p.drawString(100, y, current_line)
                    y -= 13
                    current_line = word
            if current_line:
                if y < 60:
                    p.showPage()
                    y = height - 50
                    p.setFont("Helvetica", 9)
                p.drawString(100, y, current_line)
                y -= 13
            if not words:  # empty line
                y -= 8
        y -= 10

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


@app.route('/generate-treatment-pdf/<int:patient_id>', methods=['GET'])
def generate_treatment_pdf(patient_id):
    patient = Patient.query.get_or_404(patient_id)
    treatments = Treatment.query.filter_by(patient_id=patient_id).order_by(Treatment.date).all()

    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    # Header
    p.setFont("Helvetica-Bold", 16)
    p.drawCentredString(width / 2, height - 50, "City General Hospital")
    p.setFont("Helvetica-Bold", 12)
    y = height - 90
    p.drawString(50, y, "Patient Treatment History")
    p.setFont("Helvetica", 10)
    y -= 20

    # Patient basic info
    p.drawString(50, y, f"Name: {patient.name}")
    p.drawString(300, y, f"Age: {patient.age}")
    y -= 15
    p.drawString(50, y, f"DOB: {patient.dob}")
    p.drawString(300, y, f"Admit Date: {patient.admit_date}")
    y -= 25

    # Created date
    created_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    p.drawString(50, y, f"Created date: {created_at}")
    y -= 20

    # Treatments table header
    p.setFont("Helvetica-Bold", 11)
    p.drawString(50, y, "Date")
    p.drawString(120, y, "Symptom")
    p.drawString(300, y, "Condition")
    p.drawString(450, y, "Prescription")
    y -= 12
    p.line(50, y, width - 50, y)
    y -= 10
    p.setFont("Helvetica", 10)

    if treatments:
        for t in treatments:
            if y < 120:
                p.showPage()
                y = height - 80
            p.drawString(50, y, str(t.date))
            p.drawString(120, y, (t.symptom or '')[:30])
            p.drawString(300, y, (t.condition or '')[:30])
            p.drawString(450, y, (t.prescription or 'N/A')[:30])
            y -= 18
    else:
        p.drawString(50, y, "No treatments found for this patient.")
        y -= 20

    # Add space then signature areas
    if y < 220:
        p.showPage()
        y = height - 80

    y -= 20
    p.line(80, y, 260, y)
    p.drawString(80, y - 12, "Nurse Signature")

    p.line(320, y, 500, y)
    p.drawString(320, y - 12, "Doctor Signature")

    # Finalize
    p.showPage()
    p.save()
    buffer.seek(0)

    return send_file(
        buffer,
        as_attachment=True,
        download_name=f"{patient.name}_treatments_{datetime.now().date()}.pdf",
        mimetype='application/pdf'
    )


# Register user
@app.route('/register-user', methods=['POST'])
def register_user():
    data = request.json
    if not data:
        return jsonify({"error": "Request body is required"}), 400
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')

    if not all([username, password, role]):
        return jsonify({"error": "Missing required fields: username, password, role"}), 400

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
    if not data:
        return jsonify({"message": "Request body is required"}), 400
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400

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
    ai_report = data.get('ai_report')  # AI-generated medical report

    patient = Patient.query.get_or_404(id)
    patient.discharge_date = discharge_date
    patient.doctor_signature = doctor_signature  # <--- Store it
    if ai_report:
        patient.ai_report = ai_report  # Save AI report

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
    if not data:
        return jsonify({'error': 'Request body is required'}), 400
    patient_id = data.get('patient_id')
    symptom = data.get('symptom')
    condition = data.get('condition')
    treatment_date = data.get('date')

    if not all([patient_id, symptom, condition, treatment_date]):
        return jsonify({'error': 'Missing required fields'}), 400

    patient = Patient.query.get(patient_id)
    if not patient:
        return jsonify({'error': 'Patient not found'}), 404

    treatment = Treatment(
        patient_id=patient_id,
        symptom=symptom,
        condition=condition,
        date=treatment_date,
        prescription=""  # No prescription for this treatment
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


# ===================== AI REPORT GENERATION =====================
@app.route('/ai/generate-report/<int:patient_id>', methods=['POST'])
def generate_ai_report(patient_id):
    """Generate an AI medical report using Google Gemini based on patient data."""
    try:
        patient = Patient.query.get_or_404(patient_id)
        treatments = Treatment.query.filter_by(patient_id=patient_id).order_by(Treatment.date).all()

        # Build treatment history text
        treatment_lines = []
        for t in treatments:
            treatment_lines.append(
                f"  - Date: {t.date}, Symptom: {t.symptom}, "
                f"Condition: {t.condition}, Prescription: {t.prescription or 'N/A'}"
            )
        treatment_text = '\n'.join(treatment_lines) if treatment_lines else 'No treatments recorded.'

        # Construct the AI prompt
        prompt = f"""You are a medical report assistant for City General Hospital. 
Based on the following patient data, generate a professional medical summary report.
The report should be clear, concise, and suitable for a medical discharge document.

=== PATIENT INFORMATION ===
Name: {patient.name}
Age: {patient.age}
Date of Birth: {patient.dob}
Admission Date: {patient.admit_date}
Discharge Date: {patient.discharge_date if patient.discharge_date and patient.discharge_date != 'N/A' else 'Pending'}

=== TREATMENT HISTORY ===
{treatment_text}

=== INSTRUCTIONS ===
Generate a structured medical report with the following sections:
1. **Patient Summary** - Brief overview of the patient
2. **Clinical History** - Summary of symptoms and conditions observed
3. **Diagnosis** - Primary and secondary diagnoses based on conditions
4. **Treatment Administered** - Summary of treatments and prescriptions given
5. **Discharge Recommendations** - Follow-up care, medications to continue, and lifestyle advice

Keep the language professional and medical. Do not include any disclaimers about AI. 
Write as if this is an official hospital report.
Do not use markdown formatting - use plain text only."""

        # Call Google Gemini API
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)

        ai_report = response.text

        return jsonify({
            'success': True,
            'report': ai_report,
            'patient_name': patient.name
        }), 200

    except Exception as e:
        print(f"AI Report Generation Error: {e}")
        return jsonify({
            'success': False,
            'error': f'Failed to generate AI report: {str(e)}'
        }), 500


if __name__ == '__main__':
    app.run(debug=True)
