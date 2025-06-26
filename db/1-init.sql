--
-- PostgreSQL database dump
--

-- Dumped from database version 15.13 (Debian 15.13-1.pgdg120+1)
-- Dumped by pg_dump version 15.13 (Debian 15.13-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: appointment; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public.appointment (
    appointment_id integer NOT NULL,
    doctor_id integer,
    patient_id integer,
    date date,
    "time" time without time zone,
    slot_id integer,
    serial_number integer,
    CONSTRAINT appointment_date_check CHECK ((date >= CURRENT_DATE))
);


ALTER TABLE public.appointment OWNER TO myuser;

--
-- Name: appointment_appointment_id_seq; Type: SEQUENCE; Schema: public; Owner: myuser
--

CREATE SEQUENCE public.appointment_appointment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.appointment_appointment_id_seq OWNER TO myuser;

--
-- Name: appointment_appointment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: myuser
--

ALTER SEQUENCE public.appointment_appointment_id_seq OWNED BY public.appointment.appointment_id;


--
-- Name: diagnosed_diseases; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public.diagnosed_diseases (
    prescription_id integer NOT NULL,
    disease_id integer NOT NULL
);


ALTER TABLE public.diagnosed_diseases OWNER TO myuser;

--
-- Name: diseases; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public.diseases (
    disease_id integer NOT NULL,
    disease_name text,
    description text
);


ALTER TABLE public.diseases OWNER TO myuser;

--
-- Name: diseases_disease_id_seq; Type: SEQUENCE; Schema: public; Owner: myuser
--

CREATE SEQUENCE public.diseases_disease_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.diseases_disease_id_seq OWNER TO myuser;

--
-- Name: diseases_disease_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: myuser
--

ALTER SEQUENCE public.diseases_disease_id_seq OWNED BY public.diseases.disease_id;


--
-- Name: doctor; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public.doctor (
    doctor_id integer NOT NULL,
    email character varying(255),
    password_hash character varying(255) NOT NULL,
    first_name character varying(255) NOT NULL,
    last_name character varying(255) NOT NULL,
    gender character varying(255),
    specialization character varying(255),
    designation character varying(255),
    academic_institution character varying(255),
    phone_number character varying(255),
    bio character varying(255),
    profile_photo_url character varying(255),
    address character varying(255),
    CONSTRAINT chk_doctor_email CHECK (((email)::text ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'::text)),
    CONSTRAINT chk_doctor_gender CHECK (((gender)::text = ANY (ARRAY[('Male'::character varying)::text, ('Female'::character varying)::text, ('Other'::character varying)::text]))),
    CONSTRAINT chk_doctor_phone_number CHECK (((phone_number)::text ~ '^[0-9]{10,15}$'::text))
);


ALTER TABLE public.doctor OWNER TO myuser;

--
-- Name: doctor_availability; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public.doctor_availability (
    slot_id integer NOT NULL,
    doctor_id integer,
    medical_center_id integer,
    start_time time without time zone,
    end_time time without time zone,
    week_day character varying(20),
    duration integer,
    fee integer,
    visit_capacity integer,
    chamber character varying(255),
    CONSTRAINT chk_availability_week_day CHECK (((week_day)::text = ANY (ARRAY[('Monday'::character varying)::text, ('Tuesday'::character varying)::text, ('Wednesday'::character varying)::text, ('Thursday'::character varying)::text, ('Friday'::character varying)::text, ('Saturday'::character varying)::text, ('Sunday'::character varying)::text]))),
    CONSTRAINT doctor_availability_duration_check CHECK ((duration > 0)),
    CONSTRAINT doctor_availability_fee_check CHECK ((fee >= 0)),
    CONSTRAINT doctor_availability_visit_capacity_check CHECK ((visit_capacity > 0))
);


ALTER TABLE public.doctor_availability OWNER TO myuser;

--
-- Name: doctor_availability_slot_id_seq; Type: SEQUENCE; Schema: public; Owner: myuser
--

CREATE SEQUENCE public.doctor_availability_slot_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.doctor_availability_slot_id_seq OWNER TO myuser;

--
-- Name: doctor_availability_slot_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: myuser
--

ALTER SEQUENCE public.doctor_availability_slot_id_seq OWNED BY public.doctor_availability.slot_id;


--
-- Name: doctor_degree; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public.doctor_degree (
    doctor_id integer NOT NULL,
    degree_name character varying(100) NOT NULL,
    institution character varying(255),
    passing_year integer
);


ALTER TABLE public.doctor_degree OWNER TO myuser;

--
-- Name: doctor_doctor_id_seq; Type: SEQUENCE; Schema: public; Owner: myuser
--

CREATE SEQUENCE public.doctor_doctor_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.doctor_doctor_id_seq OWNER TO myuser;

--
-- Name: doctor_doctor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: myuser
--

ALTER SEQUENCE public.doctor_doctor_id_seq OWNED BY public.doctor.doctor_id;


--
-- Name: doctor_review; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public.doctor_review (
    review_id integer NOT NULL,
    doctor_id integer,
    patient_id integer,
    rating integer,
    description text,
    date date DEFAULT CURRENT_DATE,
    CONSTRAINT doctor_review_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.doctor_review OWNER TO myuser;

--
-- Name: doctor_review_review_id_seq; Type: SEQUENCE; Schema: public; Owner: myuser
--

CREATE SEQUENCE public.doctor_review_review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.doctor_review_review_id_seq OWNER TO myuser;

--
-- Name: doctor_review_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: myuser
--

ALTER SEQUENCE public.doctor_review_review_id_seq OWNED BY public.doctor_review.review_id;


--
-- Name: hospital_test_availability; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public.hospital_test_availability (
    medical_center_id integer NOT NULL,
    test_id integer NOT NULL,
    cost numeric,
    estimated_report_time interval,
    CONSTRAINT hospital_test_availability_cost_check CHECK ((cost >= (0)::numeric))
);


ALTER TABLE public.hospital_test_availability OWNER TO myuser;

--
-- Name: medical_center; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public.medical_center (
    medical_center_id integer NOT NULL,
    email character varying(255),
    password_hash character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    phone_number character varying(255),
    address character varying(255),
    profile_photo_url character varying(255)
);


ALTER TABLE public.medical_center OWNER TO myuser;

--
-- Name: medical_center_medical_center_id_seq; Type: SEQUENCE; Schema: public; Owner: myuser
--

CREATE SEQUENCE public.medical_center_medical_center_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.medical_center_medical_center_id_seq OWNER TO myuser;

--
-- Name: medical_center_medical_center_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: myuser
--

ALTER SEQUENCE public.medical_center_medical_center_id_seq OWNED BY public.medical_center.medical_center_id;


--
-- Name: medicines; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public.medicines (
    medicine_id integer NOT NULL,
    medicine_name text,
    description text
);


ALTER TABLE public.medicines OWNER TO myuser;

--
-- Name: medicines_medicine_id_seq; Type: SEQUENCE; Schema: public; Owner: myuser
--

CREATE SEQUENCE public.medicines_medicine_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.medicines_medicine_id_seq OWNER TO myuser;

--
-- Name: medicines_medicine_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: myuser
--

ALTER SEQUENCE public.medicines_medicine_id_seq OWNED BY public.medicines.medicine_id;


--
-- Name: mood_options; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public.mood_options (
    mood_value character varying(20) NOT NULL,
    display_order integer
);


ALTER TABLE public.mood_options OWNER TO myuser;

--
-- Name: notification; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public.notification (
    notification_id integer NOT NULL,
    recipient_id integer NOT NULL,
    recipient_type character varying(20),
    message text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_read boolean DEFAULT false,
    CONSTRAINT notification_recipient_type_check CHECK (((recipient_type)::text = ANY (ARRAY[('Patient'::character varying)::text, ('Doctor'::character varying)::text, ('Hospital'::character varying)::text])))
);


ALTER TABLE public.notification OWNER TO myuser;

--
-- Name: notification_notification_id_seq; Type: SEQUENCE; Schema: public; Owner: myuser
--

CREATE SEQUENCE public.notification_notification_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notification_notification_id_seq OWNER TO myuser;

--
-- Name: notification_notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: myuser
--

ALTER SEQUENCE public.notification_notification_id_seq OWNED BY public.notification.notification_id;


--
-- Name: patient; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public.patient (
    patient_id integer NOT NULL,
    email character varying(255),
    password_hash character varying(255) NOT NULL,
    first_name character varying(255) NOT NULL,
    last_name character varying(255) NOT NULL,
    gender character varying(255),
    date_of_birth date,
    blood_group character varying(255),
    phone_number character varying(255),
    address character varying(255),
    profile_photo_url character varying(255),
    CONSTRAINT chk_patient_blood_group CHECK (((blood_group)::text = ANY (ARRAY[('A+'::character varying)::text, ('A-'::character varying)::text, ('B+'::character varying)::text, ('B-'::character varying)::text, ('AB+'::character varying)::text, ('AB-'::character varying)::text, ('O+'::character varying)::text, ('O-'::character varying)::text]))),
    CONSTRAINT chk_patient_dob CHECK ((date_of_birth <= CURRENT_DATE)),
    CONSTRAINT chk_patient_email CHECK (((email)::text ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'::text)),
    CONSTRAINT chk_patient_gender CHECK (((gender)::text = ANY (ARRAY[('Male'::character varying)::text, ('Female'::character varying)::text, ('Other'::character varying)::text]))),
    CONSTRAINT chk_patient_phone_number CHECK (((phone_number)::text ~ '^[0-9]{10,15}$'::text))
);


ALTER TABLE public.patient OWNER TO myuser;

--
-- Name: patient_patient_id_seq; Type: SEQUENCE; Schema: public; Owner: myuser
--

CREATE SEQUENCE public.patient_patient_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.patient_patient_id_seq OWNER TO myuser;

--
-- Name: patient_patient_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: myuser
--

ALTER SEQUENCE public.patient_patient_id_seq OWNED BY public.patient.patient_id;


--
-- Name: performed_tests; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public.performed_tests (
    performed_test_id integer NOT NULL,
    test_id integer,
    prescription_id integer,
    test_date date DEFAULT CURRENT_DATE,
    note text,
    performed_by_doctor_id integer,
    reviewed_by_doctor_id integer,
    medical_center_id integer,
    pdf_url text
);


ALTER TABLE public.performed_tests OWNER TO myuser;

--
-- Name: performed_tests_performed_test_id_seq; Type: SEQUENCE; Schema: public; Owner: myuser
--

CREATE SEQUENCE public.performed_tests_performed_test_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.performed_tests_performed_test_id_seq OWNER TO myuser;

--
-- Name: performed_tests_performed_test_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: myuser
--

ALTER SEQUENCE public.performed_tests_performed_test_id_seq OWNED BY public.performed_tests.performed_test_id;


--
-- Name: prescribed_medicine; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public.prescribed_medicine (
    prescription_id integer NOT NULL,
    medicine_id integer NOT NULL,
    dosage text,
    frequency text,
    duration text,
    instruction text
);


ALTER TABLE public.prescribed_medicine OWNER TO myuser;

--
-- Name: prescribed_tests; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public.prescribed_tests (
    prescription_id integer NOT NULL,
    test_id integer NOT NULL
);


ALTER TABLE public.prescribed_tests OWNER TO myuser;

--
-- Name: prescription; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public.prescription (
    prescription_id integer NOT NULL,
    patient_id integer,
    doctor_id integer,
    medical_center_id integer,
    summary text,
    prescribed_date date DEFAULT CURRENT_DATE,
    symptoms text,
    weight numeric,
    blood_pressure character varying(20),
    heart_rate integer,
    notes text,
    next_appointment_date date,
    CONSTRAINT chk_prescription_dates CHECK (((prescribed_date <= CURRENT_DATE) AND ((next_appointment_date IS NULL) OR (next_appointment_date >= prescribed_date)))),
    CONSTRAINT prescription_heart_rate_check CHECK (((heart_rate > 0) AND (heart_rate < 250))),
    CONSTRAINT prescription_weight_check CHECK ((weight > (0)::numeric))
);


ALTER TABLE public.prescription OWNER TO myuser;

--
-- Name: prescription_prescription_id_seq; Type: SEQUENCE; Schema: public; Owner: myuser
--

CREATE SEQUENCE public.prescription_prescription_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.prescription_prescription_id_seq OWNER TO myuser;

--
-- Name: prescription_prescription_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: myuser
--

ALTER SEQUENCE public.prescription_prescription_id_seq OWNED BY public.prescription.prescription_id;


--
-- Name: refresh_token; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public.refresh_token (
    email character varying(255) NOT NULL,
    role character varying(50) NOT NULL,
    token character varying(512) NOT NULL,
    expiry_date timestamp without time zone NOT NULL
);


ALTER TABLE public.refresh_token OWNER TO myuser;

--
-- Name: severity_levels; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public.severity_levels (
    severity_level integer NOT NULL,
    description text
);


ALTER TABLE public.severity_levels OWNER TO myuser;

--
-- Name: symptom; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public.symptom (
    patient_id integer NOT NULL,
    description text,
    date date DEFAULT CURRENT_DATE NOT NULL,
    "time" time without time zone DEFAULT CURRENT_TIME NOT NULL,
    overall_mood character varying(20),
    severity_level integer
);


ALTER TABLE public.symptom OWNER TO myuser;

--
-- Name: test_params; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public.test_params (
    test_id integer NOT NULL,
    parameter_name text NOT NULL,
    unit text,
    ideal_male_range text,
    ideal_female_range text,
    ideal_children_range text
);


ALTER TABLE public.test_params OWNER TO myuser;

--
-- Name: test_request; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public.test_request (
    request_id integer NOT NULL,
    patient_id integer,
    test_id integer,
    medical_center_id integer,
    requested_date date DEFAULT CURRENT_DATE,
    status character varying(10),
    prescription_id integer,
    notes text,
    CONSTRAINT test_request_status_check CHECK (((status)::text = ANY (ARRAY[('Pending'::character varying)::text, ('Accepted'::character varying)::text, ('Rejected'::character varying)::text, ('Sample Collected'::character varying)::text])))
);


ALTER TABLE public.test_request OWNER TO myuser;

--
-- Name: test_request_request_id_seq; Type: SEQUENCE; Schema: public; Owner: myuser
--

CREATE SEQUENCE public.test_request_request_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.test_request_request_id_seq OWNER TO myuser;

--
-- Name: test_request_request_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: myuser
--

ALTER SEQUENCE public.test_request_request_id_seq OWNED BY public.test_request.request_id;


--
-- Name: test_result_value; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public.test_result_value (
    performed_test_id integer NOT NULL,
    parameter_name text NOT NULL,
    result_value text
);


ALTER TABLE public.test_result_value OWNER TO myuser;

--
-- Name: tests; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public.tests (
    test_id integer NOT NULL,
    test_name text,
    description text,
    type character varying(20),
    CONSTRAINT chk_test_type CHECK (((type)::text = ANY (ARRAY[('Pathology'::character varying)::text, ('Imaging'::character varying)::text])))
);


ALTER TABLE public.tests OWNER TO myuser;

--
-- Name: tests_test_id_seq; Type: SEQUENCE; Schema: public; Owner: myuser
--

CREATE SEQUENCE public.tests_test_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tests_test_id_seq OWNER TO myuser;

--
-- Name: tests_test_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: myuser
--

ALTER SEQUENCE public.tests_test_id_seq OWNED BY public.tests.test_id;


--
-- Name: appointment appointment_id; Type: DEFAULT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.appointment ALTER COLUMN appointment_id SET DEFAULT nextval('public.appointment_appointment_id_seq'::regclass);


--
-- Name: diseases disease_id; Type: DEFAULT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.diseases ALTER COLUMN disease_id SET DEFAULT nextval('public.diseases_disease_id_seq'::regclass);


--
-- Name: doctor doctor_id; Type: DEFAULT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.doctor ALTER COLUMN doctor_id SET DEFAULT nextval('public.doctor_doctor_id_seq'::regclass);


--
-- Name: doctor_availability slot_id; Type: DEFAULT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.doctor_availability ALTER COLUMN slot_id SET DEFAULT nextval('public.doctor_availability_slot_id_seq'::regclass);


--
-- Name: doctor_review review_id; Type: DEFAULT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.doctor_review ALTER COLUMN review_id SET DEFAULT nextval('public.doctor_review_review_id_seq'::regclass);


--
-- Name: medical_center medical_center_id; Type: DEFAULT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.medical_center ALTER COLUMN medical_center_id SET DEFAULT nextval('public.medical_center_medical_center_id_seq'::regclass);


--
-- Name: medicines medicine_id; Type: DEFAULT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.medicines ALTER COLUMN medicine_id SET DEFAULT nextval('public.medicines_medicine_id_seq'::regclass);


--
-- Name: notification notification_id; Type: DEFAULT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.notification ALTER COLUMN notification_id SET DEFAULT nextval('public.notification_notification_id_seq'::regclass);


--
-- Name: patient patient_id; Type: DEFAULT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.patient ALTER COLUMN patient_id SET DEFAULT nextval('public.patient_patient_id_seq'::regclass);


--
-- Name: performed_tests performed_test_id; Type: DEFAULT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.performed_tests ALTER COLUMN performed_test_id SET DEFAULT nextval('public.performed_tests_performed_test_id_seq'::regclass);


--
-- Name: prescription prescription_id; Type: DEFAULT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.prescription ALTER COLUMN prescription_id SET DEFAULT nextval('public.prescription_prescription_id_seq'::regclass);


--
-- Name: test_request request_id; Type: DEFAULT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.test_request ALTER COLUMN request_id SET DEFAULT nextval('public.test_request_request_id_seq'::regclass);


--
-- Name: tests test_id; Type: DEFAULT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.tests ALTER COLUMN test_id SET DEFAULT nextval('public.tests_test_id_seq'::regclass);


--
-- Name: appointment appointment_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.appointment
    ADD CONSTRAINT appointment_pkey PRIMARY KEY (appointment_id);


--
-- Name: diagnosed_diseases diagnosed_diseases_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.diagnosed_diseases
    ADD CONSTRAINT diagnosed_diseases_pkey PRIMARY KEY (prescription_id, disease_id);


--
-- Name: diseases diseases_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.diseases
    ADD CONSTRAINT diseases_pkey PRIMARY KEY (disease_id);


--
-- Name: doctor_availability doctor_availability_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.doctor_availability
    ADD CONSTRAINT doctor_availability_pkey PRIMARY KEY (slot_id);


--
-- Name: doctor_degree doctor_degree_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.doctor_degree
    ADD CONSTRAINT doctor_degree_pkey PRIMARY KEY (doctor_id, degree_name);


--
-- Name: doctor doctor_email_key; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.doctor
    ADD CONSTRAINT doctor_email_key UNIQUE (email);


--
-- Name: doctor doctor_phone_number_key; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.doctor
    ADD CONSTRAINT doctor_phone_number_key UNIQUE (phone_number);


--
-- Name: doctor doctor_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.doctor
    ADD CONSTRAINT doctor_pkey PRIMARY KEY (doctor_id);


--
-- Name: doctor_review doctor_review_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.doctor_review
    ADD CONSTRAINT doctor_review_pkey PRIMARY KEY (review_id);


--
-- Name: hospital_test_availability hospital_test_availability_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.hospital_test_availability
    ADD CONSTRAINT hospital_test_availability_pkey PRIMARY KEY (medical_center_id, test_id);


--
-- Name: medical_center medical_center_email_key; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.medical_center
    ADD CONSTRAINT medical_center_email_key UNIQUE (email);


--
-- Name: medical_center medical_center_phone_number_key; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.medical_center
    ADD CONSTRAINT medical_center_phone_number_key UNIQUE (phone_number);


--
-- Name: medical_center medical_center_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.medical_center
    ADD CONSTRAINT medical_center_pkey PRIMARY KEY (medical_center_id);


--
-- Name: medicines medicines_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_pkey PRIMARY KEY (medicine_id);


--
-- Name: mood_options mood_options_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.mood_options
    ADD CONSTRAINT mood_options_pkey PRIMARY KEY (mood_value);


--
-- Name: notification notification_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_pkey PRIMARY KEY (notification_id);


--
-- Name: patient patient_email_key; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.patient
    ADD CONSTRAINT patient_email_key UNIQUE (email);


--
-- Name: patient patient_phone_number_key; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.patient
    ADD CONSTRAINT patient_phone_number_key UNIQUE (phone_number);


--
-- Name: patient patient_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.patient
    ADD CONSTRAINT patient_pkey PRIMARY KEY (patient_id);


--
-- Name: performed_tests performed_tests_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.performed_tests
    ADD CONSTRAINT performed_tests_pkey PRIMARY KEY (performed_test_id);


--
-- Name: prescribed_medicine prescribed_medicine_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.prescribed_medicine
    ADD CONSTRAINT prescribed_medicine_pkey PRIMARY KEY (prescription_id, medicine_id);


--
-- Name: prescribed_tests prescribed_tests_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.prescribed_tests
    ADD CONSTRAINT prescribed_tests_pkey PRIMARY KEY (prescription_id, test_id);


--
-- Name: prescription prescription_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.prescription
    ADD CONSTRAINT prescription_pkey PRIMARY KEY (prescription_id);


--
-- Name: refresh_token refresh_token_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.refresh_token
    ADD CONSTRAINT refresh_token_pkey PRIMARY KEY (email, role);


--
-- Name: refresh_token refresh_token_token_key; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.refresh_token
    ADD CONSTRAINT refresh_token_token_key UNIQUE (token);


--
-- Name: severity_levels severity_levels_description_key; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.severity_levels
    ADD CONSTRAINT severity_levels_description_key UNIQUE (description);


--
-- Name: severity_levels severity_levels_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.severity_levels
    ADD CONSTRAINT severity_levels_pkey PRIMARY KEY (severity_level);


--
-- Name: symptom symptom_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.symptom
    ADD CONSTRAINT symptom_pkey PRIMARY KEY (patient_id, date, "time");


--
-- Name: test_params test_params_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.test_params
    ADD CONSTRAINT test_params_pkey PRIMARY KEY (test_id, parameter_name);


--
-- Name: test_request test_request_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.test_request
    ADD CONSTRAINT test_request_pkey PRIMARY KEY (request_id);


--
-- Name: test_result_value test_result_value_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.test_result_value
    ADD CONSTRAINT test_result_value_pkey PRIMARY KEY (performed_test_id, parameter_name);


--
-- Name: tests tests_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.tests
    ADD CONSTRAINT tests_pkey PRIMARY KEY (test_id);


--
-- Name: appointment unq_appointment_slot_serial; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.appointment
    ADD CONSTRAINT unq_appointment_slot_serial UNIQUE (slot_id, serial_number);


--
-- Name: appointment appointment_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.appointment
    ADD CONSTRAINT appointment_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctor(doctor_id) ON DELETE CASCADE;


--
-- Name: appointment appointment_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.appointment
    ADD CONSTRAINT appointment_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patient(patient_id) ON DELETE CASCADE;


--
-- Name: appointment appointment_slot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.appointment
    ADD CONSTRAINT appointment_slot_id_fkey FOREIGN KEY (slot_id) REFERENCES public.doctor_availability(slot_id);


--
-- Name: diagnosed_diseases diagnosed_diseases_disease_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.diagnosed_diseases
    ADD CONSTRAINT diagnosed_diseases_disease_id_fkey FOREIGN KEY (disease_id) REFERENCES public.diseases(disease_id);


--
-- Name: diagnosed_diseases diagnosed_diseases_prescription_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.diagnosed_diseases
    ADD CONSTRAINT diagnosed_diseases_prescription_id_fkey FOREIGN KEY (prescription_id) REFERENCES public.prescription(prescription_id) ON DELETE CASCADE;


--
-- Name: doctor_availability doctor_availability_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.doctor_availability
    ADD CONSTRAINT doctor_availability_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctor(doctor_id) ON DELETE CASCADE;


--
-- Name: doctor_availability doctor_availability_medical_center_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.doctor_availability
    ADD CONSTRAINT doctor_availability_medical_center_id_fkey FOREIGN KEY (medical_center_id) REFERENCES public.medical_center(medical_center_id);


--
-- Name: doctor_degree doctor_degree_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.doctor_degree
    ADD CONSTRAINT doctor_degree_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctor(doctor_id) ON DELETE CASCADE;


--
-- Name: doctor_review doctor_review_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.doctor_review
    ADD CONSTRAINT doctor_review_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctor(doctor_id) ON DELETE CASCADE;


--
-- Name: doctor_review doctor_review_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.doctor_review
    ADD CONSTRAINT doctor_review_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patient(patient_id) ON DELETE CASCADE;


--
-- Name: hospital_test_availability hospital_test_availability_medical_center_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.hospital_test_availability
    ADD CONSTRAINT hospital_test_availability_medical_center_id_fkey FOREIGN KEY (medical_center_id) REFERENCES public.medical_center(medical_center_id) ON DELETE CASCADE;


--
-- Name: hospital_test_availability hospital_test_availability_test_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.hospital_test_availability
    ADD CONSTRAINT hospital_test_availability_test_id_fkey FOREIGN KEY (test_id) REFERENCES public.tests(test_id) ON DELETE CASCADE;


--
-- Name: performed_tests performed_tests_medical_center_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.performed_tests
    ADD CONSTRAINT performed_tests_medical_center_id_fkey FOREIGN KEY (medical_center_id) REFERENCES public.medical_center(medical_center_id);


--
-- Name: performed_tests performed_tests_performed_by_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.performed_tests
    ADD CONSTRAINT performed_tests_performed_by_doctor_id_fkey FOREIGN KEY (performed_by_doctor_id) REFERENCES public.doctor(doctor_id) ON DELETE SET NULL;


--
-- Name: performed_tests performed_tests_prescription_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.performed_tests
    ADD CONSTRAINT performed_tests_prescription_id_fkey FOREIGN KEY (prescription_id) REFERENCES public.prescription(prescription_id) ON DELETE CASCADE;


--
-- Name: performed_tests performed_tests_reviewed_by_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.performed_tests
    ADD CONSTRAINT performed_tests_reviewed_by_doctor_id_fkey FOREIGN KEY (reviewed_by_doctor_id) REFERENCES public.doctor(doctor_id) ON DELETE SET NULL;


--
-- Name: performed_tests performed_tests_test_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.performed_tests
    ADD CONSTRAINT performed_tests_test_id_fkey FOREIGN KEY (test_id) REFERENCES public.tests(test_id);


--
-- Name: prescribed_medicine prescribed_medicine_medicine_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.prescribed_medicine
    ADD CONSTRAINT prescribed_medicine_medicine_id_fkey FOREIGN KEY (medicine_id) REFERENCES public.medicines(medicine_id);


--
-- Name: prescribed_medicine prescribed_medicine_prescription_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.prescribed_medicine
    ADD CONSTRAINT prescribed_medicine_prescription_id_fkey FOREIGN KEY (prescription_id) REFERENCES public.prescription(prescription_id) ON DELETE CASCADE;


--
-- Name: prescribed_tests prescribed_tests_prescription_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.prescribed_tests
    ADD CONSTRAINT prescribed_tests_prescription_id_fkey FOREIGN KEY (prescription_id) REFERENCES public.prescription(prescription_id) ON DELETE CASCADE;


--
-- Name: prescribed_tests prescribed_tests_test_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.prescribed_tests
    ADD CONSTRAINT prescribed_tests_test_id_fkey FOREIGN KEY (test_id) REFERENCES public.tests(test_id);


--
-- Name: prescription prescription_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.prescription
    ADD CONSTRAINT prescription_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctor(doctor_id) ON DELETE CASCADE;


--
-- Name: prescription prescription_medical_center_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.prescription
    ADD CONSTRAINT prescription_medical_center_id_fkey FOREIGN KEY (medical_center_id) REFERENCES public.medical_center(medical_center_id);


--
-- Name: prescription prescription_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.prescription
    ADD CONSTRAINT prescription_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patient(patient_id) ON DELETE CASCADE;


--
-- Name: symptom symptom_overall_mood_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.symptom
    ADD CONSTRAINT symptom_overall_mood_fkey FOREIGN KEY (overall_mood) REFERENCES public.mood_options(mood_value);


--
-- Name: symptom symptom_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.symptom
    ADD CONSTRAINT symptom_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patient(patient_id) ON DELETE CASCADE;


--
-- Name: symptom symptom_severity_level_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.symptom
    ADD CONSTRAINT symptom_severity_level_fkey FOREIGN KEY (severity_level) REFERENCES public.severity_levels(severity_level);


--
-- Name: test_params test_params_test_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.test_params
    ADD CONSTRAINT test_params_test_id_fkey FOREIGN KEY (test_id) REFERENCES public.tests(test_id);


--
-- Name: test_request test_request_medical_center_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.test_request
    ADD CONSTRAINT test_request_medical_center_id_fkey FOREIGN KEY (medical_center_id) REFERENCES public.medical_center(medical_center_id);


--
-- Name: test_request test_request_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.test_request
    ADD CONSTRAINT test_request_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patient(patient_id) ON DELETE CASCADE;


--
-- Name: test_request test_request_prescription_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.test_request
    ADD CONSTRAINT test_request_prescription_id_fkey FOREIGN KEY (prescription_id) REFERENCES public.prescription(prescription_id) ON DELETE CASCADE;


--
-- Name: test_request test_request_test_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.test_request
    ADD CONSTRAINT test_request_test_id_fkey FOREIGN KEY (test_id) REFERENCES public.tests(test_id);


--
-- Name: test_result_value test_result_value_performed_test_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.test_result_value
    ADD CONSTRAINT test_result_value_performed_test_id_fkey FOREIGN KEY (performed_test_id) REFERENCES public.performed_tests(performed_test_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

