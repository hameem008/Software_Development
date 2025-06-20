
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { mockAppointments, mockPatients, mockPrescriptions } from '@/data/mockData';
import { Calendar, Clock, User, FileText, Users, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';

const DoctorOverview = () => {
  const { user } = useAuth();

  // Get today's appointments
  const today = new Date().toISOString().split('T')[0];
  const todaysAppointments = mockAppointments
    .filter(apt => apt.doctorId === user?.id && apt.date >= today)
    .slice(0, 3);

  // Get recent prescriptions written by this doctor
  const recentPrescriptions = mockPrescriptions
    .filter(presc => presc.doctorId === user?.id)
    .slice(0, 3);

  const stats = {
    todaysAppointments: todaysAppointments.length,
    totalPatients: mockPatients.length,
    prescriptionsThisWeek: recentPrescriptions.length,
    upcomingAppointments: todaysAppointments.filter(apt => apt.status === 'scheduled').length
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-medical-600 to-medical-700 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Good morning, {user?.name}!</h1>
        <p className="text-medical-100">Here's your practice overview for today</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.todaysAppointments}</p>
              </div>
              <Calendar className="h-8 w-8 text-medical-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
              </div>
              <Users className="h-8 w-8 text-medical-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Prescriptions This Week</p>
                <p className="text-2xl font-bold text-gray-900">{stats.prescriptionsThisWeek}</p>
              </div>
              <FileText className="h-8 w-8 text-medical-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">{stats.upcomingAppointments}</p>
              </div>
              <Clock className="h-8 w-8 text-medical-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Today's Appointments</CardTitle>
            <Link to="/doctor/appointments">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {todaysAppointments.length > 0 ? (
              todaysAppointments.map((appointment) => {
                const patient = mockPatients.find(p => p.id === appointment.patientId);
                return (
                  <div key={appointment.id} className="flex items-center space-x-4 p-3 rounded-lg border">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-medical-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-medical-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{patient?.name}</p>
                      <p className="text-sm text-gray-500">Age: {patient ? new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear() : 'N/A'}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {appointment.time}
                        </span>
                        {appointment.reason && (
                          <span>{appointment.reason}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        View History
                      </Button>
                      <Button size="sm" className="bg-medical-600 hover:bg-medical-700">
                        Start Visit
                      </Button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No appointments scheduled for today</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <Link to="/doctor/prescriptions">
                <Button variant="outline" className="w-full justify-start h-auto py-3">
                  <FileText className="w-5 h-5 mr-3 text-medical-600" />
                  <div className="text-left">
                    <div className="font-medium">Write Prescription</div>
                    <div className="text-xs text-gray-500">Create new prescription for patient</div>
                  </div>
                </Button>
              </Link>
              
              <Link to="/doctor/patients">
                <Button variant="outline" className="w-full justify-start h-auto py-3">
                  <Users className="w-5 h-5 mr-3 text-medical-600" />
                  <div className="text-left">
                    <div className="font-medium">Patient History</div>
                    <div className="text-xs text-gray-500">View patient medical records</div>
                  </div>
                </Button>
              </Link>
              
              <Link to="/doctor/appointments">
                <Button variant="outline" className="w-full justify-start h-auto py-3">
                  <Calendar className="w-5 h-5 mr-3 text-medical-600" />
                  <div className="text-left">
                    <div className="font-medium">Manage Schedule</div>
                    <div className="text-xs text-gray-500">View and manage appointments</div>
                  </div>
                </Button>
              </Link>
              
              <Button variant="outline" className="w-full justify-start h-auto py-3">
                <Stethoscope className="w-5 h-5 mr-3 text-medical-600" />
                <div className="text-left">
                  <div className="font-medium">Patient Search</div>
                  <div className="text-xs text-gray-500">Find patient records quickly</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Prescriptions</CardTitle>
          <CardDescription>
            Latest prescriptions you've written
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentPrescriptions.length > 0 ? (
            <div className="space-y-3">
              {recentPrescriptions.map((prescription) => {
                const patient = mockPatients.find(p => p.id === prescription.patientId);
                return (
                  <div key={prescription.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-medical-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-medical-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{patient?.name}</p>
                        <p className="text-xs text-gray-500">{prescription.diagnosis}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{prescription.date}</p>
                      <Badge variant="secondary" className="text-xs">
                        {prescription.medications.length} medications
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No recent prescriptions</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorOverview;
