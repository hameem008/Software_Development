
export interface TestRequest {
  id: string;
  patientName: string;
  patientPhone: string;
  testType: string;
  requestedDate: string;
  requestedTime: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
  notes?: string;
  approvedDate?: string;
  finalDate?: string;
  finalTime?: string;
  rejectionReason?: string;
}
