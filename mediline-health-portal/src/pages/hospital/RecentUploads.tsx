
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { mockTestResults, mockPatients } from '@/data/mockData';
import { Search, FileText, User, Calendar, Download, TestTube } from 'lucide-react';

const RecentUploads = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredUploads = mockTestResults.filter(test => {
    const patient = mockPatients.find(p => p.id === test.patientId);
    return (
      test.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleDownloadReport = (testId: string) => {
    console.log('Downloading report for test:', testId);
  };

  const handleEditTest = (testId: string) => {
    console.log('Editing test:', testId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Recent Uploads</h1>
          <p className="text-gray-600">View and manage uploaded test results</p>
        </div>
        <Button className="bg-medical-600 hover:bg-medical-700">
          Upload New Test
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="w-5 h-5 mr-2 text-medical-600" />
            Search Uploads
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search by test name or patient name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      {/* Uploads List */}
      <div className="space-y-4">
        {filteredUploads.length > 0 ? (
          filteredUploads.map((test) => {
            const patient = mockPatients.find(p => p.id === test.patientId);
            
            return (
              <Card key={test.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-medical-100 rounded-full flex items-center justify-center">
                          <TestTube className="w-6 h-6 text-medical-600" />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{test.testName}</h3>
                          <Badge 
                            variant={test.status === 'completed' ? 'default' : 'secondary'}
                            className={test.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                          >
                            {test.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <User className="w-4 h-4 mr-2" />
                            <span className="font-medium">Patient:</span>
                            <span className="ml-1">{patient?.name}</span>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span className="font-medium">Date:</span>
                            <span className="ml-1">{test.date}</span>
                          </div>
                          
                          <div className="text-sm text-gray-700">
                            <span className="font-medium">Result:</span>
                            <span className="ml-1">{test.result}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      {test.reportUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadReport(test.id)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditTest(test.id)}
                      >
                        Edit
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
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No matching uploads found' : 'No uploads yet'}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm 
                  ? 'Try adjusting your search criteria' 
                  : 'Upload your first test result to get started'
                }
              </p>
              {!searchTerm && (
                <Button className="bg-medical-600 hover:bg-medical-700">
                  Upload Test Results
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Statistics</CardTitle>
          <CardDescription>Overview of your uploaded test results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{filteredUploads.length}</div>
              <div className="text-sm text-gray-600">Total Uploads</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {filteredUploads.filter(test => test.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {filteredUploads.filter(test => test.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecentUploads;
