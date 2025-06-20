
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockPatients, mockPrescriptions, mockTestResults } from '@/data/mockData';
import { 
  ArrowLeft, 
  User, 
  FileText, 
  TestTube, 
  Calendar, 
  Pill,
  Download,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const PatientMedicalHistory = () => {
  const { patientId } = useParams();
  
  const patient = mockPatients.find(p => p.id === patientId);
  const patientPrescriptions = mockPrescriptions.filter(presc => presc.patientId === patientId);
  const patientTests = mockTestResults.filter(test => test.patientId === patientId);

  if (!patient) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Patient Not Found</h2>
        <p className="text-gray-600 mb-4">The requested patient could not be found.</p>
        <Link to="/doctor/patients">
          <Button>Back to Patient List</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/doctor/appointments">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Appointments
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{patient.name}</h1>
            <p className="text-gray-600">Complete Medical History</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Link to={`/doctor/prescriptions/create?patientId=${patientId}`}>
            <Button className="bg-medical-600 hover:bg-medical-700">
              <Pill className="w-4 h-4 mr-2" />
              Write Prescription
            </Button>
          </Link>
        </div>
      </div>

      {/* Patient Info Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2 text-medical-600" />
            Patient Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Age</p>
              <p className="text-base text-gray-900">
                {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} years
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Gender</p>
              <p className="text-base text-gray-900 capitalize">{patient.gender}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Blood Group</p>
              <p className="text-base text-gray-900">{patient.bloodGroup}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Phone</p>
              <p className="text-base text-gray-900">{patient.phone}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prescription History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2 text-medical-600" />
              Prescription History ({patientPrescriptions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {patientPrescriptions.length > 0 ? (
              <div className="space-y-4">
                {patientPrescriptions.map((prescription) => (
                  <div key={prescription.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium text-gray-900">{prescription.diagnosis}</p>
                        <p className="text-sm text-gray-600 flex items-center mt-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          {prescription.date}
                        </p>
                      </div>
                      <Link to={`/doctor/prescription/${prescription.id}/view`}>
                        <Button size="sm" variant="outline" className="hover:bg-medical-50">
                          View Full
                        </Button>
                      </Link>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Medications:</p>
                      <div className="flex flex-wrap gap-2">
                        {prescription.medications.map((med, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {med.name} - {med.dosage}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {prescription.notes && (
                      <div className="mt-3 p-2 bg-gray-50 rounded">
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
              Test Results ({patientTests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {patientTests.length > 0 ? (
              <div className="space-y-4">
                {patientTests.map((test) => (
                  <div key={test.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <Link 
                          to={`/doctor/test-result/${test.id}/view`}
                          className="font-medium text-gray-900 hover:text-medical-600 transition-colors cursor-pointer"
                        >
                          {test.testName}
                        </Link>
                        <p className="text-sm text-gray-600">{test.date}</p>
                        <Badge 
                          variant={test.status === 'completed' ? 'default' : 'secondary'}
                          className={test.status === 'completed' ? 'bg-green-100 text-green-800 mt-1' : 'mt-1'}
                        >
                          {test.status}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        {test.reportUrl && (
                          <Button size="sm" variant="outline">
                            <Download className="w-3 h-3 mr-1" />
                            PDF
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3">{test.result}</p>
                    
                    {test.parameters && test.parameters.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Parameters:</p>
                        <div className="space-y-1">
                          {test.parameters.map((param, index) => (
                            <div key={index} className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded">
                              <span className="font-medium">{param.name}</span>
                              <div className="flex items-center space-x-2">
                                <span className={param.isNormal ? 'text-green-600' : 'text-red-600'}>
                                  {param.value} {param.unit}
                                </span>
                                {param.isNormal ? (
                                  <CheckCircle className="w-3 h-3 text-green-600" />
                                ) : (
                                  <AlertTriangle className="w-3 h-3 text-red-600" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {test.notes && (
                      <div className="mt-3 p-2 bg-blue-50 rounded">
                        <p className="text-sm text-blue-700">{test.notes}</p>
                      </div>
                    )}
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

      {/* Medication Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Medication Timeline</CardTitle>
          <CardDescription>Current and past medications with duration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {patientPrescriptions.flatMap(presc => 
              presc.medications.map((med, index) => (
                <div key={`${presc.id}-${index}`} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-medical-600 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-900">{med.name}</p>
                      <p className="text-sm text-gray-600">{med.dosage} - {med.frequency}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{med.duration}</p>
                    <p className="text-xs text-gray-500">{presc.date}</p>
                  </div>
                </div>
              ))
            )}
            
            {patientPrescriptions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Pill className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No medication history found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientMedicalHistory;
