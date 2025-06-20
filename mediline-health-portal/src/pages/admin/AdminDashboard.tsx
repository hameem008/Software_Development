
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';
import { Shield, CheckCircle, XCircle, LogOut, Users, Building2, Stethoscope } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PendingRegistration {
  id: string;
  type: 'doctor' | 'hospital';
  name: string;
  email: string;
  licenseId: string;
  status: 'pending' | 'approved' | 'rejected';
  submissionDate: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [registrations, setRegistrations] = useState<PendingRegistration[]>([
    {
      id: '1',
      type: 'doctor',
      name: 'Dr. Zahid Hossain',
      email: 'zahid@abc.com',
      licenseId: 'D12345',
      status: 'pending',
      submissionDate: '2024-06-01'
    },
    {
      id: '2',
      type: 'hospital',
      name: 'MedCare Clinic',
      email: 'info@medcare.com',
      licenseId: 'H00987',
      status: 'pending',
      submissionDate: '2024-06-02'
    },
    {
      id: '3',
      type: 'doctor',
      name: 'Dr. Fatima Rahman',
      email: 'fatima@clinic.com',
      licenseId: 'D67890',
      status: 'pending',
      submissionDate: '2024-06-03'
    },
    {
      id: '4',
      type: 'hospital',
      name: 'City Health Center',
      email: 'admin@cityhealth.com',
      licenseId: 'H01234',
      status: 'approved',
      submissionDate: '2024-05-28'
    },
    {
      id: '5',
      type: 'doctor',
      name: 'Dr. Ahmed Ali',
      email: 'ahmed@medical.com',
      licenseId: 'D11111',
      status: 'approved',
      submissionDate: '2024-05-30'
    }
  ]);

  useEffect(() => {
    // Check if admin is logged in
    const adminSession = localStorage.getItem('admin_session');
    if (!adminSession) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleApprove = (id: string) => {
    setRegistrations(prev => 
      prev.map(reg => 
        reg.id === id ? { ...reg, status: 'approved' as const } : reg
      )
    );
    toast({
      title: "Registration Approved",
      description: "The registration has been approved successfully.",
    });
  };

  const handleReject = (id: string) => {
    setRegistrations(prev => 
      prev.map(reg => 
        reg.id === id ? { ...reg, status: 'rejected' as const } : reg
      )
    );
    toast({
      title: "Registration Rejected",
      description: "The registration has been rejected.",
      variant: "destructive"
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    navigate('/admin');
  };

  const pendingRegistrations = registrations.filter(reg => reg.status === 'pending');
  const approvedRegistrations = registrations.filter(reg => reg.status === 'approved');
  const rejectedRegistrations = registrations.filter(reg => reg.status === 'rejected');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'doctor' ? <Stethoscope className="w-4 h-4" /> : <Building2 className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 bg-red-600 rounded-md flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">MediLine Admin Panel</h1>
              <p className="text-sm text-gray-600">Registration Management System</p>
            </div>
          </div>
          
          <Button onClick={handleLogout} variant="outline" className="flex items-center space-x-2">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{pendingRegistrations.length}</p>
                </div>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Users className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{approvedRegistrations.length}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{rejectedRegistrations.length}</p>
                </div>
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{registrations.length}</p>
                </div>
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Users className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle>Registration Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending" className="space-y-4">
              <TabsList>
                <TabsTrigger value="pending">Pending ({pendingRegistrations.length})</TabsTrigger>
                <TabsTrigger value="approved">Approved ({approvedRegistrations.length})</TabsTrigger>
                <TabsTrigger value="rejected">Rejected ({rejectedRegistrations.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>License ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingRegistrations.map((registration) => (
                      <TableRow key={registration.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(registration.type)}
                            <span className="capitalize">{registration.type}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{registration.name}</TableCell>
                        <TableCell>{registration.email}</TableCell>
                        <TableCell>{registration.licenseId}</TableCell>
                        <TableCell>{registration.submissionDate}</TableCell>
                        <TableCell>{getStatusBadge(registration.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleApprove(registration.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(registration.id)}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="approved" className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>License ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvedRegistrations.map((registration) => (
                      <TableRow key={registration.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(registration.type)}
                            <span className="capitalize">{registration.type}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{registration.name}</TableCell>
                        <TableCell>{registration.email}</TableCell>
                        <TableCell>{registration.licenseId}</TableCell>
                        <TableCell>{registration.submissionDate}</TableCell>
                        <TableCell>{getStatusBadge(registration.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="rejected" className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>License ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rejectedRegistrations.map((registration) => (
                      <TableRow key={registration.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(registration.type)}
                            <span className="capitalize">{registration.type}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{registration.name}</TableCell>
                        <TableCell>{registration.email}</TableCell>
                        <TableCell>{registration.licenseId}</TableCell>
                        <TableCell>{registration.submissionDate}</TableCell>
                        <TableCell>{getStatusBadge(registration.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
