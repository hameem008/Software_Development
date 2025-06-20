
import GeneralLoginForm from "@/components/common/GeneralLoginForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Heart, Users, Stethoscope, Building2, UserPlus, Shield, Clock, CheckCircle } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 via-white to-medical-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* <div className="h-12 w-12 bg-gradient-to-br from-medical-600 to-medical-700 rounded-xl flex items-center justify-center shadow-lg">
              <Heart className="h-7 w-7 text-white" />
            </div> */}
            <div className="h-12 w-12 bg-gradient-to-br from-medical-600 to-medical-700 rounded-xl flex items-center justify-center shadow-lg">
              <svg
                className="h-7 w-7"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L4 6V18L12 22L20 18V6L12 2Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 8V16"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 12H16"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-medical-primary">MediLine Health</h1>
              <p className="text-sm text-gray-600">Connecting Healthcare</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
              <UserPlus className="w-4 h-4" />
              <Link to="/register/patient"><span>New here?</span></Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left side - Hero content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Your Health,{" "}
                <span className="bg-gradient-to-r from-medical-600 to-medical-500 bg-clip-text text-transparent">
                  Connected
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
                Seamlessly connect patients, doctors, and hospitals in one comprehensive healthcare platform designed for modern medical care.
              </p>
            </div>

            {/* Quick Access Portals */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Choose Your healthcare role</h3>
              <p className="text-sm text-gray-600">Different interfaces designed for different healthcare roles</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-l-4 border-l-blue-500">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Heart className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Patient Portal</h4>
                    <p className="text-xs text-gray-600 mb-3">Book appointments, manage medical journey</p>
                    <Button asChild size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                      <Link to="/register/patient">Register as Patient</Link>
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-l-4 border-l-green-500">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Stethoscope className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Doctor Portal</h4>
                    <p className="text-xs text-gray-600 mb-3">Manage patients, appointments, medical records</p>
                    <Button asChild size="sm" className="w-full bg-green-600 hover:bg-green-700">
                      <Link to="/register/doctor">Register as Doctor</Link>
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-l-4 border-l-purple-500">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Building2 className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Hospital Portal</h4>
                    <p className="text-xs text-gray-600 mb-3">Upload test results, manage test bookings, coordinate healthcare</p>
                    <Button asChild size="sm" className="w-full bg-purple-600 hover:bg-purple-700">
                      <Link to="/register/hospital">Register as Hospital</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Right side - Login form */}
          <div className="flex justify-center lg:justify-end">
            <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-0">
                <GeneralLoginForm />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Comprehensive Healthcare Management Section */}
        <div className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Healthcare Management
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              MediLine connects all aspects of your healthcare journey in one secure, easy-to-use 
              platform designed for modern medical care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Patient Care */}
            <Card className="p-8 hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Patient Care</h3>
              <p className="text-gray-600 mb-6">
                Comprehensive health tracking and medical history management
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Symptom tracking & health dashboard</li>
                <li>• Find & book doctor appointments</li>
                <li>• View prescriptions & test results</li>
                <li>• Manage medication schedules</li>
              </ul>
            </Card>

            {/* Doctor Network */}
            <Card className="p-8 hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-green-100">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Doctor Network</h3>
              <p className="text-gray-600 mb-6">
                Connect with qualified healthcare professionals in your area
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• View daily appointment schedule</li>
                <li>• Access patient medical history</li>
                <li>• Write digital prescriptions</li>
                <li>• Order tests and view results</li>
              </ul>
            </Card>

            {/* Hospital Integration */}
            <Card className="p-8 hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Hospital Integration</h3>
              <p className="text-gray-600 mb-6">
                Seamless coordination with medical facilities and test centers
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Upload patient test reports</li>
                <li>• Manage lab results & diagnostics</li>
                <li>• Coordinate with doctors</li>
                <li>• Track department activities</li>
              </ul>
            </Card>

            {/* Secure & Private */}
            <Card className="p-8 hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-teal-50 to-teal-100">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Secure & Private</h3>
              <p className="text-gray-600">
                Your medical data is protected with enterprise-grade security
              </p>
            </Card>

            {/* 24/7 Access */}
            <Card className="p-8 hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-orange-50 to-orange-100">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">24/7 Access</h3>
              <p className="text-gray-600">
                Access your health information anytime, anywhere
              </p>
            </Card>

            {/* Verified Providers */}
            <Card className="p-8 hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-indigo-50 to-indigo-100">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Verified Providers</h3>
              <p className="text-gray-600">
                All healthcare providers are verified and licensed professionals
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="h-10 w-10 bg-gradient-to-br from-medical-600 to-medical-700 rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">MediLine Health</h3>
            </div>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Connecting healthcare providers and patients for better health outcomes.
            </p>
          </div>
          
          <div className="text-center text-sm text-gray-400 space-y-2 border-t border-gray-800 pt-8">
            <p>© 2024 MediLine Health. All rights reserved.</p>
            <div className="flex justify-center space-x-4">
              <span className="hover:text-white cursor-pointer">Privacy Policy</span>
              <span className="hover:text-white cursor-pointer">Terms of Service</span>
              <span className="hover:text-white cursor-pointer">Contact Support</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
