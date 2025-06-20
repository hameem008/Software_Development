// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PatientDashboard from "./pages/patient/Dashboard";
import DoctorDashboard from "./pages/doctor/Dashboard";
import MedicalCenterDashboard from "./pages/hospital/Dashboard"; // Updated
import PatientRegister from "./pages/auth/PatientRegister";
import DoctorRegister from "./pages/auth/DoctorRegister";
import HospitalRegister from "./pages/auth/HospitalRegister"; // Updated
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, allowedUserType }: { children: React.ReactNode; allowedUserType: string }) => {
  
  const { user, isLoading } = useAuth();
  console.log('ProtectedRoute: user=', user); // Debug log
  console.log('ProtectedRoute: isLoading=', isLoading); // Debug log

  // If still loading, show a loading state
  // This is important to avoid redirecting before the auth check is complete
  if (isLoading) {
    return <div>Loading authentication...</div>; // or use a spinner component
  }

  if (!user) {
    console.log('No user, redirecting to /');
    return <Navigate to="/" replace />;
  }

  if (user.type !== allowedUserType) {
    console.log(`User type ${user.type} doesn’t match ${allowedUserType}, redirecting to /${user.type}`);
    return <Navigate to={`/${user.type}`} replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      
      {/* Registration Routes */}
      <Route path="/register/patient" element={<PatientRegister />} />
      <Route path="/register/doctor" element={<DoctorRegister />} />
      <Route path="/register/hospital" element={<HospitalRegister />} /> {/* Updated */}
      
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      
      {/* Protected User Routes */}
      <Route 
        path="/patient/*" 
        element={
          <ProtectedRoute allowedUserType="patient">
            <PatientDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/doctor/*" 
        element={
          <ProtectedRoute allowedUserType="doctor">
            <DoctorDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/hospital/*" 
        element={
          <ProtectedRoute allowedUserType="hospital">
            <MedicalCenterDashboard />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;