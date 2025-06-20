import { Patient, Doctor, Hospital, Appointment, Prescription, TestResult, SymptomEntry } from '@/types';

export const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    type: 'patient',
    dateOfBirth: '1985-03-15',
    gender: 'male',
    bloodGroup: 'O+',
    address: '123 Main St, Springfield, IL',
    phone: '+1 (555) 123-4567',
    emergencyContact: '+1 (555) 987-6543',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  },
];

export const mockDoctors: Doctor[] = [
  {
    id: '2',
    name: 'Dr. Sarah Johnson',
    email: 'dr.johnson@hospital.com',
    type: 'doctor',
    specialization: 'Cardiology',
    degree: 'MD, FACC',
    hospital: 'City General Hospital',
    experience: 8,
    consultationFee: 150,
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    bio: 'Dr. Sarah Johnson is a board-certified cardiologist with over 8 years of experience in treating complex cardiovascular conditions. She specializes in interventional cardiology and preventive heart care.',
    rating: 4.8,
    affiliatedCenters: ['City General Hospital', 'Heart Care Institute'],
    consultingAddress: '456 Medical Plaza, Suite 302, Springfield, IL 62701',
  },
  {
    id: '3',
    name: 'Dr. Michael Chen',
    email: 'dr.chen@hospital.com',
    type: 'doctor',
    specialization: 'Dermatology',
    degree: 'MD, FAAD',
    hospital: 'Metro Health Center',
    experience: 12,
    consultationFee: 120,
    availability: ['Monday', 'Wednesday', 'Thursday', 'Saturday'],
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
    bio: 'Dr. Michael Chen is a renowned dermatologist specializing in medical and cosmetic dermatology. He has extensive experience in skin cancer detection and advanced dermatological procedures.',
    rating: 4.9,
    affiliatedCenters: ['Metro Health Center', 'Skin Care Clinic'],
    consultingAddress: '789 Wellness Blvd, Metro Health Center, Springfield, IL 62702',
  },
  {
    id: '4',
    name: 'Dr. Emily Rodriguez',
    email: 'dr.rodriguez@hospital.com',
    type: 'doctor',
    specialization: 'Pediatrics',
    degree: 'MD, FAAP',
    hospital: 'Children\'s Medical Center',
    experience: 6,
    consultationFee: 130,
    availability: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    avatar: 'https://images.unsplash.com/photo-1594824506688-bd325451ad64?w=150&h=150&fit=crop&crop=face',
    bio: 'Dr. Emily Rodriguez is a compassionate pediatrician dedicated to providing comprehensive healthcare for children from infancy through adolescence.',
    rating: 4.7,
    affiliatedCenters: ['Children\'s Medical Center'],
    consultingAddress: '123 Kids Care Ave, Children\'s Medical Center, Springfield, IL 62703',
  },
  {
    id: '5',
    name: 'Dr. James Wilson',
    email: 'dr.wilson@hospital.com',
    type: 'doctor',
    specialization: 'Orthopedics',
    degree: 'MD, FAAOS',
    hospital: 'Sports Medicine Institute',
    experience: 15,
    consultationFee: 180,
    availability: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
    bio: 'Dr. James Wilson is an orthopedic surgeon specializing in sports medicine and joint replacement. He has helped numerous athletes return to peak performance.',
    rating: 4.6,
    affiliatedCenters: ['Sports Medicine Institute', 'Orthopedic Center'],
    consultingAddress: '321 Sports Dr, Sports Medicine Institute, Springfield, IL 62704',
  },
  {
    id: '6',
    name: 'Dr. Lisa Park',
    email: 'dr.park@hospital.com',
    type: 'doctor',
    specialization: 'Neurology',
    degree: 'MD, PhD',
    hospital: 'Brain & Spine Center',
    experience: 10,
    consultationFee: 200,
    availability: ['Wednesday', 'Thursday', 'Friday', 'Saturday'],
    avatar: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=150&h=150&fit=crop&crop=face',
    bio: 'Dr. Lisa Park is a neurologist with expertise in treating neurological disorders. She holds a PhD in neuroscience and focuses on innovative treatment approaches.',
    rating: 4.9,
    affiliatedCenters: ['Brain & Spine Center', 'Neurology Institute'],
    consultingAddress: '654 Brain Ave, Brain & Spine Center, Springfield, IL 62705',
  },
];

export const mockDoctorReviews = {
  '2': [
    { id: '1', patientName: 'Anonymous', rating: 5, comment: 'Excellent cardiologist! Very thorough and caring.', date: '2024-05-15' },
    { id: '2', patientName: 'John D.', rating: 4, comment: 'Great experience, explained everything clearly.', date: '2024-05-10' },
    { id: '3', patientName: 'Mary S.', rating: 5, comment: 'Dr. Johnson saved my life. Highly recommend!', date: '2024-05-05' },
  ],
  '3': [
    { id: '4', patientName: 'Alice M.', rating: 5, comment: 'Best dermatologist in town. Very professional.', date: '2024-05-20' },
    { id: '5', patientName: 'Bob K.', rating: 4, comment: 'Good treatment, reasonable fees.', date: '2024-05-12' },
  ],
  '4': [
    { id: '6', patientName: 'Sarah L.', rating: 5, comment: 'Amazing with children. My kids love her!', date: '2024-05-18' },
    { id: '7', patientName: 'Tom R.', rating: 5, comment: 'Very patient and understanding pediatrician.', date: '2024-05-08' },
  ],
  '5': [
    { id: '8', patientName: 'Mike H.', rating: 4, comment: 'Helped me recover from my knee injury quickly.', date: '2024-05-22' },
    { id: '9', patientName: 'Jennifer P.', rating: 5, comment: 'Excellent surgeon, great bedside manner.', date: '2024-05-14' },
  ],
  '6': [
    { id: '10', patientName: 'David W.', rating: 5, comment: 'Top neurologist. Very knowledgeable and helpful.', date: '2024-05-25' },
    { id: '11', patientName: 'Emma T.', rating: 4, comment: 'Professional and thorough examination.', date: '2024-05-16' },
  ],
};

export const mockTimeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
];

export const mockHospitals: Hospital[] = [
  {
    id: '5',
    name: 'City General Hospital',
    email: 'admin@citygeneral.com',
    type: 'hospital',
    address: '456 Hospital Ave, Springfield, IL',
    phone: '+1 (555) 234-5678',
    departments: ['Emergency', 'Cardiology', 'Orthopedics', 'Neurology'],
    services: ['MRI', 'CT Scan', 'X-Ray', 'Blood Tests', 'ECG'],
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    doctorId: '2',
    date: '2024-06-05',
    time: '10:00 AM',
    status: 'scheduled',
    reason: 'Regular checkup',
  },
  {
    id: '2',
    patientId: '1',
    doctorId: '3',
    date: '2024-06-10',
    time: '2:30 PM',
    status: 'scheduled',
    reason: 'Skin consultation',
  },
];

export const mockPrescriptions: Prescription[] = [
  {
    id: '1',
    patientId: '1',
    doctorId: '2',
    appointmentId: '1',
    date: '2024-05-28',
    diagnosis: 'Hypertension - Stage 1',
    medications: [
      {
        id: '1',
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        duration: '30 days',
        instructions: 'Take with or without food',
      },
      {
        id: '2',
        name: 'Aspirin',
        dosage: '81mg',
        frequency: 'Once daily',
        duration: '30 days',
        instructions: 'Take with food to avoid stomach upset',
      },
    ],
    testOrders: [
      {
        id: '1',
        testName: 'Complete Blood Count (CBC)',
        reason: 'Routine monitoring',
        status: 'completed',
      },
      {
        id: '2',
        testName: 'Lipid Panel',
        reason: 'Cardiovascular risk assessment',
        status: 'completed',
      },
    ],
    notes: 'Follow up in 4 weeks. Monitor blood pressure daily.',
  },
];

export const mockTestResults: TestResult[] = [
  {
    id: '1',
    patientId: '1',
    testOrderId: '1',
    hospitalId: '5',
    testName: 'Complete Blood Count (CBC)',
    testType: 'Pathology',
    date: '2024-05-30',
    result: 'Normal values within reference range',
    reportUrl: '/mock-reports/cbc-report.pdf',
    status: 'completed',
    performedBy: 'Dr. Sarah Johnson',
    parameters: [
      { name: 'Hemoglobin', value: '14.2', unit: 'g/dL', normalRange: '12-15.5', isNormal: true },
      { name: 'White Blood Cells', value: '7500', unit: '/μL', normalRange: '4500-11000', isNormal: true },
      { name: 'Platelets', value: '250000', unit: '/μL', normalRange: '150000-450000', isNormal: true },
    ],
    notes: 'All values are within normal limits. Continue current medication regimen.',
  },
  {
    id: '2',
    patientId: '1',
    testOrderId: '2',
    hospitalId: '5',
    testName: 'Lipid Panel',
    testType: 'Pathology',
    date: '2024-05-30',
    result: 'Total cholesterol slightly elevated',
    reportUrl: '/mock-reports/lipid-report.pdf',
    status: 'completed',
    performedBy: 'Dr. Sarah Johnson',
    parameters: [
      { name: 'Total Cholesterol', value: '210', unit: 'mg/dL', normalRange: '<200', isNormal: false },
      { name: 'LDL Cholesterol', value: '130', unit: 'mg/dL', normalRange: '<100', isNormal: false },
      { name: 'HDL Cholesterol', value: '45', unit: 'mg/dL', normalRange: '>40', isNormal: true },
      { name: 'Triglycerides', value: '175', unit: 'mg/dL', normalRange: '<150', isNormal: false },
    ],
    notes: 'Consider dietary modifications and increased physical activity.',
  },
];

export const mockSymptomEntries: SymptomEntry[] = [
  {
    id: '1',
    patientId: '1',
    date: '2024-06-01',
    symptoms: 'Mild headache, feeling tired',
    mood: 'Fair',
    severity: 3,
  },
  {
    id: '2',
    patientId: '1',
    date: '2024-06-02',
    symptoms: 'Headache resolved, energy levels better',
    mood: 'Good',
    severity: 1,
  },
];

export const mockHealthMetrics = {
  weight: [
    { date: '2024-01-01', value: 75.2 },
    { date: '2024-02-01', value: 74.8 },
    { date: '2024-03-01', value: 74.5 },
    { date: '2024-04-01', value: 74.0 },
    { date: '2024-05-01', value: 73.7 },
    { date: '2024-06-01', value: 73.5 },
  ],
  bloodPressure: [
    { date: '2024-01-15', systolic: 135, diastolic: 85 },
    { date: '2024-02-15', systolic: 132, diastolic: 82 },
    { date: '2024-03-15', systolic: 128, diastolic: 80 },
    { date: '2024-04-15', systolic: 125, diastolic: 78 },
    { date: '2024-05-15', systolic: 122, diastolic: 75 },
    { date: '2024-06-01', systolic: 120, diastolic: 73 },
  ],
  heartRate: [
    { date: '2024-01-01', value: 78 },
    { date: '2024-02-01', value: 76 },
    { date: '2024-03-01', value: 74 },
    { date: '2024-04-01', value: 72 },
    { date: '2024-05-01', value: 70 },
    { date: '2024-06-01', value: 68 },
  ],
};

export const mockDoctorAvailability = {
  '2': [
    { day: 'Monday', time: '9:00 AM – 12:00 PM', location: 'City General Hospital' },
    { day: 'Tuesday', time: '2:00 PM – 6:00 PM', location: 'Heart Care Institute' },
    { day: 'Wednesday', time: '9:00 AM – 1:00 PM', location: 'City General Hospital' },
    { day: 'Friday', time: '3:00 PM – 7:00 PM', location: 'Heart Care Institute' },
  ],
  '3': [
    { day: 'Monday', time: '10:00 AM – 2:00 PM', location: 'Metro Health Center' },
    { day: 'Wednesday', time: '3:00 PM – 6:00 PM', location: 'Skin Care Clinic' },
    { day: 'Thursday', time: '9:00 AM – 12:00 PM', location: 'Metro Health Center' },
    { day: 'Saturday', time: '10:00 AM – 1:00 PM', location: 'Skin Care Clinic' },
  ],
  '4': [
    { day: 'Tuesday', time: '8:00 AM – 12:00 PM', location: "Children's Medical Center" },
    { day: 'Wednesday', time: '2:00 PM – 6:00 PM', location: "Children's Medical Center" },
    { day: 'Thursday', time: '9:00 AM – 1:00 PM', location: "Children's Medical Center" },
    { day: 'Friday', time: '3:00 PM – 5:00 PM', location: "Children's Medical Center" },
  ],
  '5': [
    { day: 'Monday', time: '7:00 AM – 11:00 AM', location: 'Sports Medicine Institute' },
    { day: 'Tuesday', time: '1:00 PM – 5:00 PM', location: 'Orthopedic Center' },
    { day: 'Thursday', time: '8:00 AM – 12:00 PM', location: 'Sports Medicine Institute' },
    { day: 'Friday', time: '2:00 PM – 6:00 PM', location: 'Orthopedic Center' },
  ],
  '6': [
    { day: 'Wednesday', time: '9:00 AM – 1:00 PM', location: 'Brain & Spine Center' },
    { day: 'Thursday', time: '2:00 PM – 6:00 PM', location: 'Neurology Institute' },
    { day: 'Friday', time: '10:00 AM – 2:00 PM', location: 'Brain & Spine Center' },
    { day: 'Saturday', time: '9:00 AM – 12:00 PM', location: 'Neurology Institute' },
  ],
};
