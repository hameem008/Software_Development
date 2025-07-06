import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {GraduationCap, Clock, Star, Calendar, User, Hospital} from 'lucide-react';
import UserImage from "@/components/common/UserImage";


interface DoctorInfoCardProps {
  doctor: {
    doctorId: number;
    name: string;
    specialization: string;
    academicInstitution: string;
    designation: string;
    degrees: Array<{ degree: string; institution: string; year: number }>;
    rating: number;
    avatar?: string;
  };
  reviewCount: number;
  onBookAppointment: () => void;
}

const DoctorInfoCard: React.FC<DoctorInfoCardProps> = ({ doctor, reviewCount, onBookAppointment }) => {
  return (
    <Card>
      <CardContent className="p-6">
            <div className="flex items-start space-x-6">
              <UserImage avatar={doctor.avatar} name={doctor.name} />

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{doctor.name}</h1>
                    <Badge variant="secondary" className="bg-medical-100 text-medical-700 mb-3">
                      {doctor.specialization}
                    </Badge>

                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <GraduationCap className="w-4 h-4 mr-2" />
                        <div>
                            {doctor.degrees.map((degree) =>
                                degree.degree).join(', ')}
                        </div>
                      </div>
                    <div className="flex items-center text-gray-600">
                        <Hospital className="w-4 h-4 mr-2" />
                        {doctor.academicInstitution}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        {doctor.designation}
                      </div>
                    </div>

                    <div className="flex items-center mt-4">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="ml-1 text-lg font-medium">{doctor.rating.toFixed(1)}</span>
                      <span className="ml-2 text-gray-600">({reviewCount} reviews)</span>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="bg-medical-600 hover:bg-medical-700"
                    onClick={onBookAppointment}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Appointment
                  </Button>
                </div>
              </div>
            </div>
        </CardContent>
      </Card>
    );
};

export default DoctorInfoCard;