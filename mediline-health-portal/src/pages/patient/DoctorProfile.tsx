
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { mockDoctors, mockDoctorReviews, mockDoctorAvailability } from '@/data/mockData';
import { ArrowLeft, MapPin, Star, Clock, DollarSign, User, GraduationCap, Calendar } from 'lucide-react';

const DoctorProfile = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const doctor = mockDoctors.find(d => d.id === doctorId);
  const reviews = mockDoctorReviews[doctorId as keyof typeof mockDoctorReviews] || [];
  const doctorSchedule = mockDoctorAvailability[doctorId as keyof typeof mockDoctorAvailability] || [];

  if (!doctor) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Doctor not found</h2>
        <Button onClick={() => navigate('/patient/doctors')}>
          Back to Doctor Search
        </Button>
      </div>
    );
  }

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const handleBookAppointment = () => {
    navigate(`/patient/book-appointment/${doctor.id}`);
  };

  // Group schedule by location
  const scheduleByLocation = doctorSchedule.reduce((acc, schedule) => {
    if (!acc[schedule.location]) {
      acc[schedule.location] = [];
    }
    acc[schedule.location].push(schedule);
    return acc;
  }, {} as Record<string, typeof doctorSchedule>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/patient/doctors')}
          className="flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Search
        </Button>
      </div>

      {/* Doctor Info Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              {doctor.avatar ? (
                <img 
                  src={doctor.avatar} 
                  alt={doctor.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-medical-100 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-medical-600" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{doctor.name}</h1>
                  <Badge variant="secondary" className="bg-medical-100 text-medical-700 mb-3">
                    {doctor.specialization}
                  </Badge>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <GraduationCap className="w-4 h-4 mr-2" />
                      {doctor.degree}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {doctor.hospital}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      {doctor.experience} years experience
                    </div>
                    <div className="flex items-center text-gray-900 font-medium">
                      <DollarSign className="w-4 h-4 mr-2" />
                      ${doctor.consultationFee} consultation fee
                    </div>
                  </div>
                  
                  <div className="flex items-center mt-4">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="ml-1 text-lg font-medium">{averageRating}</span>
                    <span className="ml-2 text-gray-600">({reviews.length} reviews)</span>
                  </div>
                </div>
                
                <Button 
                  size="lg"
                  className="bg-medical-600 hover:bg-medical-700"
                  onClick={handleBookAppointment}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Appointment
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-medical-600 text-medical-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('availability')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'availability'
                ? 'border-medical-600 text-medical-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Availability & Locations
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'reviews'
                ? 'border-medical-600 text-medical-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Reviews ({reviews.length})
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <Card>
          <CardHeader>
            <CardTitle>About Dr. {doctor.name.split(' ')[1]}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600">
                Dr. {doctor.name.split(' ')[1]} is a highly experienced {doctor.specialization.toLowerCase()} specialist 
                with {doctor.experience} years of practice. Currently practicing at {doctor.hospital}, 
                they provide comprehensive care with a focus on patient-centered treatment.
              </p>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Specializations</h4>
                <Badge variant="outline">{doctor.specialization}</Badge>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Education</h4>
                <p className="text-gray-600">{doctor.degree}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'availability' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Schedule & Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(scheduleByLocation).map(([location, schedules]) => (
                  <div key={location} className="border rounded-lg p-4">
                    <div className="flex items-start space-x-3 mb-4">
                      <MapPin className="w-5 h-5 text-medical-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900">{location}</h4>
                        <p className="text-sm text-gray-500">Consultation Center</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {schedules.map((schedule, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-medical-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Calendar className="w-4 h-4 text-medical-600" />
                            <span className="font-medium text-medical-700">{schedule.day}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{schedule.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Booking Information</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Appointments can be booked up to 30 days in advance</li>
                  <li>• Consultation fee: ${doctor.consultationFee}</li>
                  <li>• Please arrive 15 minutes before your scheduled time</li>
                  <li>• Cancellations must be made at least 24 hours in advance</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'reviews' && (
        <Card>
          <CardHeader>
            <CardTitle>Patient Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id}>
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-500" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900">{review.patientName}</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${
                                  i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                      </div>
                    </div>
                    {reviews.indexOf(review) < reviews.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">No reviews yet</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DoctorProfile;
