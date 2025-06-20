
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, User, Calendar as CalendarIcon, X } from 'lucide-react';
import RescheduleModal from '@/components/patient/RescheduleModal';
import { useToast } from '@/hooks/use-toast';
import { mockDoctors } from '@/data/mockData';

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([
    {
      id: '1',
      doctorId: '2',
      doctorName: 'Dr. Sarah Johnson',
      specialization: 'Cardiology',
      date: '2025-06-05',
      time: '10:00 AM',
      status: 'scheduled',
      hospital: 'City General Hospital',
      reason: 'Regular checkup'
    },
    {
      id: '2',
      doctorId: '3',
      doctorName: 'Dr. Michael Chen',
      specialization: 'Dermatology',
      date: '2025-06-10',
      time: '2:30 PM',
      status: 'scheduled',
      hospital: 'Metro Health Center',
      reason: 'Skin consultation'
    },
    {
      id: '3',
      doctorId: '4',
      doctorName: 'Dr. Emily Rodriguez',
      specialization: 'Pediatrics',
      date: '2025-06-15',
      time: '9:00 AM',
      status: 'scheduled',
      hospital: 'Children\'s Medical Center',
      reason: 'Annual checkup'
    },
    {
      id: '4',
      doctorId: '5',
      doctorName: 'Dr. James Wilson',
      specialization: 'Orthopedics',
      date: '2025-06-20',
      time: '3:00 PM',
      status: 'scheduled',
      hospital: 'Sports Medicine Institute',
      reason: 'Knee evaluation'
    },
    {
      id: '5',
      doctorId: '2',
      doctorName: 'Dr. Sarah Johnson',
      specialization: 'Cardiology',
      date: '2024-05-28',
      time: '10:00 AM',
      status: 'completed',
      hospital: 'City General Hospital',
      reason: 'Follow-up visit'
    }
  ]);

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const { toast } = useToast();

  const today = new Date().toISOString().split('T')[0];
  const upcomingAppointments = appointments.filter(apt => apt.date >= today && apt.status === 'scheduled');
  const pastAppointments = appointments.filter(apt => apt.date < today || apt.status === 'completed');

  const handleReschedule = (appointmentId: string, newDate: string, newTime: string) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: 'pending_reschedule', requestedDate: newDate, requestedTime: newTime }
          : apt
      )
    );
  };

  const handleCancel = (appointmentId: string) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: 'cancelled' }
          : apt
      )
    );
    
    const appointment = appointments.find(apt => apt.id === appointmentId);
    toast({
      title: "Appointment Cancelled",
      description: `Your appointment with ${appointment?.doctorName} has been cancelled.`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-green-100 text-green-800">✅ Confirmed</Badge>;
      case 'pending_reschedule':
        return <Badge className="bg-yellow-100 text-yellow-800">🟡 Reschedule Pending</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">❌ Cancelled</Badge>;
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-800">✅ Completed</Badge>;
      default:
        return null;
    }
  };

  const AppointmentCard = ({ appointment, showActions = true }: { appointment: any, showActions?: boolean }) => {
    const doctor = mockDoctors.find(d => d.id === appointment.doctorId);
    
    return (
      <Card className="mb-4">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {doctor?.avatar ? (
                  <img 
                    src={doctor.avatar} 
                    alt={doctor.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-medical-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-medical-600" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{appointment.doctorName}</h3>
                <p className="text-sm text-gray-600">{appointment.specialization}</p>
                
                <div className="flex items-center space-x-4 mt-3">
                  <div className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 mr-1 text-medical-600" />
                    <span className="font-medium">{appointment.date}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 mr-1 text-medical-600" />
                    <span className="font-medium">{appointment.time}</span>
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-gray-600 mt-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{appointment.hospital}</span>
                </div>
                
                {appointment.reason && (
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Reason:</strong> {appointment.reason}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex flex-col items-end space-y-2">
              {getStatusBadge(appointment.status)}
              
              {showActions && appointment.status === 'scheduled' && (
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedAppointment(appointment);
                      setIsRescheduleModalOpen(true);
                    }}
                  >
                    <CalendarIcon className="w-3 h-3 mr-1" />
                    Reschedule
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleCancel(appointment.id)}
                  >
                    <X className="w-3 h-3 mr-1" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
          <p className="text-gray-600">Manage your healthcare appointments</p>
        </div>
        <Button asChild className="bg-medical-600 hover:bg-medical-700">
          <a href="/patient/doctors">Book New Appointment</a>
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming ({upcomingAppointments.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({pastAppointments.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4">
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming appointments</h3>
                <p className="text-gray-600 mb-4">Book an appointment with your preferred doctor</p>
                <Button asChild className="bg-medical-600 hover:bg-medical-700">
                  <a href="/patient/doctors">Find Doctors</a>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="past" className="space-y-4">
          {pastAppointments.length > 0 ? (
            pastAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} showActions={false} />
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No past appointments</h3>
                <p className="text-gray-600">Your appointment history will appear here</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <RescheduleModal
        isOpen={isRescheduleModalOpen}
        onClose={() => setIsRescheduleModalOpen(false)}
        appointment={selectedAppointment}
        onReschedule={handleReschedule}
      />
    </div>
  );
};

export default PatientAppointments;
