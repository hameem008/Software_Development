
import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  Users, 
  User,
  TestTube,
  Pill,
  Clock
} from 'lucide-react';
import DoctorOverview from '@/pages/doctor/Overview';
import DoctorAppointments from '@/pages/doctor/Appointments';
import PatientHistory from '@/pages/doctor/PatientHistory';
import CreatePrescription from '@/pages/doctor/CreatePrescription';
import TestReview from '@/pages/doctor/TestReview';
import DoctorProfile from '@/pages/doctor/Profile';
import DoctorSchedule from '@/pages/doctor/Schedule';
import PatientMedicalHistory from '@/pages/doctor/PatientMedicalHistory';

const DoctorDashboard = () => {
  const location = useLocation();

  const navigationItems = [
    { path: '/doctor', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/doctor/appointments', icon: Calendar, label: 'Appointments' },
    { path: '/doctor/patients', icon: Users, label: 'Patient History' },
    { path: '/doctor/tests', icon: TestTube, label: 'Test Review' },
    { path: '/doctor/prescriptions', icon: Pill, label: 'Prescriptions' },
    { path: '/doctor/schedule', icon: Clock, label: 'My Schedule' },
    { path: '/doctor/profile', icon: User, label: 'My Profile' },
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
        <Route index element={<DoctorOverview />} />
        <Route path="appointments" element={<DoctorAppointments />} />
        <Route path="patients" element={<PatientHistory />} />
        <Route path="tests" element={<TestReview />} />
        <Route path="prescriptions/*" element={<CreatePrescription />} />
        <Route path="schedule" element={<DoctorSchedule />} />
        <Route path="profile" element={<DoctorProfile />} />
        <Route path="patient/:patientId/history" element={<PatientMedicalHistory />} />
        <Route path="patient/:patientId/prescribe" element={<CreatePrescription />} />
      </Routes>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
