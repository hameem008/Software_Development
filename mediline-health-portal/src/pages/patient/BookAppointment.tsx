import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, User, MapPin, Clock, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

interface Hospital {
  hospitalId: number;
  hospitalName: string;
  hospitalLocation: string;
  availableWeekdays: string[];
  consultationFee: number;
}

interface DoctorInfo {
  doctorId: number;
  name: string;
  specialization: string;
  designation: string;
  academicInstitution: string;
  availableWeekdays: string[];
  consultationLocations: Hospital[];
  avatar?: string;
}

interface TimeSlot {
  slotId: number;
  time: string;
  booked: boolean;
}

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [doctor, setDoctor] = useState<DoctorInfo | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [reason, setReason] = useState('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const response = await api.post('/patient/appointment/doctor', {
          doctorId: Number(doctorId),
        });
        setDoctor(response.data);
      } catch (err) {
        console.error('Error fetching doctor info:', err);
      }
    };

    fetchDoctorData();
  }, [doctorId]);

  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!selectedDate || !selectedLocationId || !doctorId) return;

      try {
        const response = await api.post('/patient/appointment/doctor/windows', {
          doctorId: Number(doctorId),
          hospitalId: selectedLocationId,
          date: format(selectedDate, 'yyyy-MM-dd'),
        });
        setTimeSlots(response.data);
      } catch (err) {
        console.error('Error fetching time slots:', err);
        setTimeSlots([]);
      }
    };

    fetchTimeSlots();
  }, [selectedDate, selectedLocationId, doctorId]);

  const today = new Date();
  const maxDate = addDays(today, 30);

  const selectedHospital = doctor?.consultationLocations.find(
    (loc) => loc.hospitalId === selectedLocationId
  );

  const availableDays = selectedHospital?.availableWeekdays || [];

  const isDateDisabled = (date: Date) => {
    const dayName = format(date, 'EEEE');
    return !availableDays.includes(dayName) || date < today;
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime || !selectedHospital) {
      toast({
        title: 'Missing Information',
        description: 'Please select date, time, and location for your appointment.',
        variant: 'destructive',
      });
      return;
    }

    const selectedSlot = timeSlots.find(slot => slot.time === selectedTime && !slot.booked);
    if (!selectedSlot) {
      toast({
        title: 'Invalid Slot',
        description: 'The selected time slot is already booked or unavailable.',
        variant: 'destructive',
      });
      return;
    }

    setIsBooking(true);

    try {
      await api.post('/patient/appointment/book', {
        slotId: selectedSlot.slotId,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
      });

      toast({
        title: 'Appointment Booked Successfully!',
        description: `Your appointment with ${doctor?.name} is confirmed for ${format(
          selectedDate,
          'PPP'
        )} at ${selectedTime} at ${selectedHospital?.hospitalName}.`,
      });

      navigate('/patient/appointments');
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: 'Booking Failed',
        description: 'There was a problem booking your appointment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsBooking(false);
    }
  };

  if (!doctor) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Doctor not found</h2>
        <Button onClick={() => navigate('/patient/doctors')}>Back to Doctor Search</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/patient/doctors/${doctorId}`)}
          className="flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Doctor Info */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Booking Appointment With</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3 mb-4">
              {doctor.avatar ? (
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
              <div>
                <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                <Badge variant="secondary" className="bg-medical-100 text-medical-700">
                  {doctor.specialization}
                </Badge>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                {selectedHospital?.hospitalLocation || 'Select a location'}
              </div>
            </div>

            <div className="mt-4 p-3 bg-medical-50 rounded-lg">
              <p className="text-sm text-medical-700 font-medium">
                Consultation Fee: ${selectedHospital?.consultationFee || 'N/A'}
              </p>
            </div>

            {/* Available Locations */}
            <div className="mt-4">
              <h4 className="font-medium text-gray-900 mb-2">Available Locations</h4>
              <div className="space-y-2 text-sm">
                {doctor.consultationLocations.map((location) => (
                  <div key={location.hospitalId} className="p-2 bg-gray-50 rounded text-gray-700">
                    {location.hospitalName}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Select Location, Date & Time
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Location */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Choose Location</h4>
              <Select
                value={selectedLocationId?.toString()}
                onValueChange={(val) => {
                  setSelectedLocationId(Number(val));
                  setSelectedDate(undefined);
                  setSelectedTime('');
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a location" />
                </SelectTrigger>
                <SelectContent>
                  {doctor.consultationLocations.map((location) => (
                    <SelectItem key={location.hospitalId} value={location.hospitalId.toString()}>
                      {location.hospitalName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            {selectedLocationId && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Choose Date</h4>
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      setSelectedTime('');
                    }}
                    disabled={isDateDisabled}
                    fromDate={today}
                    toDate={maxDate}
                    className="rounded-md border"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2 text-center">
                  Available Days: {availableDays.join(', ')}
                </p>
              </div>
            )}

            {/* Time */}
            {selectedDate && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Choose Time</h4>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot.time}
                      variant={selectedTime === slot.time ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTime(slot.time)}
                      disabled={slot.booked}
                      className={
                        selectedTime === slot.time
                          ? 'bg-medical-600 hover:bg-medical-700'
                          : ''
                      }
                    >
                      {slot.time}
                    </Button>
                  ))}
                </div>
                {timeSlots.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No available time slots for the selected date and location.
                  </p>
                )}
              </div>
            )}

            {/* Reason */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Reason for Visit (Optional)</h4>
              <Textarea
                placeholder="Briefly describe your symptoms or reason for consultation..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>

            {/* Summary */}
            {selectedDate && selectedTime && selectedHospital && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Appointment Summary</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {format(selectedDate, 'PPPP')}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {selectedTime}
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    {doctor.name} - {doctor.specialization}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {selectedHospital.hospitalName}
                  </div>
                </div>
              </div>
            )}

            <Button
              size="lg"
              className="w-full bg-medical-600 hover:bg-medical-700"
              onClick={handleBookAppointment}
              disabled={!selectedDate || !selectedTime || !selectedHospital || isBooking}
            >
              {isBooking ? 'Booking...' : 'Confirm Appointment'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookAppointment;
