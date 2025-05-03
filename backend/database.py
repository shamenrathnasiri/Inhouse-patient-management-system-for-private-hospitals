from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Patient Model
class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    dob = db.Column(db.String(10), nullable=False)
    admit_date = db.Column(db.String(10), nullable=False)
    discharge_date = db.Column(db.String(10), default="N/A")
    
    treatments = db.relationship('Treatment', backref='patient', cascade="all, delete-orphan")


# Treatment Model
class Treatment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'), nullable=False)
    
    symptom = db.Column(db.String(200), nullable=False)
    condition = db.Column(db.String(200), nullable=False)
    date = db.Column(db.String(10), nullable=False)
    prescription = db.Column(db.String(200), nullable=False)


# User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(50), nullable=False)
