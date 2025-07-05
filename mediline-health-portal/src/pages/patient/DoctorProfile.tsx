import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import api from '@/lib/api';

import DoctorInfoCard from '@/components/patient/DoctorInfoCard';
import TabsNavigation from '@/components/common/TabsNavigation';
import OverviewTab from '@/components/patient/OverviewTab';
import AvailabilityTab from '@/components/patient/AvailabilityTab';
import ReviewsTab from '@/components/patient/ReviewsTab';


interface Degree {
  degree: string;
  institution: string;
  year: number;
}

interface AvailabilitySlot {
  weekDay: string;
  startTime: string;
  endTime: string;
}

interface MedicalCenter {
  medicalCenterName: string;
  medicalCenterLocation: string;
  availabilitySlots: AvailabilitySlot[];
}

interface Doctor {
  doctorId: number;
  name: string;
  specialization: string;
  designation: string;
  academicInstitution: string;
  degrees: Degree[];
  availableMedCenters: MedicalCenter[];
  rating: number;
  avatar?: string;
}

interface Tab {
  key: string;
  label: string;
}

interface Review {
  patientName: string;
  reviewText: string | null;
  rating: number;
  date: string;
}

interface ScheduleByLocation {
  [key: string]: Array<{ day: string; time: string }>;
}

const DoctorProfile: React.FC = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [scheduleByLocation, setScheduleByLocation] = useState<ScheduleByLocation>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const body = { doctorId: Number(doctorId) };
        const response = await api.post('/patient/find-doctors/details', body);
        const doctorData: Doctor = response.data;
        setDoctor(doctorData);

        const reviewsResponse = await api.post('/patient/find-doctors/details/reviews', body);
        const reviewsData: Review[] = reviewsResponse.data;
        setReviews(reviewsData);

        const groupedSchedule = groupScheduleByLocation(doctorData.availableMedCenters);
        setScheduleByLocation(groupedSchedule);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching doctor details:', error);
        setLoading(false);
      }
    };

    fetchDoctorProfile()
  }, [doctorId]);

  const groupScheduleByLocation = (availableMedCenters: MedicalCenter[]): ScheduleByLocation => {
    return availableMedCenters.reduce((acc, center) => {
      acc[center.medicalCenterName] = center.availabilitySlots.map((slot) => ({
        day: slot.weekDay,
        time: `${slot.startTime} - ${slot.endTime}`,
      }));
      return acc;
    }, {} as ScheduleByLocation);
  };

  const handleBookAppointment = () => {
    navigate(`/patient/book-appointment/${doctor?.doctorId}`);
  };

  const tabs: Tab[] = [
    {
      key: 'overview',
      label: 'Overview'
    },
    {
      key: 'availability',
      label: 'Availability & Locations',
    },
    {
      key: 'reviews',
      label: `Reviews (${reviews.length})`,
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!doctor) {
    return (
      <div className="text-center py-12">
        <h2 className="text-18:16:16-2xl font-bold text-gray-900 mb-2">Doctor not found</h2>
        <Button onClick={() => navigate('/patient/doctors')}>
          Back to Doctor Search
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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

      <DoctorInfoCard
        doctor={doctor}
        reviewCount={reviews.length}
        onBookAppointment={handleBookAppointment}
      />

      <TabsNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'overview' && <OverviewTab doctor={doctor} />}
      {activeTab === 'availability' && <AvailabilityTab scheduleByLocation={scheduleByLocation} />}
      {activeTab === 'reviews' && <ReviewsTab reviews={reviews} />}
    </div>
  );
};

export default DoctorProfile;