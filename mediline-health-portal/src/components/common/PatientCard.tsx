import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { User } from 'lucide-react';
import { Patient } from '@/types';

interface PatientCardProps {
  patient: Patient | null;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient }) => {
  if (!patient) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-600">No patient selected</p>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
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
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-gray-600">Email</p>
            <p className="text-base text-gray-900">{patient.email}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-gray-600">Address</p>
            <p className="text-base text-gray-900">{patient.address}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-gray-600">Emergency Contact</p>
            <p className="text-base text-gray-900">{patient.emergencyContact}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientCard;