
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { mockDoctors } from '@/data/mockData';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Star, 
  Edit3,
  GraduationCap,
  Building,
  Clock
} from 'lucide-react';

const DoctorProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // Find current doctor data
  const doctorData = mockDoctors.find(d => d.id === user?.id) || mockDoctors[0];

  const handleEditProfile = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Simulate save
      console.log('Profile saved');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your professional information</p>
        </div>
        <Button onClick={handleEditProfile} className="bg-medical-600 hover:bg-medical-700">
          <Edit3 className="w-4 h-4 mr-2" />
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <Avatar className="w-32 h-32 mx-auto">
                <AvatarImage src={doctorData.avatar} alt={doctorData.name} />
                <AvatarFallback className="text-2xl">
                  {doctorData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{doctorData.name}</h2>
                <p className="text-medical-600 font-medium">{doctorData.specialization}</p>
                <div className="flex items-center justify-center mt-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm font-medium">{doctorData.rating}</span>
                  <span className="ml-1 text-sm text-gray-500">(245 reviews)</span>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2 text-medical-600" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Full Name</p>
                  <p className="text-base text-gray-900">{doctorData.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Email</p>
                  <p className="text-base text-gray-900 flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    {doctorData.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Phone</p>
                  <p className="text-base text-gray-900 flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    +1 (555) 123-4567
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Gender</p>
                  <p className="text-base text-gray-900">Male</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <GraduationCap className="w-5 h-5 mr-2 text-medical-600" />
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Specialization</p>
                  <p className="text-base text-gray-900">{doctorData.specialization}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Degree</p>
                  <p className="text-base text-gray-900">{doctorData.degree}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Experience</p>
                  <p className="text-base text-gray-900">{doctorData.experience} years</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Consultation Fee</p>
                  <p className="text-base text-gray-900">${doctorData.consultationFee}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-600">Bio</p>
                  <p className="text-base text-gray-900">{doctorData.bio}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Practice Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="w-5 h-5 mr-2 text-medical-600" />
                Practice Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Primary Hospital</p>
                  <p className="text-base text-gray-900">{doctorData.hospital}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Affiliated Centers</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {doctorData.affiliatedCenters?.map((center, index) => (
                      <Badge key={index} variant="secondary">{center}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Consulting Address</p>
                  <p className="text-base text-gray-900 flex items-start">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                    {doctorData.consultingAddress}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Availability */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-medical-600" />
                Availability Schedule
              </CardTitle>
              <CardDescription>
                Your regular consultation hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {doctorData.availability.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">{day}</span>
                    <span className="text-sm text-gray-600">9:00 AM - 5:00 PM</span>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button variant="outline" className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  Manage Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
