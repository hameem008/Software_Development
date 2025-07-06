import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap } from 'lucide-react';

interface OverviewTabProps {
  doctor: {
    name: string;
    specialization: string;
    academicInstitution: string;
    degrees: Array<{ degree: string; institution: string; year: number }>;
  };
}

const OverviewTab: React.FC<OverviewTabProps> = ({ doctor }) => {
  const lastName = doctor.name.split(' ').pop() || doctor.name;

  return (
    <Card>
      <CardHeader>
        <CardTitle>About Dr. {lastName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <p className="text-gray-600">
            Dr. {lastName} is a highly experienced {doctor.specialization.toLowerCase()} specialist
            practicing at {doctor.academicInstitution}. They provide comprehensive care with a focus
            on patient-centered treatment.
          </p>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Specializations</h4>
            <Badge variant="outline">{doctor.specialization}</Badge>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Education</h4>
            <div className="space-y-3">
              {doctor.degrees.map((degree, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <GraduationCap className="w-5 h-5 text-medical-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">{degree.degree}</p>
                    <p className="text-gray-600">{degree.institution}</p>
                    <p className="text-sm text-gray-500">Class of {degree.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OverviewTab;