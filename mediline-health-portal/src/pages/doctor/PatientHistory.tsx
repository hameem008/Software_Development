import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, User, FileText, TestTube, Calendar, Pill } from 'lucide-react';
import api from '@/lib/api';

interface Patient {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  bloodGroup: string;
}

interface Test {
  performTestId: number;
  name: string;
  date: string;
  orderedBy: {
    doctorId: number;
    name: string;
    specialization: string;
    designation: string;
    academicInstitution: string;
  };
}

interface Prescription {
  prescriptionId: number;
  doctorName: string;
  doctorId: number;
  issuedDate: string;
  summary: string;
}

const PatientHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientProfile, setPatientProfile] = useState<Patient | null>(null);
  const [medications, setMedications] = useState<Prescription[]>([]);
  const [testResults, setTestResults] = useState<Test[]>([]);

  const handleSearchButton = async () => {
    try {
      const profileResponse = await api.post('/doctor/patient-history/patient', { patientEmail: searchTerm });
      setPatientProfile(profileResponse.data);
      setSelectedPatient(profileResponse.data);

      const prescriptionsResponse = await api.post('/doctor/patient-history/prescription/all/email', { patientEmail: searchTerm });
      setMedications(prescriptionsResponse.data);

      const testResultsResponse = await api.post('/doctor/patient-history/test/all/email', { patientEmail: searchTerm });
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
        {/* Patient Search */}
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
                  placeholder="Search by email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button onClick={handleSearchButton}>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
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
                      <p className="text-base text-gray-900">{selectedPatient.phoneNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Date of Birth</p>
                      <p className="text-base text-gray-900">{selectedPatient.dateOfBirth}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Blood Group</p>
                      <p className="text-base text-gray-900">{selectedPatient.bloodGroup}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Prescription History */}
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
                        <div key={prescription.prescriptionId} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="font-medium text-gray-900">Prescription #{prescription.prescriptionId}</p>
                              <p className="text-sm text-gray-600 flex items-center mt-1">
                                <Calendar className="w-4 h-4 mr-1" />
                                {prescription.issuedDate}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {prescription.doctorName}
                              </p>
                            </div>
                            <Button size="sm" variant="outline">
                              View Full Prescription
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700">Summary:</p>
                            <p className="text-sm text-gray-600">{prescription.summary}</p>
                          </div>
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
                        <div key={test.performTestId} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{test.name}</p>
                            <p className="text-sm text-gray-600">{test.date}</p>
                            <p className="text-sm text-gray-600">
                              {test.orderedBy.name}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">
                              View Report
                            </Button>
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
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Patient</h3>
                <p className="text-gray-600">Search for a patient to view their medical history</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientHistory;