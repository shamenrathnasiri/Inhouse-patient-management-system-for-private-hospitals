
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Patient Model
class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    dob = db.Column(db.String(10), nullable=False)
    admit_date = db.Column(db.String(10), nullable=False)
    diseases = db.Column(db.String(200), default="N/A")
    treatment = db.Column(db.String(200), default="N/A")
    discharge_date = db.Column(db.String(10), default="N/A")

    symptoms = db.relationship('Symptom', backref='patient', cascade="all, delete-orphan")
    conditions = db.relationship('Condition', backref='patient', cascade="all, delete-orphan")

# Symptom Model
class Symptom(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    date = db.Column(db.String(10), nullable=False)

# Condition Model
class Condition(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    date = db.Column(db.String(10), nullable=False)

# User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(50), nullable=False)
