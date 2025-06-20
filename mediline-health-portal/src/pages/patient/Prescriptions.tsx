
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockPrescriptions, mockDoctors } from '@/data/mockData';
import { FileText, User, Calendar, Pill, Download } from 'lucide-react';

const PatientPrescriptions = () => {
  const prescriptions = mockPrescriptions;

  const handleDownloadPrescription = (prescriptionId: string) => {
    console.log('Downloading prescription:', prescriptionId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Prescriptions</h1>
        <p className="text-gray-600">View and manage your medical prescriptions</p>
      </div>

      <div className="space-y-6">
        {prescriptions.length > 0 ? (
          prescriptions.map((prescription) => {
            const doctor = mockDoctors.find(d => d.id === prescription.doctorId);
            
            return (
              <Card key={prescription.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {doctor?.avatar ? (
                          <img 
                            src={doctor.avatar} 
                            alt={doctor.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-medical-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-medical-600" />
                          </div>
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{doctor?.name}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          {prescription.date}
                        </CardDescription>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadPrescription(prescription.id)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Diagnosis */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Diagnosis</h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{prescription.diagnosis}</p>
                  </div>

                  {/* Medications */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <Pill className="w-4 h-4 mr-2 text-medical-600" />
                      Medications ({prescription.medications.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {prescription.medications.map((medication) => (
                        <div key={medication.id} className="border rounded-lg p-3 bg-white">
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="font-medium text-gray-900">{medication.name}</h5>
                            <Badge variant="secondary" className="text-xs">
                              {medication.dosage}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p><strong>Frequency:</strong> {medication.frequency}</p>
                            <p><strong>Duration:</strong> {medication.duration}</p>
                            {medication.instructions && (
                              <p><strong>Instructions:</strong> {medication.instructions}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Test Orders */}
                  {prescription.testOrders.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-medical-600" />
                        Recommended Tests ({prescription.testOrders.length})
                      </h4>
                      <div className="space-y-2">
                        {prescription.testOrders.map((test) => (
                          <div key={test.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{test.testName}</p>
                              <p className="text-sm text-gray-600">{test.reason}</p>
                            </div>
                            <Badge 
                              variant={test.status === 'completed' ? 'default' : 'secondary'}
                              className={test.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                            >
                              {test.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {prescription.notes && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Doctor's Notes</h4>
                      <p className="text-gray-700 bg-blue-50 p-3 rounded-md">{prescription.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No prescriptions found</h3>
              <p className="text-gray-600 mb-4">Your prescriptions will appear here after doctor visits</p>
              <Button className="bg-medical-600 hover:bg-medical-700">
                Book an Appointment
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PatientPrescriptions;
