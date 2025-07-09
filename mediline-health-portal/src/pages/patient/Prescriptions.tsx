
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockPrescriptions, mockDoctors } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { FileText, User, Calendar, Pill, Download } from 'lucide-react';
import api from '@/lib/api';

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string | null;
}

interface Vital {
  name: string;
  value: string;
  unit: string;
}

interface Prescription {
  prescriptionId: string;
  doctor: {
    doctorId: number;
    name: string;
    specialization: string;
    designation: string;
    academicInstitution: string;
  };
  issuedDate: string;
  summary: string;
  vitals: {
    bloodPressure?: Vital;
    weight?: Vital;
    heartRate?: Vital;
  };
  symptoms: string;
  diagnosis: string[];
  medications: Medication[];
  tests: any[]; // optional
  notes: string;
  nextAppointment: string;
}

const prescriptionIdsToLoad = ['8']; // ← replace with dynamic list in production

const PatientPrescriptions = () => {
  const { toast } = useToast();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPrescriptionDetails = async () => {
    try {
      const allPrescriptions: Prescription[] = [];

      for (const id of prescriptionIdsToLoad) {
        const response = await api.post('/patient/history/prescription-details', {
          prescriptionId: id,
        });
        allPrescriptions.push(response.data);
      }

      setPrescriptions(allPrescriptions);
    } catch (error) {
      console.error('Error loading prescriptions', error);
      toast({
        title: 'Error',
        description: 'Failed to load prescription data.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptionDetails();
  }, []);

  const handleDownloadPrescription = (prescriptionId: string) => {
    console.log('Download triggered for:', prescriptionId);
    toast({ title: 'Download started', description: `Prescription #${prescriptionId}` });
  };

  if (loading) {
    return <p>Loading prescriptions...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Prescriptions</h1>
        <p className="text-gray-600">View and manage your medical prescriptions</p>
      </div>

      {prescriptions.length > 0 ? (
        prescriptions.map((prescription) => (
          <Card key={prescription.prescriptionId} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-medical-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-medical-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{prescription.doctor.name}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      {prescription.issuedDate}
                    </CardDescription>
                    <p className="text-sm text-gray-500">{prescription.doctor.designation}</p>
                    <p className="text-sm text-gray-500">{prescription.doctor.academicInstitution}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownloadPrescription(prescription.prescriptionId)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Summary */}
              {prescription.summary && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{prescription.summary}</p>
                </div>
              )}

              {/* Symptoms */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Symptoms</h4>
                <p className="text-gray-700">{prescription.symptoms}</p>
              </div>

              {/* Vitals */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Vitals</h4>
                <div className="flex flex-wrap gap-3 text-sm text-gray-700">
                  {prescription.vitals?.bloodPressure && (
                    <Badge>
                      {prescription.vitals.bloodPressure.name}: {prescription.vitals.bloodPressure.value} {prescription.vitals.bloodPressure.unit}
                    </Badge>
                  )}
                  {prescription.vitals?.weight && (
                    <Badge>
                      {prescription.vitals.weight.name}: {prescription.vitals.weight.value} {prescription.vitals.weight.unit}
                    </Badge>
                  )}
                  {prescription.vitals?.heartRate && (
                    <Badge>
                      {prescription.vitals.heartRate.name}: {prescription.vitals.heartRate.value} {prescription.vitals.heartRate.unit}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Diagnosis */}
              {prescription.diagnosis.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Diagnosis</h4>
                  <ul className="list-disc pl-6 text-gray-700">
                    {prescription.diagnosis.map((diag, i) => (
                      <li key={i}>{diag}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Medications */}
              {prescription.medications.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Pill className="w-4 h-4 mr-2 text-medical-600" />
                    Medications
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {prescription.medications.map((med, i) => (
                      <div key={i} className="border rounded-lg p-3 bg-white">
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="font-medium text-gray-900">{med.name}</h5>
                          <Badge variant="secondary" className="text-xs">{med.dosage}</Badge>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p><strong>Frequency:</strong> {med.frequency}</p>
                          <p><strong>Duration:</strong> {med.duration}</p>
                          {med.instructions && (
                            <p><strong>Instructions:</strong> {med.instructions}</p>
                          )}
                        </div>
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

              {/* Next Appointment */}
              {prescription.nextAppointment && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Next Appointment</h4>
                  <p className="text-gray-700">{prescription.nextAppointment}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))
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
  );
};

export default PatientPrescriptions;