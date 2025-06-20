
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, User, Calendar, TestTube, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const mockPendingUploads = [
  {
    id: '1',
    patientName: 'John Smith',
    patientId: '1',
    testType: 'Complete Blood Count (CBC)',
    completedDate: '2024-06-05',
    appointmentTime: '10:00 AM',
    doctorName: 'Dr. Sarah Johnson',
    status: 'completed'
  },
  {
    id: '2',
    patientName: 'Mike Johnson',
    patientId: '2',
    testType: 'ECG',
    completedDate: '2024-06-08',
    appointmentTime: '11:30 AM',
    doctorName: 'Dr. Emily Rodriguez',
    status: 'completed'
  },
  {
    id: '3',
    patientName: 'Sarah Wilson',
    patientId: '3',
    testType: 'X-Ray Chest',
    completedDate: '2024-06-10',
    appointmentTime: '2:00 PM',
    doctorName: 'Dr. Michael Chen',
    status: 'completed'
  }
];

const PendingUploads = () => {
  const [pendingTests, setPendingTests] = useState(mockPendingUploads);
  const { toast } = useToast();

  const handleUploadClick = (testId, patientName, testType) => {
    // Remove from pending list (simulate upload)
    setPendingTests(prev => prev.filter(test => test.id !== testId));
    
    toast({
      title: "Upload Form Opened",
      description: `Opening upload form for ${testType} - ${patientName}. Report will be uploaded to patient's account.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pending Test Uploads</h1>
        <p className="text-gray-600">Tests completed but reports not yet uploaded</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="w-5 h-5 mr-2 text-medical-600" />
            Tests Awaiting Report Upload ({pendingTests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingTests.length > 0 ? (
            <div className="space-y-4">
              {pendingTests.map((test) => (
                <div key={test.id} className="border rounded-lg p-4 bg-blue-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900">{test.patientName}</h4>
                        <Badge variant="secondary">{test.testType}</Badge>
                        <Badge className="bg-orange-100 text-orange-800">📋 Report Pending</Badge>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          <span>Patient ID: {test.patientId}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>Completed: {test.completedDate} at {test.appointmentTime}</span>
                        </div>
                        <div className="flex items-center">
                          <TestTube className="w-3 h-3 mr-1" />
                          <span>Ordered by: {test.doctorName}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Button
                        className="bg-medical-600 hover:bg-medical-700"
                        onClick={() => handleUploadClick(test.id, test.patientName, test.testType)}
                      >
                        <Upload className="w-3 h-3 mr-1" />
                        Upload Report
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>All test reports have been uploaded</p>
              <p className="text-sm mt-2">Great job keeping up with uploads!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {pendingTests.length > 0 && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-yellow-800">
              <Upload className="w-4 h-4" />
              <span className="text-sm font-medium">
                {pendingTests.length} test report(s) pending upload. 
                Please upload reports within 24 hours of test completion.
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PendingUploads;
