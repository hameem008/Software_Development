import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Link, useNavigate } from 'react-router-dom';
import { Stethoscope, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

const DoctorRegister = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    gender: '',
    specialization: '',
    designation: '',
    academicInstitution: '',
    phoneNumber: '',
    address: '',
  });

  const specializations = [
    'Allergy and Immunology',
    'Anesthesiology',
    'Cardiology',
    'Dermatology',
    'Endocrinology',
    'Gastroenterology',
    'Gynecology',
    'Hematology',
    'Infectious Disease',
    'Nephrology',
    'Neurology',
    'Oncology',
    'Ophthalmology',
    'Orthopedics',
    'Otolaryngology',
    'Pediatrics',
    'Psychiatry',
    'Pulmonology',
    'Radiology',
    'Urology'
  ].sort();

  const designations = [
    'Assistant Professor',
    'Associate Professor',
    'Consultant',
    'Former Director',
    'Medical Officer',
    'Professor',
    'Senior Consultant'
  ].sort();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic client-side validation
    if (
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.gender ||
      !formData.specialization ||
      !formData.designation ||
      !formData.academicInstitution ||
      !formData.phoneNumber ||
      !formData.address
    ) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    // Validate password and confirmPassword match
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match.',
        variant: 'destructive',
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: 'Error',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return;
    }

    // Validate phone number format (10-15 digits)
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      toast({
        title: 'Error',
        description: 'Please enter a valid phone number (10-15 digits).',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Send POST request to backend
      await api.post('/register/doctor', {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1).toLowerCase(),
        specialization: formData.specialization,
        designation: formData.designation,
        academicInstitution: formData.academicInstitution,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
      });

      toast({
        title: 'Registration Successful!',
        description: 'Your doctor account has been created. Redirecting to login.',
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      toast({
        title: 'Registration Failed',
        description: error.message || 'An error occurred during registration.',
        variant: 'destructive',
      });
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 to-medical-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="flex items-center mb-6">
          <Link to="/" className="flex items-center text-medical-600 hover:text-medical-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 bg-medical-600 rounded-lg flex items-center justify-center">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-medical-700">Doctor Registration</CardTitle>
            <p className="text-gray-600">Join our network of healthcare professionals</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder="1234567890"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gender">Gender *</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="specialization">Specialization *</Label>
                  <Select
                    value={formData.specialization}
                    onValueChange={(value) => handleInputChange('specialization', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      {specializations.map(spec => (
                        <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="designation">Designation *</Label>
                  <Select
                    value={formData.designation}
                    onValueChange={(value) => handleInputChange('designation', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select designation" />
                    </SelectTrigger>
                    <SelectContent>
                      {designations.map(designation => (
                        <SelectItem key={designation} value={designation}>{designation}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="academicInstitution">Academic Institution *</Label>
                  <Input
                    id="academicInstitution"
                    type="text"
                    value={formData.academicInstitution}
                    onChange={(e) => handleInputChange('academicInstitution', e.target.value)}
                    placeholder="e.g., Harvard Medical School"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter your full address"
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-medical-600 hover:bg-medical-700">
                Register as Doctor
              </Button>

              <div className="text-center text-sm text-gray-600 space-y-2">
                <p>Your registration will be reviewed by our admin team.</p>
                <p>
                  Already have an account?{' '}
                  <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorRegister;