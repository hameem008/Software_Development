
export type UserType = 'patient' | 'doctor' | 'hospital';

export interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
  avatar: string;
}

export interface Patient extends User {
  type: 'patient';
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  bloodGroup: string;
  address: string;
  phone: string;
  emergencyContact: string;
}

export interface Doctor extends User {
  type: 'doctor';
  specialization: string;
  degree: string;
  hospital: string;
  experience: number;
  consultationFee: number;
  availability: string[];
  bio?: string;
  rating?: number;
  affiliatedCenters?: string[];
  consultingAddress?: string;
}

export interface Hospital extends User {
  type: 'hospital';
  address: string;
  phone: string;
  departments: string[];
  services: string[];
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  reason?: string;
  notes?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId: string;
  date: string;
  diagnosis: string;
  medications: Medication[];
  testOrders: TestOrder[];
  notes?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface TestOrder {
  id: string;
  testName: string;
  reason: string;
  status: 'ordered' | 'completed' | 'pending';
}

export interface TestParameter {
  name: string;
  value: string;
  unit: string;
  normalRange: string;
  isNormal: boolean;
}

export interface TestResult {
  id: string;
  patientId: string;
  testOrderId: string;
  hospitalId: string;
  testName: string;
  testType: 'Pathology' | 'Imaging';
  date: string;
  result: string;
  reportUrl?: string;
  status: 'completed' | 'pending';
  performedBy?: string;
  parameters?: TestParameter[];
  notes?: string;
}

export interface SymptomEntry {
  id: string;
  patientId: string;
  date: string;
  symptoms: string;
  mood: string;
  severity: number;
}
