
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { mockPatients, mockTestResults } from '@/data/mockData';
import { Search, User, TestTube, Download, Calendar, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TestReview = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [doctorNote, setDoctorNote] = useState('');

  const filteredPatients = mockPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPatientTests = (patientId: string) => {
    return mockTestResults.filter(test => test.patientId === patientId);
  };

  const getParameterColor = (isNormal: boolean) => {
    return isNormal ? 'text-green-600' : 'text-red-600';
  };

  const handleAddNote = (testId: string) => {
    if (!doctorNote.trim()) {
      toast({
        title: 'Please enter a note',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Note added successfully',
      description: 'Your note has been added to the test result.',
    });
    setDoctorNote('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Results Review</h1>
        <p className="text-gray-600">Review and interpret patient test results</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Search */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="w-5 h-5 mr-2 text-medical-600" />
              Select Patient
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedPatient?.id === patient.id 
                        ? 'bg-medical-50 border-medical-200' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedPatient(patient)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {patient.avatar ? (
                          <img 
                            src={patient.avatar} 
                            alt={patient.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-medical-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-medical-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{patient.name}</p>
                        <p className="text-xs text-gray-500 truncate">{patient.email}</p>
                        <p className="text-xs text-gray-500">
                          Age: {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredPatients.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No patients found</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        <div className="lg:col-span-2">
          {selectedPatient ? (
            <div className="space-y-6">
              {/* Patient Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2 text-medical-600" />
                    {selectedPatient.name} - Test Results
                  </CardTitle>
                  <CardDescription>
                    Blood Group: {selectedPatient.bloodGroup} | 
                    Age: {new Date().getFullYear() - new Date(selectedPatient.dateOfBirth).getFullYear()}
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Test Results */}
              {getPatientTests(selectedPatient.id).length > 0 ? (
                <div className="space-y-4">
                  {getPatientTests(selectedPatient.id).map((test) => (
                    <Card key={test.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="flex items-center">
                              <TestTube className="w-5 h-5 mr-2 text-medical-600" />
                              {test.testName}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              <div className="flex items-center space-x-4 text-sm">
                                <span className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {test.date}
                                </span>
                                <span>Performed by: {test.performedBy}</span>
                              </div>
                            </CardDescription>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant={test.status === 'completed' ? 'default' : 'secondary'}
                              className={test.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                            >
                              {test.status}
                            </Badge>
                            <Badge variant="outline">{test.testType}</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Result Summary:</p>
                            <p className="text-gray-900">{test.result}</p>
                          </div>

                          {test.parameters && test.parameters.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">Detailed Parameters:</p>
                              <div className="overflow-x-auto">
                                <table className="w-full text-sm border rounded-lg">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th className="text-left py-2 px-3 border-b">Parameter</th>
                                      <th className="text-left py-2 px-3 border-b">Value</th>
                                      <th className="text-left py-2 px-3 border-b">Unit</th>
                                      <th className="text-left py-2 px-3 border-b">Normal Range</th>
                                      <th className="text-left py-2 px-3 border-b">Status</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {test.parameters.map((param, index) => (
                                      <tr key={index} className={!param.isNormal ? 'bg-red-50' : ''}>
                                        <td className="py-2 px-3 font-medium border-b">{param.name}</td>
                                        <td className={`py-2 px-3 font-medium border-b ${getParameterColor(param.isNormal)}`}>
                                          {param.value}
                                        </td>
                                        <td className="py-2 px-3 text-gray-600 border-b">{param.unit}</td>
                                        <td className="py-2 px-3 text-gray-600 border-b">{param.normalRange}</td>
                                        <td className="py-2 px-3 border-b">
                                          {param.isNormal ? (
                                            <span className="text-green-600 font-medium">Normal</span>
                                          ) : (
                                            <span className="text-red-600 font-medium">Abnormal ⚠️</span>
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          {test.notes && (
                            <div>
                              <p className="text-sm font-medium text-gray-700">Lab Notes:</p>
                              <p className="text-gray-600">{test.notes}</p>
                            </div>
                          )}

                          {/* Doctor's Note Section */}
                          <div className="border-t pt-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Add Doctor's Note:</p>
                            <div className="space-y-2">
                              <Textarea
                                placeholder="Add your interpretation or notes about this test result..."
                                value={doctorNote}
                                onChange={(e) => setDoctorNote(e.target.value)}
                                className="min-h-[80px]"
                              />
                              <Button 
                                size="sm" 
                                onClick={() => handleAddNote(test.id)}
                                className="bg-medical-600 hover:bg-medical-700"
                              >
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Add Note
                              </Button>
                            </div>
                          </div>

                          <div className="flex space-x-3 pt-2">
                            {test.reportUrl && (
                              <Button size="sm" variant="outline">
                                <Download className="w-4 h-4 mr-2" />
                                Download Report
                              </Button>
                            )}
                            <Button size="sm" variant="outline">
                              Share with Patient
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <TestTube className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No test results found</h3>
                    <p className="text-gray-600">This patient has no test results available</p>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Patient</h3>
                <p className="text-gray-600">Choose a patient from the left to view their test results</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestReview;
