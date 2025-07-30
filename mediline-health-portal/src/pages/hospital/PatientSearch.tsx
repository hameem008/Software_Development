import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, User } from 'lucide-react';
import PatientCard from '@/components/common/PatientCard';
import { mockPatients } from '@/data/mockData';
import { Patient } from '@/types';

const PatientSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedTest, setSelectedTest] = useState('');
  const [prescriptionId, setPrescriptionId] = useState('');

  // Dummy data for testing
  const dummyPatients: Patient[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      type: 'patient',
      dateOfBirth: '1990-05-15',
      gender: 'male',
      bloodGroup: 'O+',
      address: '123 Main St, Springfield',
      phone: '555-0123',
      emergencyContact: 'Jane Smith (555-0124)',
      avatar: '/avatars/john-smith.jpg',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      type: 'patient',
      dateOfBirth: '1985-08-22',
      gender: 'female',
      bloodGroup: 'A-',
      address: '456 Oak Ave, Rivertown',
      phone: '555-0125',
      emergencyContact: 'Mike Johnson (555-0126)',
      avatar: '/avatars/sarah-johnson.jpg',
    },
  ];

  // Dummy test types
  const testTypes = ['RBC', 'Blood', 'Polip Test'];

  // Merge dummy data with mockPatients
  const allPatients = [...mockPatients, ...dummyPatients];

  const filteredPatients = allPatients.filter(patient =>
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (email: string) => {
    setSearchTerm(email);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Search</h1>
        <p className="text-gray-600">Search for a patient by their email address or name</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="w-5 h-5 mr-2 text-medical-600" />
            Search Patient
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Enter patient email or name..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="max-w-md mb-4"
          />
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-600 block mb-1">Select Test</label>
              <Select value={selectedTest} onValueChange={setSelectedTest}>
                <SelectTrigger className="max-w-md">
                  <SelectValue placeholder="Select a test" />
                </SelectTrigger>
                <SelectContent>
                  {testTypes.map((test) => (
                    <SelectItem key={test} value={test}>
                      {test}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-600 block mb-1">Prescription ID</label>
              <Input
                placeholder="Enter prescription ID..."
                value={prescriptionId}
                onChange={(e) => setPrescriptionId(e.target.value)}
                className="max-w-md"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2 text-medical-600" />
            Patient List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedPatient?.id === patient.id 
                    ? 'bg-medical-50 border-medical-200' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedPatient(patient)}
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
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
            <PatientCard patient={selectedPatient} />
        </CardContent>      
     </Card>    
    </div>
  );
};

export default PatientSearch;