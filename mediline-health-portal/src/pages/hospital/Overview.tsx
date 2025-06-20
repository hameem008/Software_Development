
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { mockTestResults, mockPatients } from '@/data/mockData';
import { Upload, FileText, Users, TestTube, TrendingUp, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const HospitalOverview = () => {
  const { user } = useAuth();

  // Get recent test uploads
  const recentUploads = mockTestResults
    .filter(test => test.hospitalId === user?.id)
    .slice(0, 5);

  const stats = {
    totalUploads: mockTestResults.filter(test => test.hospitalId === user?.id).length,
    pendingTests: mockTestResults.filter(test => test.status === 'pending').length,
    completedToday: mockTestResults.filter(test => test.date === new Date().toISOString().split('T')[0]).length,
    totalPatients: mockPatients.length
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-medical-600 to-medical-700 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to {user?.name}</h1>
        <p className="text-medical-100">Manage test results and coordinate with healthcare providers</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Uploads</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUploads}</p>
              </div>
              <Upload className="h-8 w-8 text-medical-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Tests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingTests}</p>
              </div>
              <Clock className="h-8 w-8 text-medical-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedToday}</p>
              </div>
              <TestTube className="h-8 w-8 text-medical-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
              </div>
              <Users className="h-8 w-8 text-medical-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Uploads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Recent Test Uploads</CardTitle>
            <Link to="/hospital/uploads">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentUploads.length > 0 ? (
              recentUploads.map((test) => {
                const patient = mockPatients.find(p => p.id === test.patientId);
                return (
                  <div key={test.id} className="flex items-center space-x-4 p-3 rounded-lg border">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-medical-100 rounded-full flex items-center justify-center">
                        <TestTube className="w-5 h-5 text-medical-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{test.testName}</p>
                      <p className="text-sm text-gray-500">{patient?.name}</p>
                      <p className="text-xs text-gray-500">{test.date}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        test.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {test.status}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                <TestTube className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No recent uploads</p>
                <Link to="/hospital/upload">
                  <Button className="mt-2" size="sm">Upload First Test</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <Link to="/hospital/upload">
                <Button variant="outline" className="w-full justify-start h-auto py-4">
                  <Upload className="w-6 h-6 mr-3 text-medical-600" />
                  <div className="text-left">
                    <div className="font-medium">Upload Test Results</div>
                    <div className="text-xs text-gray-500">Upload new patient test reports</div>
                  </div>
                </Button>
              </Link>
              
              <Link to="/hospital/patients">
                <Button variant="outline" className="w-full justify-start h-auto py-4">
                  <Users className="w-6 h-6 mr-3 text-medical-600" />
                  <div className="text-left">
                    <div className="font-medium">Patient Search</div>
                    <div className="text-xs text-gray-500">Find patient records quickly</div>
                  </div>
                </Button>
              </Link>
              
              <Link to="/hospital/uploads">
                <Button variant="outline" className="w-full justify-start h-auto py-4">
                  <FileText className="w-6 h-6 mr-3 text-medical-600" />
                  <div className="text-left">
                    <div className="font-medium">View All Uploads</div>
                    <div className="text-xs text-gray-500">Manage all test uploads</div>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Department Overview</CardTitle>
          <CardDescription>
            Quick overview of hospital departments and services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <TestTube className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-lg font-bold text-blue-600">Laboratory</div>
              <div className="text-sm text-gray-600">Blood Tests, Pathology</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="text-lg font-bold text-green-600">Radiology</div>
              <div className="text-sm text-gray-600">X-Ray, MRI, CT Scan</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <FileText className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <div className="text-lg font-bold text-purple-600">Cardiology</div>
              <div className="text-sm text-gray-600">ECG, Echo, Stress Tests</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Users className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <div className="text-lg font-bold text-orange-600">General</div>
              <div className="text-sm text-gray-600">Routine Checkups</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HospitalOverview;
