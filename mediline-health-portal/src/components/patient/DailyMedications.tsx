
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pill, Clock, X, CodeSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

interface DailyMedication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  durationValue: string;
  durationUnit: string;
  instruction: string;
  status: 'active';
}

const mockDailyMedications: DailyMedication[] = [
  {
    id: '1',
    name: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    durationValue: '3',
    durationUnit: 'day',
    status: 'active',
    instruction: 'Take with or without food'
  },
  {
    id: '2',
    name: 'Aspirin',
    dosage: '81mg',
    frequency: 'Once daily',
    durationValue: '3',
    durationUnit: 'day',
    instruction: 'Take with food to avoid stomach upset',
    status: 'active'
  },
  {
    id: '3',
    name: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    durationValue: '3',
    durationUnit: 'day',
    instruction: 'Take with meals',
    status: 'active'
  }
];

const DailyMedications = () => {
  const [medications, setMedications] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCurrentMedicines = async () => {
      try {
        const response = await api.get('/patient/current-medicine');
        setMedications(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching current mediciens:', error);
      }
    };
    fetchCurrentMedicines();
  }, []);

  if (!medications) return <div>Loading medications...</div>;

  // const requestDiscontinue = (medicationId: string, medicationName: string) => {
  //   setMedications(prev => 
  //     prev.map(med => 
  //       med.id === medicationId 
  //         ? { ...med, status: 'pending_discontinue' as const }
  //         : med
  //     )
  //   );
    
  //   toast({
  //     title: "Request Sent",
  //     description: `Your request to discontinue ${medicationName} has been sent to the doctor.`,
  //   });
  // };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">✅ Active</Badge>;
      case 'pending_discontinue':
        return <Badge className="bg-yellow-100 text-yellow-800">🟡 Pending Discontinue</Badge>;
      case 'discontinued':
        return <Badge className="bg-gray-100 text-gray-800">❌ Discontinued</Badge>;
      default:
        return null;
    }
  };

  const activeMedications = medications.filter(med => med.status !== 'discontinued');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Pill className="w-5 h-5 mr-2 text-medical-600" />
          Today's Medications ({activeMedications.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeMedications.length > 0 ? (
            activeMedications.map((medication) => (
              <div key={medication.id} className="border rounded-lg p-4 bg-white">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-gray-900">{medication.name}</h4>
                      <Badge variant="secondary">{medication.dosage}</Badge>
                      {getStatusBadge('active')}
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{medication.frequency}</span>
                      </div>
                      <p><strong>Instruction:</strong> {medication.instruction}</p>
                      <p><strong>Duration:</strong> {medication.durationValue} {medication.durationUnit}</p>
                    </div>
                  </div>
                  {/* {medication.status === 'active' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => requestDiscontinue(medication.id, medication.name)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Stop
                    </Button>
                  )} */}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Pill className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No active medications</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyMedications;
