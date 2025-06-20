
import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  TestTube, 
  Upload, 
  Clock, 
  CheckCircle,
  Package,
  FileText
} from 'lucide-react';
import HospitalOverview from '@/pages/hospital/Overview';
import TestUpload from '@/pages/hospital/TestUpload';
import PendingUploads from '@/pages/hospital/PendingUploads';
import RecentUploads from '@/pages/hospital/RecentUploads';
import HospitalTestRequests from '@/pages/hospital/TestRequests';
import SampleManagement from '@/pages/hospital/SampleManagement';

const HospitalDashboard = () => {
  const location = useLocation();

  const navigationItems = [
    { path: '/hospital', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/hospital/test-requests', icon: FileText, label: 'Test Requests' },
    { path: '/hospital/sample-management', icon: Package, label: 'Sample Management' },
    { path: '/hospital/test-upload', icon: Upload, label: 'Upload Results' },
    { path: '/hospital/pending-uploads', icon: Clock, label: 'Pending Uploads' },
    { path: '/hospital/recent-uploads', icon: CheckCircle, label: 'Recent Uploads' },
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
        <Route index element={<HospitalOverview />} />
        <Route path="test-requests" element={<HospitalTestRequests />} />
        <Route path="sample-management" element={<SampleManagement />} />
        <Route path="test-upload" element={<TestUpload />} />
        <Route path="pending-uploads" element={<PendingUploads />} />
        <Route path="recent-uploads" element={<RecentUploads />} />
      </Routes>
    </DashboardLayout>
  );
};

export default HospitalDashboard;
