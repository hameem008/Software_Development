
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pill, Clock, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DailyMedication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  instructions: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'pending_discontinue' | 'discontinued';
}

const mockDailyMedications: DailyMedication[] = [
  {
    id: '1',
    name: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    instructions: 'Take with or without food',
    startDate: '2024-05-28',
    endDate: '2024-06-28',
    status: 'active'
  },
  {
    id: '2',
    name: 'Aspirin',
    dosage: '81mg',
    frequency: 'Once daily',
    instructions: 'Take with food to avoid stomach upset',
    startDate: '2024-05-28',
    endDate: '2024-06-28',
    status: 'active'
  },
  {
    id: '3',
    name: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    instructions: 'Take with meals',
    startDate: '2024-05-20',
    endDate: '2024-06-20',
    status: 'pending_discontinue'
  }
];

const DailyMedications = () => {
  const [medications, setMedications] = useState(mockDailyMedications);
  const { toast } = useToast();

  const requestDiscontinue = (medicationId: string, medicationName: string) => {
    setMedications(prev => 
      prev.map(med => 
        med.id === medicationId 
          ? { ...med, status: 'pending_discontinue' as const }
          : med
      )
    );
    
    toast({
      title: "Request Sent",
      description: `Your request to discontinue ${medicationName} has been sent to the doctor.`,
    });
  };

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
                      {getStatusBadge(medication.status)}
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{medication.frequency}</span>
                      </div>
                      <p><strong>Instructions:</strong> {medication.instructions}</p>
                      <p><strong>Duration:</strong> {medication.startDate} to {medication.endDate}</p>
                    </div>
                  </div>
                  {medication.status === 'active' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => requestDiscontinue(medication.id, medication.name)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Stop
                    </Button>
                  )}
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
