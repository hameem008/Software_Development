-- Refresh Token Table
CREATE TABLE refresh_token (
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    token VARCHAR(512) NOT NULL UNIQUE,
    expiry_date TIMESTAMP NOT NULL,
    PRIMARY KEY (email, role)
);

-- Patient Table
CREATE TABLE patient (
    patient_id SERIAL PRIMARY KEY,
    email TEXT UNIQUE,
    password_hash TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    gender VARCHAR(10),
    date_of_birth DATE,
    blood_group VARCHAR(5),
    phone_number VARCHAR(20) UNIQUE,
    address TEXT,
    profile_photo_url TEXT,
    CONSTRAINT chk_patient_email CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'),
    CONSTRAINT chk_patient_gender CHECK (gender IN ('Male', 'Female', 'Other')),
    CONSTRAINT chk_patient_dob CHECK (date_of_birth <= CURRENT_DATE),
    CONSTRAINT chk_patient_blood_group CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    CONSTRAINT chk_patient_phone_number CHECK (phone_number ~ '^[0-9]{10,15}$')
);

-- Chronic Condition Table
CREATE TABLE chronic_condition (
    patient_id INT REFERENCES patient(patient_id) ON DELETE CASCADE,
    condition TEXT,
    PRIMARY KEY (patient_id, condition)
);

-- Allergies Table
CREATE TABLE allergies (
    patient_id INT REFERENCES patient(patient_id) ON DELETE CASCADE,
    allergy TEXT,
    description TEXT,
    PRIMARY KEY (patient_id, allergy)
);

-- Symptom Table
CREATE TABLE symptom (
    patient_id INT REFERENCES patient(patient_id) ON DELETE CASCADE,
    description TEXT,
    date DATE DEFAULT CURRENT_DATE,
    time TIME DEFAULT CURRENT_TIME,
    PRIMARY KEY (patient_id, date, time)
);

-- Doctor Table
CREATE TABLE doctor (
    doctor_id SERIAL PRIMARY KEY,
    email TEXT UNIQUE,
    password_hash TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    gender VARCHAR(10),
    specialization TEXT,
    designation TEXT,
    academic_institution TEXT,
    phone_number VARCHAR(20) UNIQUE,
    address TEXT,
    bio TEXT,
    profile_photo_url TEXT,
    CONSTRAINT chk_doctor_gender CHECK (gender IN ('Male', 'Female', 'Other')),
    CONSTRAINT chk_doctor_phone_number CHECK (phone_number ~ '^[0-9]{10,15}$'),
    CONSTRAINT chk_doctor_email CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$')
);

-- Doctor Degree Table
CREATE TABLE doctor_degree (
    doctor_id INT REFERENCES doctor(doctor_id) ON DELETE CASCADE,
    degree_name TEXT,
    institution TEXT,
    passing_year INT,
    PRIMARY KEY (doctor_id, degree_name)
);

-- Hospital Table
CREATE TABLE hospital (
    hospital_id SERIAL PRIMARY KEY,
    email TEXT UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    phone_number VARCHAR(20) UNIQUE,
    address TEXT,
    profile_photo_url TEXT
);

-- Prescription Table
CREATE TABLE prescription (
    prescription_id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES patient(patient_id) ON DELETE CASCADE,
    doctor_id INT REFERENCES doctor(doctor_id) ON DELETE CASCADE,
    hospital_id INT REFERENCES hospital(hospital_id),
    summary TEXT,
    prescribed_date DATE DEFAULT CURRENT_DATE,
    symptoms TEXT,
    weight NUMERIC CHECK (weight > 0),
    blood_pressure VARCHAR(20),
    heart_rate INT CHECK (heart_rate > 0 AND heart_rate < 250),
    notes TEXT,
    next_appointment_date DATE,
    CONSTRAINT chk_prescription_dates CHECK (
        prescribed_date <= CURRENT_DATE AND 
        (next_appointment_date IS NULL OR next_appointment_date >= prescribed_date)
    )
);

-- Diseases Table
CREATE TABLE diseases (
    disease_id SERIAL PRIMARY KEY,
    disease_name TEXT,
    description TEXT
);

-- Diagnosed Diseases Table
CREATE TABLE diagnosed_diseases (
    prescription_id INT REFERENCES prescription(prescription_id) ON DELETE CASCADE,
    disease_id INT REFERENCES diseases(disease_id),
    PRIMARY KEY (prescription_id, disease_id)
);

-- Medicines Table
CREATE TABLE medicines (
    medicine_id SERIAL PRIMARY KEY,
    medicine_name TEXT,
    description TEXT
);

-- Prescribed Medicine Table
CREATE TABLE prescribed_medicine (
    prescription_id INT REFERENCES prescription(prescription_id) ON DELETE CASCADE,
    medicine_id INT REFERENCES medicines(medicine_id),
    dosage TEXT,
    frequency TEXT,
    duration TEXT,
    instruction TEXT,
    PRIMARY KEY (prescription_id, medicine_id)
);

-- Tests Table
CREATE TABLE tests (
    test_id SERIAL PRIMARY KEY,
    test_name TEXT,
    description TEXT,
    type VARCHAR(20),
    CONSTRAINT chk_test_type CHECK (type IN ('Pathology', 'Imaging'))
);

-- Test Params Table
CREATE TABLE test_params (
    test_id INT REFERENCES tests(test_id),
    parameter_name TEXT,
    unit TEXT,
    ideal_male_range TEXT,
    ideal_female_range TEXT,
    ideal_children_range TEXT,
    PRIMARY KEY (test_id, parameter_name)
);

-- Prescribed Tests Table
CREATE TABLE prescribed_tests (
    prescription_id INT REFERENCES prescription(prescription_id) ON DELETE CASCADE,
    test_id INT REFERENCES tests(test_id),
    PRIMARY KEY (prescription_id, test_id)
);

-- Performed Tests Table
CREATE TABLE performed_tests (
    performed_test_id SERIAL PRIMARY KEY,
    test_id INT REFERENCES tests(test_id),
    prescription_id INT REFERENCES prescription(prescription_id) ON DELETE CASCADE,
    test_date DATE DEFAULT CURRENT_DATE,
    note TEXT,
    suggested_by_doctor_id INT REFERENCES doctor(doctor_id) ON DELETE SET NULL,
    performed_by_doctor_id INT REFERENCES doctor(doctor_id) ON DELETE SET NULL,
    reviewed_by_doctor_id INT REFERENCES doctor(doctor_id) ON DELETE SET NULL,
    hospital_id INT REFERENCES hospital(hospital_id),
    pdf_url TEXT
);

-- Test Result Value Table
CREATE TABLE test_result_value (
    performed_test_id INT REFERENCES performed_tests(performed_test_id) ON DELETE CASCADE,
    parameter_name TEXT,
    result_value TEXT,
    PRIMARY KEY (performed_test_id, parameter_name)
);

-- Doctor Availability Table
CREATE TABLE doctor_availability (
    slot_id SERIAL PRIMARY KEY,
    doctor_id INT REFERENCES doctor(doctor_id) ON DELETE CASCADE,
    hospital_id INT REFERENCES hospital(hospital_id),
    start_time TIME,
    end_time TIME,
    week_day VARCHAR(10),
    duration INT CHECK (duration > 0),
    fee INT CHECK (fee >= 0),
    visit_capacity INT CHECK (visit_capacity > 0),
    chamber TEXT,
    CONSTRAINT chk_availability_week_day CHECK (week_day IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'))
);

-- Appointment Table
CREATE TABLE appointment (
    appointment_id SERIAL PRIMARY KEY,
    doctor_id INT REFERENCES doctor(doctor_id) ON DELETE CASCADE,
    patient_id INT REFERENCES patient(patient_id) ON DELETE CASCADE,
    date DATE CHECK (date >= CURRENT_DATE),
    time TIME,
    slot_id INT REFERENCES doctor_availability(slot_id),
    serial_number INT,
    CONSTRAINT unq_appointment_slot_serial UNIQUE (slot_id, serial_number)
);

-- Doctor Review Table
CREATE TABLE doctor_review (
    review_id SERIAL PRIMARY KEY,
    doctor_id INT REFERENCES doctor(doctor_id) ON DELETE CASCADE,
    patient_id INT REFERENCES patient(patient_id) ON DELETE CASCADE,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    description TEXT,
    date DATE DEFAULT CURRENT_DATE
);
