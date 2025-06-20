
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, TestTube, Pill, Heart, ArrowRight, Syringe, FileText } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import HealthMetricsCarousel from '@/components/patient/HealthMetricsCarousel';
import DailyMedications from '@/components/patient/DailyMedications';
import api from '@/lib/api';

const PatientOverview = () => {
  const navigate = useNavigate();
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

  const upcomingAppointments = [
    {
      id: '1',
      doctor: 'Dr. Sarah Johnson',
      specialization: 'Cardiology',
      date: '2025-06-05',
      time: '10:00 AM',
      hospital: 'City General Hospital'
    },
    {
      id: '2',
      doctor: 'Dr. Michael Chen',
      specialization: 'Dermatology',
      date: '2025-06-10',
      time: '2:30 PM',
      hospital: 'Metro Health Center'
    },
    {
      id: '3',
      doctor: 'Dr. Emily Rodriguez',
      specialization: 'Pediatrics',
      date: '2025-06-15',
      time: '9:00 AM',
      hospital: 'Children\'s Medical Center'
    }
  ];

  const recentTests = [
    {
      id: '1',
      name: 'Complete Blood Count (CBC)',
      date: '2024-05-30',
      status: 'completed'
    },
    {
      id: '2',
      name: 'Lipid Panel',
      date: '2024-05-30',
      status: 'completed'
    },
    {
      id: '3',
      name: 'MRI Scan',
      date: '2024-06-01',
      status: 'pending'
    }
  ];

  const handleTestClick = (test: any) => {
    if (test.status === 'completed') {
      navigate('/patient/tests');
    } else {
      navigate(`/patient/tests/request?preselected=${encodeURIComponent(test.name)}`);
    }
  };

  // Stats for the top cards
  const nextAppointment = upcomingAppointments[0];
  const activeMedications = 2; // From DailyMedications component
  const pendingTests = recentTests.filter(test => test.status === 'pending').length;
  const healthScore = "Good";

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-medical-600 to-medical-700 text-white p-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {patientProfile?.firstName} {patientProfile?.lastName}!
        </h1>
        <p className="text-teal-100">Here's your health overview for today</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Next Appointment</p>
              <p className="text-xl font-bold text-gray-900">
                {nextAppointment ? `Jun ${new Date(nextAppointment.date).getDate()}` : 'None'}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Syringe className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Medications</p>
              <p className="text-xl font-bold text-gray-900">{activeMedications}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TestTube className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Tests</p>
              <p className="text-xl font-bold text-gray-900">{pendingTests}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Health Score</p>
              <p className="text-xl font-bold text-green-600">{healthScore}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Side by Side Layout - Health Metrics and Medications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Metrics Carousel */}
        <div>
          <HealthMetricsCarousel />
        </div>
        
        {/* Daily Medications */}
        <div>
          <DailyMedications />
        </div>
      </div>

      {/* Bottom Section - Full Width Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-medical-600" />
              Upcoming Appointments
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/patient/appointments">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.slice(0, 2).map((appointment) => (
                <div key={appointment.id} className="border rounded-lg p-4 bg-blue-50">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{appointment.doctor}</h4>
                      <p className="text-sm text-gray-600">{appointment.specialization}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>{appointment.date}</span>
                        <span>{appointment.time}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{appointment.hospital}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Test Results */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <TestTube className="w-5 h-5 mr-2 text-medical-600" />
              Recent Test Results
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/patient/tests">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTests.map((test) => (
                <div 
                  key={test.id} 
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    test.status === 'completed' ? 'bg-green-50 hover:bg-green-100' : 'bg-yellow-50 hover:bg-yellow-100'
                  }`}
                  onClick={() => handleTestClick(test)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{test.name}</h4>
                      <p className="text-sm text-gray-600">Date: {test.date}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {test.status === 'completed' ? (
                        <Badge className="bg-green-100 text-green-800">✅ Available</Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800">⏳ Pending</Badge>
                      )}
                      <Button size="sm" variant="outline">
                        {test.status === 'completed' ? 'View' : 'Request'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="w-5 h-5 mr-2 text-medical-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Button asChild className="h-20 flex-col bg-medical-600 hover:bg-medical-700">
              <Link to="/patient/doctors">
                <Calendar className="w-6 h-6 mb-2" />
                <span>Book Appointment</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link to="/patient/tests/request">
                <TestTube className="w-6 h-6 mb-2" />
                <span>Request Test</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link to="/patient/tests/requests-list">
                <FileText className="w-6 h-6 mb-2" />
                <span>My Test Requests</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link to="/patient/symptoms">
                <Heart className="w-6 h-6 mb-2" />
                <span>Track Symptoms</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link to="/patient/prescriptions">
                <Pill className="w-6 h-6 mb-2" />
                <span>View Prescriptions</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientOverview;
