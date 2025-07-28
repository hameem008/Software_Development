
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, User, X, XCircle, Pill } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import api from '@/lib/api';
const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const { toast } = useToast();

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/doctor/appointment/upcoming');
      const formatted = res.data.map((apt) => ({
        id: apt.appointmentId.toString(),
        patientName: apt.patientName,
        patientId: '', // optional: if needed for history
        date: apt.date,
        time: apt.time.slice(0, 5), // '13:00:00' → '13:00'
        status: 'scheduled',
        reason: '',
        duration: '15 min', // fixed or calculated
        hospital: apt.hospitalName,
        address: apt.hospitalAddress,
        chamber: apt.chamber,
        serialNumber: apt.serialNumber
      }));
      setAppointments(formatted);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

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
    const toCancel = appointments.filter(apt => apt.date === date && apt.status === 'scheduled');
    setAppointments(prev =>
      prev.map(apt =>
        apt.date === date && apt.status === 'scheduled'
          ? { ...apt, status: 'cancelled' }
          : apt
      )
    );
    toast({
      title: "All Appointments Cancelled",
      description: `All ${toCancel.length} appointments on ${date} have been cancelled.`,
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

  const AppointmentCard = ({ appointment, showActions = true }: { appointment: any, showActions?: boolean }) => (
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
              <h3 className="text-lg font-semibold text-gray-900">{appointment.patientName}</h3>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-1 text-medical-600" />
                {appointment.date}
                <Clock className="w-4 h-4 ml-4 mr-1 text-medical-600" />
                {appointment.time}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Hospital: {appointment.hospital} — {appointment.chamber}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-2">
            {getStatusBadge(appointment.status)}

            {showActions && appointment.status === 'scheduled' && (
              <div className="flex space-x-2">
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
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const appointmentsByDate = upcomingAppointments.reduce((acc, apt) => {
    if (!acc[apt.date]) acc[apt.date] = [];
    acc[apt.date].push(apt);
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
                            Are you sure you want to cancel all {dateAppointments.length} appointments on {date}?
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
                {dateAppointments.map((apt) => (
                  <AppointmentCard key={apt.id} appointment={apt} />
                ))}
              </div>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming appointments</h3>
                <p className="text-gray-600">Your schedule is clear</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastAppointments.length > 0 ? (
            pastAppointments.map((apt) => (
              <AppointmentCard key={apt.id} appointment={apt} showActions={false} />
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No past appointments</h3>
                <p className="text-gray-600">Past appointments will appear here</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DoctorAppointments;