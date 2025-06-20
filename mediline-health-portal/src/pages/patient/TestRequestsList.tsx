
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TestTube, Calendar, Clock, MapPin, FileText, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Link } from 'react-router-dom';

const mockTestRequestsList = [
  {
    id: '1',
    testType: 'Complete Blood Count (CBC)',
    hospital: 'City General Hospital',
    hospitalAddress: '456 Hospital Ave, Springfield, IL',
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
    hospitalAddress: '321 Medical Plaza, Springfield, IL',
    requestedDate: '2024-06-15',
    requestedTime: '2:30 PM',
    status: 'accepted',
    submittedDate: '2024-06-01',
    acceptedDate: '2024-06-08',
    finalDate: '2024-06-15',
    finalTime: '2:30 PM',
    sampleStatus: 'waiting_sample'
  },
  {
    id: '3',
    testType: 'X-Ray Chest',
    hospital: 'Metro Health Center',
    hospitalAddress: '789 Health Blvd, Springfield, IL',
    requestedDate: '2024-06-12',
    requestedTime: '11:00 AM',
    status: 'accepted',
    submittedDate: '2024-05-28',
    acceptedDate: '2024-05-30',
    finalDate: '2024-06-12',
    finalTime: '11:00 AM',
    sampleStatus: 'sample_received'
  },
  {
    id: '4',
    testType: 'Blood Sugar Test',
    hospital: 'City General Hospital',
    hospitalAddress: '456 Hospital Ave, Springfield, IL',
    requestedDate: '2024-06-08',
    requestedTime: '9:00 AM',
    status: 'completed',
    submittedDate: '2024-05-25',
    acceptedDate: '2024-05-27',
    completedDate: '2024-06-08',
    finalDate: '2024-06-08',
    finalTime: '9:00 AM',
    reportAvailable: true
  }
];

const TestRequestsList = () => {
  const [requests] = useState(mockTestRequestsList);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const getStatusBadge = (status, sampleStatus) => {
    if (status === 'pending') {
      return <Badge className="bg-yellow-100 text-yellow-800">🟡 Pending Hospital Review</Badge>;
    } else if (status === 'accepted') {
      if (sampleStatus === 'waiting_sample') {
        return <Badge className="bg-blue-100 text-blue-800">🔵 Accepted - Awaiting Sample</Badge>;
      } else if (sampleStatus === 'sample_received') {
        return <Badge className="bg-purple-100 text-purple-800">🟣 Sample Received - Processing</Badge>;
      }
    } else if (status === 'completed') {
      return <Badge className="bg-green-100 text-green-800">✅ Completed</Badge>;
    } else if (status === 'rejected') {
      return <Badge className="bg-red-100 text-red-800">❌ Rejected</Badge>;
    }
    return null;
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Test Requests</h1>
          <p className="text-gray-600">Track the status of your test bookings and appointments</p>
        </div>
        <Button asChild className="bg-medical-600 hover:bg-medical-700">
          <Link to="/patient/tests/request">
            <TestTube className="w-4 h-4 mr-2" />
            Request New Test
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {requests.length > 0 ? (
          requests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
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
                          {request.status === 'accepted' || request.status === 'completed' ? 
                            `Scheduled: ${request.finalDate}` : 
                            `Requested: ${request.requestedDate}`
                          }
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>
                          {request.status === 'accepted' || request.status === 'completed' ? 
                            request.finalTime : 
                            request.requestedTime
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    {getStatusBadge(request.status, request.sampleStatus)}
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewDetails(request)}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View Details
                      </Button>
                      {request.status === 'completed' && request.reportAvailable && (
                        <Button size="sm" variant="outline">
                          <FileText className="w-3 h-3 mr-1" />
                          View Report
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 border-t pt-3">
                  <div className="flex justify-between">
                    <span>Submitted: {request.submittedDate}</span>
                    {request.acceptedDate && (
                      <span>Accepted: {request.acceptedDate}</span>
                    )}
                    {request.completedDate && (
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
                <Link to="/patient/tests/request">Request Test</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Test Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">{selectedRequest.testType}</h4>
                {getStatusBadge(selectedRequest.status, selectedRequest.sampleStatus)}
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Hospital</label>
                  <p className="text-gray-900">{selectedRequest.hospital}</p>
                  <p className="text-sm text-gray-500">{selectedRequest.hospitalAddress}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Date</label>
                    <p className="text-gray-900">
                      {selectedRequest.status === 'accepted' || selectedRequest.status === 'completed' ? 
                        selectedRequest.finalDate : selectedRequest.requestedDate}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Time</label>
                    <p className="text-gray-900">
                      {selectedRequest.status === 'accepted' || selectedRequest.status === 'completed' ? 
                        selectedRequest.finalTime : selectedRequest.requestedTime}
                    </p>
                  </div>
                </div>
                
                {selectedRequest.notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Notes</label>
                    <p className="text-gray-900">{selectedRequest.notes}</p>
                  </div>
                )}
                
                <div className="border-t pt-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Submitted:</span>
                      <p className="text-gray-900">{selectedRequest.submittedDate}</p>
                    </div>
                    {selectedRequest.acceptedDate && (
                      <div>
                        <span className="text-gray-600">Accepted:</span>
                        <p className="text-gray-900">{selectedRequest.acceptedDate}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestRequestsList;
