
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockTestResults, mockDoctors } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { TestTube, Download, Calendar, User, AlertCircle, CheckCircle } from 'lucide-react';

const TestResults = () => {
  const { user } = useAuth();
  const [filterType, setFilterType] = useState('all-types');
  const [filterStatus, setFilterStatus] = useState('all-status');

  const userTestResults = mockTestResults.filter(test => test.patientId === user?.id);

  const filteredResults = userTestResults.filter(test => {
    const matchesType = filterType === 'all-types' || test.testType === filterType;
    const matchesStatus = filterStatus === 'all-status' || test.status === filterStatus;
    return matchesType && matchesStatus;
  });

  const getDoctor = (testResult: any) => {
    return mockDoctors.find(doc => doc.name === testResult.performedBy);
  };

  const getParameterColor = (isNormal: boolean) => {
    return isNormal ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Test Results</h1>
        <p className="text-gray-600">View and download your medical test reports</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Test Types" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all-types">All Test Types</SelectItem>
                  <SelectItem value="Pathology">Pathology</SelectItem>
                  <SelectItem value="Imaging">Imaging</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all-status">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button variant="outline" onClick={() => {
                setFilterType('all-types');
                setFilterStatus('all-status');
              }}>
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <div className="space-y-4">
        {filteredResults.length > 0 ? (
          filteredResults.map((test) => {
            const doctor = getDoctor(test);
            return (
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
                          <span className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {test.performedBy}
                          </span>
                        </div>
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={test.status === 'completed' ? 'default' : 'secondary'}
                        className={test.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {test.status === 'completed' ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <AlertCircle className="w-3 h-3 mr-1" />
                        )}
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
                        <p className="text-sm font-medium text-gray-700 mb-2">Test Parameters:</p>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2">Parameter</th>
                                <th className="text-left py-2">Value</th>
                                <th className="text-left py-2">Unit</th>
                                <th className="text-left py-2">Normal Range</th>
                                <th className="text-left py-2">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {test.parameters.map((param, index) => (
                                <tr key={index} className="border-b">
                                  <td className="py-2 font-medium">{param.name}</td>
                                  <td className={`py-2 font-medium ${getParameterColor(param.isNormal)}`}>
                                    {param.value}
                                  </td>
                                  <td className="py-2 text-gray-600">{param.unit}</td>
                                  <td className="py-2 text-gray-600">{param.normalRange}</td>
                                  <td className="py-2">
                                    {param.isNormal ? (
                                      <span className="text-green-600 font-medium">Normal</span>
                                    ) : (
                                      <span className="text-red-600 font-medium">Abnormal</span>
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
                        <p className="text-sm font-medium text-gray-700">Notes:</p>
                        <p className="text-gray-600">{test.notes}</p>
                      </div>
                    )}

                    <div className="flex space-x-3 pt-2">
                      {test.reportUrl && (
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download Report
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        Share with Doctor
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <TestTube className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No test results found</h3>
              <p className="text-gray-600">Test results will appear here once available</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TestResults;
