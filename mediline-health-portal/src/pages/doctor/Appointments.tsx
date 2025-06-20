
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, User, X, XCircle, Pill } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([
    {
      id: '1',
      patientName: 'John Smith',
      patientId: '1',
      date: '2025-06-05',
      time: '10:00 AM',
      status: 'scheduled',
      reason: 'Regular checkup',
      duration: '30 min'
    },
    {
      id: '2',
      patientName: 'Sarah Wilson',
      patientId: '2',
      date: '2025-06-05',
      time: '11:00 AM',
      status: 'scheduled',
      reason: 'Follow-up consultation',
      duration: '45 min'
    },
    {
      id: '3',
      patientName: 'Mike Johnson',
      patientId: '3',
      date: '2025-06-10',
      time: '2:30 PM',
      status: 'scheduled',
      reason: 'Skin consultation',
      duration: '30 min'
    },
    {
      id: '4',
      patientName: 'Emma Davis',
      patientId: '4',
      date: '2025-06-15',
      time: '9:00 AM',
      status: 'scheduled',
      reason: 'Annual checkup',
      duration: '60 min'
    },
    {
      id: '5',
      patientName: 'Robert Brown',
      patientId: '5',
      date: '2025-06-20',
      time: '3:00 PM',
      status: 'scheduled',
      reason: 'Knee evaluation',
      duration: '45 min'
    },
    {
      id: '6',
      patientName: 'Lisa Garcia',
      patientId: '6',
      date: '2024-05-28',
      time: '10:00 AM',
      status: 'completed',
      reason: 'Follow-up visit',
      duration: '30 min'
    }
  ]);

  const { toast } = useToast();
  const today = new Date().toISOString().split('T')[0];
  const upcomingAppointments = appointments.filter(apt => apt.date >= today && apt.status === 'scheduled');
  const pastAppointments = appointments.filter(apt => apt.date < today || apt.status === 'completed');

  const handleCancelAppointment = (appointmentId: string) => {
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
      description: `Appointment with ${appointment?.patientName} has been cancelled.`,
    });
  };

  const handleBulkCancelByDate = (date: string) => {
    const appointmentsToCancel = appointments.filter(apt => apt.date === date && apt.status === 'scheduled');
    
    setAppointments(prev => 
      prev.map(apt => 
        apt.date === date && apt.status === 'scheduled'
          ? { ...apt, status: 'cancelled' }
          : apt
      )
    );
    
    toast({
      title: "All Appointments Cancelled",
      description: `All ${appointmentsToCancel.length} appointments on ${date} have been cancelled.`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-green-100 text-green-800">✅ Scheduled</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">❌ Cancelled</Badge>;
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-800">✅ Completed</Badge>;
      default:
        return null;
    }
  };

  const AppointmentCard = ({ appointment, showActions = true }: { appointment: any, showActions?: boolean }) => {
    return (
      <Card className="mb-4">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-medical-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-medical-600" />
                </div>
              </div>
              
              <div className="flex-1">
                <Link 
                  to={`/doctor/patient/${appointment.patientId}/history`}
                  className="text-lg font-semibold text-gray-900 hover:text-medical-600 transition-colors"
                >
                  {appointment.patientName}
                </Link>
                <p className="text-sm text-gray-600">Patient ID: {appointment.patientId}</p>
                
                <div className="flex items-center space-x-4 mt-3">
                  <div className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 mr-1 text-medical-600" />
                    <span className="font-medium">{appointment.date}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 mr-1 text-medical-600" />
                    <span className="font-medium">{appointment.time}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Duration: {appointment.duration}
                  </div>
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
              
              <div className="flex space-x-2">
                {showActions && appointment.status === 'scheduled' && (
                  <>
                    <Link to={`/doctor/prescriptions/create?patientId=${appointment.patientId}`}>
                      <Button size="sm" className="bg-medical-600 hover:bg-medical-700">
                        <Pill className="w-3 h-3 mr-1" />
                        Prescribe
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          <X className="w-3 h-3 mr-1" />
                          Cancel
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to cancel the appointment with {appointment.patientName} on {appointment.date} at {appointment.time}?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleCancelAppointment(appointment.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Cancel Appointment
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Group appointments by date for bulk cancel feature
  const appointmentsByDate = upcomingAppointments.reduce((acc, appointment) => {
    if (!acc[appointment.date]) {
      acc[appointment.date] = [];
    }
    acc[appointment.date].push(appointment);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
          <p className="text-gray-600">Manage your patient appointments</p>
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming ({upcomingAppointments.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({pastAppointments.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-6">
          {upcomingAppointments.length > 0 ? (
            Object.entries(appointmentsByDate).map(([date, dateAppointments]) => (
              <div key={date} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {new Date(date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                  {dateAppointments.length > 1 && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                          <XCircle className="w-4 h-4 mr-1" />
                          Cancel All ({dateAppointments.length})
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Cancel All Appointments</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to cancel all {dateAppointments.length} appointments on {date}? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Keep Appointments</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleBulkCancelByDate(date)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Cancel All
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
                {dateAppointments.map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))}
              </div>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming appointments</h3>
                <p className="text-gray-600">Your appointment schedule is clear</p>
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
    </div>
  );
};

export default DoctorAppointments;
