import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, DollarSign, MapPin, Star, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DoctorAvailabilityBadges from "@/components/patient/DoctorAvailabilityBadges";

interface Doctor {
  doctorId: string;
  name: string;
  specialization: string;
  degree: string;
  academicInstitution: string;
  designation: string;
  consultationFee: number;
  availableDays: string[];
  rating: number;
  avatar?: string;
}

const DoctorCard: React.FC<{ doctor: Doctor }> = ({ doctor }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            {doctor.avatar ? (
              <img
                src={doctor.avatar}
                alt={doctor.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-medical-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-medical-600" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="ml-1 text-sm text-gray-600">{doctor.rating}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Badge variant="secondary" className="bg-medical-100 text-medical-700">
                {doctor.specialization}
              </Badge>
              <p className="text-sm text-gray-600">{doctor.degree}</p>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                {doctor.academicInstitution}
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  {doctor.designation}
                </div>
                <div className="flex items-center text-gray-900 font-medium">
                  <DollarSign className="w-4 h-4 mr-1" />
                  ${doctor.consultationFee}
                </div>
              </div>
              <DoctorAvailabilityBadges days={doctor.availableDays} />
            </div>

            <div className="flex space-x-2 mt-4">
              <Link to={`/patient/book-appointment/${doctor.doctorId}`}>
                <Button size="sm" className="bg-medical-600 hover:bg-medical-700">
                  Book Appointment
                </Button>
              </Link>
              <Link to={`/patient/doctors/${doctor.doctorId}`}>
                <Button size="sm" variant="outline">
                  View Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorCard;
