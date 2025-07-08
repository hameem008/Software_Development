import React, { useEffect, useState } from 'react';
import {
  Card, CardContent
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, User, Calendar as CalendarIcon, X } from 'lucide-react';
import RescheduleModal from '@/components/patient/RescheduleModal';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';
import { format } from 'date-fns';

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get('/patient/appointment/upcoming');
        const sorted = response.data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setAppointments(sorted);
      } catch (err) {
        console.error('Failed to fetch appointments', err);
      }
    };
    fetchAppointments();
  }, []);

  const today = new Date();
  const upcomingAppointments = appointments.filter(apt => new Date(apt.date) >= today);
  const pastAppointments = appointments.filter(apt => new Date(apt.date) < today);

  const handleCancel = (appointmentId) => {
    setAppointments(prev =>
      prev.filter(apt => apt.appointmentId !== appointmentId)
    );
    const appointment = appointments.find(apt => apt.appointmentId === appointmentId);
    toast({
      title: 'Appointment Cancelled',
      description: `Your appointment with ${appointment?.doctorName} has been removed.`,
    });
  };

  const getStatusBadge = () => (
    <Badge className="bg-green-100 text-green-800">✅ Confirmed</Badge>
  );

  const AppointmentCard = ({ appointment, showActions = true }) => {
    return (
      <Card className="mb-4">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-medical-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-medical-600" />
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{appointment.doctorName}</h3>

                <div className="flex items-center space-x-4 mt-3">
                  <div className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 mr-1 text-medical-600" />
                    <span className="font-medium">{format(new Date(appointment.date), 'PPP')}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 mr-1 text-medical-600" />
                    <span className="font-medium">{format(new Date(`2025-01-01T${appointment.time}`), 'hh:mm a')}</span>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-600 mt-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{appointment.hospitalName}</span>
                </div>

                <div className="text-sm text-gray-600 mt-1">
                  <strong>Chamber:</strong> {appointment.chamber}
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Serial:</strong> {appointment.serialNumber}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-2">
              {getStatusBadge()}
              {showActions && (
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
                    onClick={() => handleCancel(appointment.appointmentId)}
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
              <AppointmentCard key={appointment.appointmentId} appointment={appointment} />
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
              <AppointmentCard
                key={appointment.appointmentId}
                appointment={appointment}
                showActions={false}
              />
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
        onReschedule={(id, newDate, newTime) => {
          toast({
            title: 'Reschedule Requested',
            description: `Requested new time: ${newDate} at ${newTime}`,
          });
        }}
      />
    </div>
  );
};

export default PatientAppointments;
