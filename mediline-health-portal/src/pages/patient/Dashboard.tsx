
import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  Search, 
  User, 
  Heart,
  TestTube,
  Pill,
  ClipboardList
} from 'lucide-react';
import PatientOverview from '@/pages/patient/Overview';
import PatientProfile from '@/pages/patient/Profile';
import DoctorSearch from '@/pages/patient/DoctorSearch';
import DoctorProfile from '@/pages/patient/DoctorProfile';
import BookAppointment from '@/pages/patient/BookAppointment';
import PatientAppointments from '@/pages/patient/Appointments';
import PatientPrescriptions from '@/pages/patient/Prescriptions';
import SymptomTracker from '@/pages/patient/SymptomTracker';
import TestResults from '@/pages/patient/TestResults';
import TestRequest from '@/pages/patient/TestRequest';
import TestRequests from '@/pages/patient/TestRequests';
import TestRequestsList from '@/pages/patient/TestRequestsList';

const PatientDashboard = () => {
  const location = useLocation();

  const navigationItems = [
    { path: '/patient', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/patient/symptoms', icon: Heart, label: 'Symptom Tracker' },
    { path: '/patient/doctors', icon: Search, label: 'Find Doctors' },
    { path: '/patient/appointments', icon: Calendar, label: 'Appointments' },
    { path: '/patient/prescriptions', icon: Pill, label: 'Prescriptions' },
    { path: '/patient/tests', icon: TestTube, label: 'Tests & Results' },
    { path: '/patient/tests/request', icon: TestTube, label: 'Request Test' },
    { path: '/patient/tests/requests-list', icon: ClipboardList, label: 'My Test Requests' },
    { path: '/patient/profile', icon: User, label: 'Profile' },
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const sidebar = (
    <nav className="p-4">
      <div className="space-y-2">
        {navigationItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <Button
              variant={isActive(item.path, item.exact) ? "default" : "ghost"}
              className={`w-full justify-start ${
                isActive(item.path, item.exact) 
                  ? 'bg-medical-600 text-white hover:bg-medical-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        ))}
      </div>
    </nav>
  );

  return (
    <DashboardLayout sidebar={sidebar}>
      <Routes>
        <Route index element={<PatientOverview />} />
        <Route path="profile" element={<PatientProfile />} />
        <Route path="doctors" element={<DoctorSearch />} />
        <Route path="doctors/:doctorId" element={<DoctorProfile />} />
        <Route path="book-appointment/:doctorId" element={<BookAppointment />} />
        <Route path="appointments" element={<PatientAppointments />} />
        <Route path="prescriptions" element={<PatientPrescriptions />} />
        <Route path="symptoms" element={<SymptomTracker />} />
        <Route path="tests" element={<TestResults />} />
        <Route path="tests/request" element={<TestRequest />} />
        <Route path="tests/requests" element={<TestRequests />} />
        <Route path="tests/requests-list" element={<TestRequestsList />} />
      </Routes>
    </DashboardLayout>
  );
};

export default PatientDashboard;
