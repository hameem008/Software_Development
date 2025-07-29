import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';
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
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [doctorProfile, setDoctorProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/doctor/profiles');
        setDoctorProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const response = await api.post('/doctor/profile/update', doctorProfile);
      toast({
        title: 'Profile updated successfully!',
        description: 'Your changes have been saved.'
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error updating profile',
        description: 'There was an issue saving your changes.',
        variant: 'destructive'
      });
    }
  };

  const handleInputChange = (field, value) => {
    setDoctorProfile(prev => ({ ...prev, [field]: value }));
  };

  if (!doctorProfile) return <div>Loading profile...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your professional information</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="bg-medical-600 hover:bg-medical-700">
            <Edit3 className="w-4 h-4 mr-2" /> Edit Profile
          </Button>
        ) : (
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleSave} className="bg-medical-600 hover:bg-medical-700">
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <Avatar className="w-32 h-32 mx-auto">
                <AvatarImage src={doctorProfile.profilePhotoUrl} alt={doctorProfile.firstName} />
                <AvatarFallback className="text-2xl">
                  {doctorProfile.firstName?.[0] || 'D'}{doctorProfile.lastName?.[0] || ''}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Input
                  placeholder="Profile Photo URL"
                  value={doctorProfile.profilePhotoUrl || ''}
                  onChange={(e) => handleInputChange('profilePhotoUrl', e.target.value)}
                />
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{doctorProfile.firstName} {doctorProfile.lastName}</h2>
                <p className="text-medical-600 font-medium">{doctorProfile.specialization}</p>
              </div>
              {/* <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Active
              </Badge> */}
            </div>
          </CardContent>
        </Card>

        {/* Editable Fields */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2 text-medical-600" /> Personal Information
              </CardTitle>
              <CardDescription>Update your contact and personal info</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={doctorProfile.firstName || ''}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={doctorProfile.lastName || ''}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={doctorProfile.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={doctorProfile.phoneNumber || ''}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={doctorProfile.gender || ''}
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
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={doctorProfile.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <GraduationCap className="w-5 h-5 mr-2 text-medical-600" /> Professional Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Specialization</Label>
                  <Input
                    value={doctorProfile.specialization || ''}
                    onChange={(e) => handleInputChange('specialization', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Designation</Label>
                  <Input
                    value={doctorProfile.designation || ''}
                    onChange={(e) => handleInputChange('designation', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Academic Institution / Bio</Label>
                  <Input
                    value={doctorProfile.academicInstitution || ''}
                    onChange={(e) => handleInputChange('academicInstitution', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
