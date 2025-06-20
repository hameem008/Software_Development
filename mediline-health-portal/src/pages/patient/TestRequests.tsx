
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TestTube, Calendar, Clock, MapPin, FileText } from 'lucide-react';

const mockTestRequests = [
  {
    id: '1',
    testType: 'Complete Blood Count (CBC)',
    hospital: 'City General Hospital',
    requestedDate: '2024-06-10',
    requestedTime: '10:00 AM',
    status: 'pending',
    submittedDate: '2024-06-02',
    notes: 'Routine checkup requested by Dr. Johnson'
  },
  {
    id: '2',
    testType: 'MRI Scan',
    hospital: 'Advanced Diagnostics Center',
    requestedDate: '2024-06-15',
    requestedTime: '2:30 PM',
    status: 'approved',
    submittedDate: '2024-06-01',
    approvedDate: '2024-06-08',
    finalDate: '2024-06-15',
    finalTime: '2:30 PM'
  },
  {
    id: '3',
    testType: 'X-Ray',
    hospital: 'Metro Health Center',
    requestedDate: '2024-06-05',
    requestedTime: '11:00 AM',
    status: 'completed',
    submittedDate: '2024-05-28',
    approvedDate: '2024-05-30',
    completedDate: '2024-06-05',
    reportAvailable: true
  }
];

const TestRequests = () => {
  const [requests] = useState(mockTestRequests);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">🟡 Pending Approval</Badge>;
      case 'approved':
        return <Badge className="bg-blue-100 text-blue-800">🔵 Approved</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">✅ Completed</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">❌ Rejected</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Test Requests</h1>
          <p className="text-gray-600">Track the status of your test bookings</p>
        </div>
        <Button asChild className="bg-medical-600 hover:bg-medical-700">
          <a href="/patient/tests/request">
            <TestTube className="w-4 h-4 mr-2" />
            Request New Test
          </a>
        </Button>
      </div>

      <div className="space-y-4">
        {requests.length > 0 ? (
          requests.map((request) => (
            <Card key={request.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{request.testType}</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{request.hospital}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>
                          {request.status === 'approved' ? 
                            `Scheduled: ${request.finalDate}` : 
                            `Requested: ${request.requestedDate}`
                          }
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>
                          {request.status === 'approved' ? 
                            request.finalTime : 
                            request.requestedTime
                          }
                        </span>
                      </div>
                      {request.notes && (
                        <p className="text-xs text-gray-500 mt-2">
                          <strong>Notes:</strong> {request.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    {getStatusBadge(request.status)}
                    {request.status === 'completed' && request.reportAvailable && (
                      <Button size="sm" variant="outline">
                        <FileText className="w-3 h-3 mr-1" />
                        View Report
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 border-t pt-3">
                  <div className="flex justify-between">
                    <span>Submitted: {request.submittedDate}</span>
                    {request.status === 'approved' && (
                      <span>Approved: {request.approvedDate}</span>
                    )}
                    {request.status === 'completed' && (
                      <span>Completed: {request.completedDate}</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <TestTube className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No test requests yet</h3>
              <p className="text-gray-600 mb-4">Start by requesting a test from available hospitals</p>
              <Button asChild className="bg-medical-600 hover:bg-medical-700">
                <a href="/patient/tests/request">Request Test</a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TestRequests;
