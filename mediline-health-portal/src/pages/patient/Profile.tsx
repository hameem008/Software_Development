import React, { createContext, useContext, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { mockPatients } from '@/data/mockData';
import { User, Phone, Mail, MapPin, Droplets } from 'lucide-react';
import api from '@/lib/api';

const PatientProfile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [patientProfile, setPatientProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/patient/profile');
        setPatientProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);

  if (!patientProfile) return <div>Loading profile...</div>;

  // Using mock patient data
  const patient = mockPatients[0];
  patientProfile.profilePhotoUrl = patient.avatar;

  const handleSave = async () => {
    try {
      const response = await api.post('/patient/profile/update', {
        email: patientProfile.email,
        firstName: patientProfile.firstName,
        lastName: patientProfile.lastName,
        gender: patientProfile.gender,
        dateOfBirth: patientProfile.dateOfBirth,
        bloodGroup: patientProfile.bloodGroup,
        phoneNumber: patientProfile.phoneNumber,
        address: patientProfile.address,
        profilePhotoUrl: patientProfile.profilePhotoUrl
      });
      console.log('Profile data updated:', response.data);
      toast({
        title: 'Profile updated successfully!',
        description: 'Your changes have been saved.',
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error updating profile',
        description: 'There was an issue saving your changes.',
        variant: 'destructive',
      });
    }
  };

  const handleInputChange = (field, value) => {
    setPatientProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="bg-medical-600 hover:bg-medical-700">
            Edit Profile
          </Button>
        ) : (
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-medical-600 hover:bg-medical-700">
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture and Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="w-32 h-32 mx-auto mb-4 bg-medical-100 rounded-full flex items-center justify-center">
              {patientProfile.profilePhotoUrl ? (
                <img 
                  src={patientProfile.profilePhotoUrl} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <User className="w-16 h-16 text-medical-600" />
              )}
            </div>
            {isEditing && (
              <Button variant="outline" size="sm">
                Change Photo
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2 text-medical-600" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Manage your personal details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={patientProfile.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={patientProfile.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={patientProfile.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={patientProfile.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={patientProfile.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select 
                  value={patientProfile.gender} 
                  onValueChange={(value) => handleInputChange('gender', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Select 
                  value={patientProfile.bloodGroup} 
                  onValueChange={(value) => handleInputChange('bloodGroup', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={patientProfile.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="emergencyContact">Emergency Contact</Label>
              <Input
                id="emergencyContact"
                value={patientProfile.phoneNumber}
                onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Health Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Droplets className="w-5 h-5 mr-2 text-medical-600" />
            Health Summary
          </CardTitle>
          <CardDescription>
            Quick overview of your health information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Droplets className="w-8 h-8 mx-auto mb-2 text-red-500" />
              <p className="text-sm text-gray-600">Blood Group</p>
              <p className="text-xl font-bold text-gray-900">{patientProfile.bloodGroup}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <User className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <p className="text-sm text-gray-600">Age</p>
              <p className="text-xl font-bold text-gray-900">
                {new Date().getFullYear() - new Date(patientProfile.dateOfBirth).getFullYear()}
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Phone className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="text-sm text-gray-600">Emergency Contact</p>
              <p className="text-sm font-medium text-gray-900">{patientProfile.phoneNumber}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientProfile;