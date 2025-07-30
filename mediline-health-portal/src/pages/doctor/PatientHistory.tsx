import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { mockPatients } from '@/data/mockData';
import { Search, User, FileText, TestTube, Calendar, Pill } from 'lucide-react';
import api from '@/lib/api';

// Mock prescription data
const mockPrescriptions = [
  {
    id: 'presc1',
    patientId: '1',
    diagnosis: 'Hypertension',
    date: '2025-01-15',
    medications: [
      { name: 'Lisinopril', dosage: '10mg daily' },
      { name: 'Amlodipine', dosage: '5mg daily' },
    ],
    notes: 'Monitor blood pressure weekly.',
  },
  {
    id: 'presc2',
    patientId: '1',
    diagnosis: 'Type 2 Diabetes',
    date: '2025-03-22',
    medications: [
      { name: 'Metformin', dosage: '500mg twice daily' },
    ],
    notes: 'Follow up in 3 months.',
  },
  {
    id: 'presc3',
    patientId: '2',
    diagnosis: 'Asthma',
    date: '2025-02-10',
    medications: [
      { name: 'Albuterol', dosage: '2 puffs as needed' },
      { name: 'Fluticasone', dosage: '110mcg twice daily' },
    ],
    notes: 'Use inhaler as prescribed.',
  },
];

// Mock test results data
const mockTestResults = [
  {
    id: 'test1',
    patientId: '1',
    testName: 'Blood Pressure',
    date: '2025-01-10',
    result: '120/80 mmHg',
    status: 'completed',
    reportUrl: '/reports/bp1.pdf',
  },
  {
    id: 'test2',
    patientId: '1',
    testName: 'Blood Glucose',
    date: '2025-03-20',
    result: '100 mg/dL',
    status: 'completed',
    reportUrl: '/reports/glucose1.pdf',
  },
  {
    id: 'test3',
    patientId: '2',
    testName: 'Lung Function',
    date: '2025-02-05',
    result: 'Normal',
    status: 'completed',
    reportUrl: '/reports/lung1.pdf',
  },
];

const PatientHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [patientProfile, setPatientProfile] = useState(null);
  const [medications, setMedications] = useState(mockPrescriptions);
  const [testResults, setTestResults] = useState(mockTestResults);

  const filteredPatients = mockPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPatientPrescriptions = (patientId: string) => {
    return medications.filter(presc => presc.patientId === patientId);
  };

  const getPatientTestResults = (patientId: string) => {
    return testResults.filter(test => test.patientId === patientId);
  };

  const handleSearchButton = async () => {
    try {
      const profileResponse = await api.post('/patient/profile', { email: searchTerm });
      setPatientProfile(profileResponse.data);
      setSelectedPatient(profileResponse.data);

      const prescriptionsResponse = await api.post('/patient/prescriptions', { email: searchTerm });
      setMedications(prescriptionsResponse.data);

      const testResultsResponse = await api.post('/patient/test-results', { email: searchTerm });
      setTestResults(testResultsResponse.data);
    } catch (error) {
      console.error('Error fetching patient data:', error);
      setPatientProfile(null);
      setSelectedPatient(null);
      setMedications([]);
      setTestResults([]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Medical History</h1>
        <p className="text-gray-600">Search and view patient medical records</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Search & List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="w-5 h-5 mr-2 text-medical-600" />
              Search Patients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button onClick={handleSearchButton}>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedPatient?.id === patient.id 
                        ? 'bg-medical-50 border-medical-200' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setSelectedPatient(patient);
                      setMedications(mockPrescriptions);
                      setTestResults(mockTestResults);
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {patient.avatar ? (
                          <img 
                            src={patient.avatar} 
                            alt={patient.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-medical-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-medical-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{patient.name}</p>
                        <p className="text-xs text-gray-500 truncate">{patient.email}</p>
                        <p className="text-xs text-gray-500">
                          Age: {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredPatients.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No patients found</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient Details */}
        <div className="lg:col-span-2">
          {selectedPatient ? (
            <div className="space-y-6">
              {/* Patient Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2 text-medical-600" />
                    Patient Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Full Name</p>
                      <p className="text-base text-gray-900">{selectedPatient.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Email</p>
                      <p className="text-base text-gray-900">{selectedPatient.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Phone</p>
                      <p className="text-base text-gray-900">{selectedPatient.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Date of Birth</p>
                      <p className="text-base text-gray-900">{selectedPatient.dateOfBirth}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Gender</p>
                      <p className="text-base text-gray-900 capitalize">{selectedPatient.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Blood Group</p>
                      <p className="text-base text-gray-900">{selectedPatient.bloodGroup}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm font-medium text-gray-600">Address</p>
                      <p className="text-base text-gray-900">{selectedPatient.address}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Emergency Contact</p>
                      <p className="text-base text-gray-900">{selectedPatient.emergencyContact}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Medical History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-medical-600" />
                    Prescription History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {medications.length > 0 ? (
                    <div className="space-y-4">
                      {medications.map((prescription) => (
                        <div key={prescription.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="font-medium text-gray-900">{prescription.diagnosis}</p>
                              <p className="text-sm text-gray-600 flex items-center mt-1">
                                <Calendar className="w-4 h-4 mr-1" />
                                {prescription.date}
                              </p>
                            </div>
                            <Button size="sm" variant="outline">
                              View Full Prescription
                            </Button>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700">Medications:</p>
                            <div className="flex flex-wrap gap-2">
                              {prescription.medications.map((med, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  <Pill className="w-3 h-3 mr-1" />
                                  {med.name} - {med.dosage}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          {prescription.notes && (
                            <div className="mt-3">
                              <p className="text-sm font-medium text-gray-700">Notes:</p>
                              <p className="text-sm text-gray-600">{prescription.notes}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No prescription history found</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Test Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TestTube className="w-5 h-5 mr-2 text-medical-600" />
                    Test Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {testResults.length > 0 ? (
                    <div className="space-y-3">
                      {testResults.map((test) => (
                        <div key={test.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{test.testName}</p>
                            <p className="text-sm text-gray-600">{test.date}</p>
                            <p className="text-sm text-gray-700">{test.result}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant={test.status === 'completed' ? 'default' : 'secondary'}
                              className={test.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                            >
                              {test.status}
                            </Badge>
                            {test.reportUrl && (
                              <Button size="sm" variant="outline">
                                Download Report
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <TestTube className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No test results found</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              {/* <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-3">
                    <Button className="bg-medical-600 hover:bg-medical-700">
                      Write New Prescription
                    </Button>
                    <Button variant="outline">
                      Schedule Appointment
                    </Button>
                    <Button variant="outline">
                      Send Message
                    </Button>
                  </div>
                </CardContent>
              </Card> */}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Patient</h3>
                <p className="text-gray-600">Choose a patient from the left to view their medical history</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientHistory;