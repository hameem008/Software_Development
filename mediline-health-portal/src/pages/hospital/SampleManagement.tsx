
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TestTube, User, Calendar, Clock, CheckCircle, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const mockSampleRequests = [
  {
    id: '1',
    patientName: 'John Smith',
    patientPhone: '+1 (555) 123-4567',
    testType: 'Complete Blood Count (CBC)',
    scheduledDate: '2024-06-10',
    scheduledTime: '10:00 AM',
    status: 'waiting_sample',
    approvedDate: '2024-06-08',
    notes: 'Routine checkup requested by Dr. Johnson'
  },
  {
    id: '2',
    patientName: 'Mike Johnson',
    patientPhone: '+1 (555) 456-7890',
    testType: 'ECG',
    scheduledDate: '2024-06-08',
    scheduledTime: '11:30 AM',
    status: 'waiting_sample',
    approvedDate: '2024-06-04',
    notes: 'Follow-up cardiac assessment'
  },
  {
    id: '3',
    patientName: 'Sarah Wilson',
    patientPhone: '+1 (555) 987-6543',
    testType: 'X-Ray Chest',
    scheduledDate: '2024-06-12',
    scheduledTime: '2:00 PM',
    status: 'sample_received',
    approvedDate: '2024-06-09',
    sampleReceivedDate: '2024-06-12',
    notes: 'Follow-up after respiratory symptoms'
  }
];

const SampleManagement = () => {
  const [requests, setRequests] = useState(mockSampleRequests);
  const { toast } = useToast();

  const handleSampleReceived = (requestId: string) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { 
              ...req, 
              status: 'sample_received' as const,
              sampleReceivedDate: new Date().toISOString().split('T')[0]
            }
          : req
      )
    );

    const request = requests.find(r => r.id === requestId);
    toast({
      title: "Sample Received",
      description: `Sample for ${request?.testType} from ${request?.patientName} has been received and is now pending result upload.`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'waiting_sample':
        return <Badge className="bg-blue-100 text-blue-800">📋 Waiting for Sample</Badge>;
      case 'sample_received':
        return <Badge className="bg-purple-100 text-purple-800">🧪 Sample Received - Processing</Badge>;
      default:
        return null;
    }
  };

  const waitingSampleRequests = requests.filter(req => req.status === 'waiting_sample');
  const sampleReceivedRequests = requests.filter(req => req.status === 'sample_received');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sample Collection Management</h1>
        <p className="text-gray-600">Track sample collection and processing status</p>
      </div>

      {/* Waiting for Sample Collection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="w-5 h-5 mr-2 text-blue-600" />
            Waiting for Sample Collection ({waitingSampleRequests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {waitingSampleRequests.length > 0 ? (
            <div className="space-y-4">
              {waitingSampleRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4 bg-blue-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900">{request.patientName}</h4>
                        <Badge variant="secondary">{request.testType}</Badge>
                        {getStatusBadge(request.status)}
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          <span>{request.patientPhone}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>Scheduled: {request.scheduledDate}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>Time: {request.scheduledTime}</span>
                        </div>
                        {request.notes && (
                          <p className="text-xs text-gray-500 mt-2">
                            <strong>Notes:</strong> {request.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleSampleReceived(request.id)}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Mark Sample Received
                      </Button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 border-t pt-2 mt-3">
                    <span>Approved: {request.approvedDate}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No samples pending collection</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sample Received - Pending Processing */}
      {sampleReceivedRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TestTube className="w-5 h-5 mr-2 text-purple-600" />
              Sample Received - Pending Result Upload ({sampleReceivedRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sampleReceivedRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4 bg-purple-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900">{request.patientName}</h4>
                        <Badge variant="secondary">{request.testType}</Badge>
                        {getStatusBadge(request.status)}
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>Test Date: {request.scheduledDate}</span>
                        </div>
                        <div className="flex items-center">
                          <TestTube className="w-3 h-3 mr-1" />
                          <span>Sample Received: {request.sampleReceivedDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" asChild>
                        <a href="/hospital/test-upload">
                          Upload Results
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SampleManagement;
