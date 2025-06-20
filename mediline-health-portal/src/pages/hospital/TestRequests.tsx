
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { TestTube, User, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TestRequest } from '@/types/testRequest';

const mockIncomingRequests: TestRequest[] = [
  {
    id: '1',
    patientName: 'John Smith',
    patientPhone: '+1 (555) 123-4567',
    testType: 'Complete Blood Count (CBC)',
    requestedDate: '2024-06-10',
    requestedTime: '10:00 AM',
    status: 'pending',
    submittedDate: '2024-06-02',
    notes: 'Routine checkup requested by Dr. Johnson'
  },
  {
    id: '2',
    patientName: 'Sarah Wilson',
    patientPhone: '+1 (555) 987-6543',
    testType: 'X-Ray Chest',
    requestedDate: '2024-06-12',
    requestedTime: '2:00 PM',
    status: 'pending',
    submittedDate: '2024-06-03',
    notes: 'Follow-up after respiratory symptoms'
  },
  {
    id: '3',
    patientName: 'Mike Johnson',
    patientPhone: '+1 (555) 456-7890',
    testType: 'ECG',
    requestedDate: '2024-06-08',
    requestedTime: '11:30 AM',
    status: 'approved',
    submittedDate: '2024-06-01',
    approvedDate: '2024-06-04',
    finalDate: '2024-06-08',
    finalTime: '11:30 AM'
  }
];

const HospitalTestRequests = () => {
  const [requests, setRequests] = useState<TestRequest[]>(mockIncomingRequests);
  const [selectedRequest, setSelectedRequest] = useState<TestRequest | null>(null);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [finalDate, setFinalDate] = useState('');
  const [finalTime, setFinalTime] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const { toast } = useToast();

  const handleApprove = () => {
    if (!finalDate || !finalTime) {
      toast({
        title: "Missing Information",
        description: "Please set the final date and time for the test.",
        variant: "destructive"
      });
      return;
    }

    setRequests(prev => 
      prev.map(req => 
        req.id === selectedRequest?.id 
          ? { 
              ...req, 
              status: 'approved' as const, 
              approvedDate: new Date().toISOString().split('T')[0],
              finalDate,
              finalTime 
            }
          : req
      )
    );

    toast({
      title: "Test Request Approved",
      description: `${selectedRequest?.testType} for ${selectedRequest?.patientName} has been scheduled for ${finalDate} at ${finalTime}.`,
    });

    setIsApprovalModalOpen(false);
    setFinalDate('');
    setFinalTime('');
  };

  const handleReject = (requestId: string, reason: string) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'rejected' as const, rejectionReason: reason }
          : req
      )
    );

    const request = requests.find(r => r.id === requestId);
    toast({
      title: "Test Request Rejected",
      description: `${request?.testType} for ${request?.patientName} has been rejected.`,
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">🟡 Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">✅ Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">❌ Rejected</Badge>;
      default:
        return null;
    }
  };

  const pendingRequests = requests.filter(req => req.status === 'pending');
  const processedRequests = requests.filter(req => req.status !== 'pending');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Requests Management</h1>
        <p className="text-gray-600">Review and manage incoming test booking requests</p>
      </div>

      {/* Pending Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TestTube className="w-5 h-5 mr-2 text-medical-600" />
            Pending Requests ({pendingRequests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingRequests.length > 0 ? (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4 bg-yellow-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900">{request.patientName}</h4>
                        <Badge variant="secondary">{request.testType}</Badge>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          <span>{request.patientPhone}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>Requested: {request.requestedDate}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>Time: {request.requestedTime}</span>
                        </div>
                        {request.notes && (
                          <p className="text-xs text-gray-500 mt-2">
                            <strong>Notes:</strong> {request.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          setSelectedRequest(request);
                          setFinalDate(request.requestedDate);
                          setFinalTime(request.requestedTime);
                          setIsApprovalModalOpen(true);
                        }}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(request.id, 'Slot not available')}
                      >
                        <XCircle className="w-3 h-3 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <TestTube className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No pending test requests</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Processed Requests */}
      {processedRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Processed Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {processedRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900">{request.patientName}</h4>
                        <Badge variant="secondary">{request.testType}</Badge>
                        {getStatusBadge(request.status)}
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        {request.status === 'approved' && (
                          <>
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              <span>Scheduled: {request.finalDate}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              <span>Time: {request.finalTime}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Approval Modal */}
      <Dialog open={isApprovalModalOpen} onOpenChange={setIsApprovalModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Approve Test Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Patient: {selectedRequest?.patientName}</Label>
              <Input value={selectedRequest?.testType || ''} disabled />
            </div>
            <div>
              <Label htmlFor="final-date">Schedule Date</Label>
              <Input
                id="final-date"
                type="date"
                value={finalDate}
                onChange={(e) => setFinalDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <Label htmlFor="final-time">Schedule Time</Label>
              <Input
                id="final-time"
                type="time"
                value={finalTime}
                onChange={(e) => setFinalTime(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleApprove} className="flex-1">Approve & Schedule</Button>
              <Button variant="outline" onClick={() => setIsApprovalModalOpen(false)} className="flex-1">Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HospitalTestRequests;
