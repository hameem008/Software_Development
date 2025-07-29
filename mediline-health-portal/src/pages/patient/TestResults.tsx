import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle , CardDescription} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {TestTube, Calendar, MapPin, FileText, User} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import api from '@/lib/api';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';


interface Test {
  id: number;
  name: string;
}


const TestResults = () => {
  const [testSummaries, setTestSummaries] = useState([]);
  const [expandedTestId, setExpandedTestId] = useState<number | null>(null);
  const [testDetailsMap, setTestDetailsMap] = useState<{ [id: number]: any }>({});
  const [testOptions, setTestOptions] = useState<Test[]>([]);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    testId: 0
  });


  const fetchAllPerformedTests = async () => {
    try {
      const response = await api.get('/patient/history/test-names');
      setTestOptions(response.data);
    } catch (error) {
      console.error('Error fetching diseases:', error);
    }
  };

  useEffect(() => {
      fetchAllPerformedTests().then(r => {
        console.log('Test options fetched:', r);
      });
  }, []);

  const fetchTestSummaries = async () => {
    try {
      // const response = await api.get('/patient/history/all-performed-tests');
      const response = await api.post('/patient/history/all-performed-tests', {
          dateFrom: filters.dateFrom || undefined,
          dateTo: filters.dateTo || undefined,
          testId: filters.testId!== 0 ? filters.testId : undefined
      });
      setTestSummaries(response.data);
    } catch (err) {
      console.error('Failed to fetch test summaries:', err);
    }
  };

  const fetchTestDetail = async (performedTestId: number) => {
    if (testDetailsMap[performedTestId]) return;

    try {
      const res = await api.post('/patient/history/test-result', { performedTestId });
      setTestDetailsMap(prev => ({ ...prev, [performedTestId]: res.data }));
    } catch (err) {
      console.error('Failed to fetch test detail:', err);
    }
  };

  const toggleExpanded = (performedTestId: number) => {
    if (expandedTestId === performedTestId) {
      setExpandedTestId(null);
    } else {
      setExpandedTestId(performedTestId);
      fetchTestDetail(performedTestId);
    }
  };

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      testId: 0
    });
    fetchTestSummaries().then(r => {
      console.log('Filters cleared and test summaries fetched');
    });
  };

  useEffect(() => {
    fetchTestSummaries().then(r => {
        console.log('Test summaries fetched with filters:', filters);
    });
  }, [filters]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Test Results</h1>
        <p className="text-gray-600">Review completed medical test reports</p>
      </div>

      <Card className="p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* From Date */}
          <div className="space-y-2">
            <Label htmlFor="fromDate">From Date</Label>
            <Input
              id="fromDate"
              max={new Date().toISOString().split('T')[0]}
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            />
          </div>

          {/* To Date */}
          <div className="space-y-2">
            <Label htmlFor="toDate">To Date</Label>
            <Input
              id="toDate"
              max={new Date().toISOString().split('T')[0]}
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            />
          </div>

          {/* Test Type */}
          <div className="space-y-2">
            <Label>Test Name</Label>
            <Select
                value={filters.testId.toString()}
                onValueChange={(value) => handleFilterChange('testId', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Doctor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">All</SelectItem>
                  {testOptions.map((test) => (
                    <SelectItem key={test.id} value={test.id.toString()}>
                      {test.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
          </div>
        {/* Clear Filters */}
        <div className="flex items-end justify-end space-x-2 mt-4 md:mt-0">
          {/*<Label>Test Name</Label>*/}
          <Button onClick={clearFilters} >
            Clear All Filters
          </Button>
        </div>
        </div>
      </Card>

      <div className="space-y-4">
        {testSummaries.length > 0 ? (
          testSummaries.map((test) => {
            const isExpanded = expandedTestId === test.performedTestId;
            const detail = testDetailsMap[test.performedTestId];

            return (
              <Card
                key={test.performedTestId}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader
                  onClick={() => toggleExpanded(test.performedTestId)}
                  className="cursor-pointer"
                >
                  <div
                      data-testid={`test-card-${test.performedTestId}`}
                      className="flex items-start justify-between"
                  >
                    <div>
                      <CardTitle className="text-lg flex items-center">
                        <TestTube className="w-5 h-5 mr-2 text-medical-600" />
                        {test.name}
                      </CardTitle>
                      <CardDescription className="mt-1 space-y-1 text-sm text-gray-600">
                        <div data-testid="test-date"
                            className="flex items-center"
                        >
                          <Calendar className="w-4 h-4 mr-1" />
                          {test.date}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {test.hospital.name}
                        </div>
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge variant="outline">Completed</Badge>
                      <Button size="sm" variant="outline">
                        <FileText className="w-4 h-4 mr-1" />
                        View Report
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {isExpanded && detail && (
                <CardContent className="space-y-6 border-t pt-6 bg-gray-50">
                  {/* Doctor Info Section */}
                  <div className="space-y-3">
                    <h4 className="flex items-center text-lg font-semibold text-gray-800">
                      <User className="w-5 h-5 mr-2 text-medical-600" />
                      Doctor Information
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-sm">
                        <span className="font-semibold text-blue-950 px-2 py-1">Ordered By:</span>{' '}
                        {detail.orderedBy?.name
                          ? `${detail.orderedBy.name} (${detail.orderedBy?.specialization || 'N/A'})`
                          : 'N/A'}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold text-blue-950 px-2 py-1">Performed By:</span>{' '}
                        {detail.performedBy?.name || 'N/A'}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold text-blue-950 px-2 py-1">Reviewed By:</span>{' '}
                        {detail.reviewedBy?.name || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Test Parameters Section */}
                  {detail.results?.length > 0 ? (
                    <div className="space-y-3">
                      <h4 className="flex items-center text-lg font-semibold text-gray-800">
                        <TestTube className="w-5 h-5 mr-2 text-medical-600" />
                        Test Parameters
                      </h4>
                      <div className="overflow-x-auto rounded-lg shadow-sm">
                        <table className="w-full text-sm border border-gray-200">
                          <thead>
                            <tr className="bg-medical-100 text-gray-800 font-medium">
                              <th className="py-3 px-4 text-left">Parameter</th>
                              <th className="py-3 px-4 text-left">Value</th>
                              <th className="py-3 px-4 text-left">Unit</th>
                              <th className="py-3 px-4 text-left">Ideal Male Range</th>
                              <th className="py-3 px-4 text-left">Ideal Female Range</th>
                              <th className="py-3 px-4 text-left">Ideal Child Range</th>
                            </tr>
                          </thead>
                          <tbody>
                            {detail.results.map((r, i) => (
                              <tr
                                key={i}
                                className={`border-b border-gray-200 ${
                                  i % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                } hover:bg-gray-100 transition-colors`}
                              >
                                <td className="py-3 px-4 font-medium text-gray-900">{r.name || 'N/A'}</td>
                                <td className="py-3 px-4">{r.value || 'N/A'}</td>
                                <td className="py-3 px-4">{r.unit || '-'}</td>
                                <td className="py-3 px-4 text-gray-600">{r.idealMaleRange || 'N/A'}</td>
                                <td className="py-3 px-4 text-gray-600">{r.idealFemaleRange || 'N/A'}</td>
                                <td className="py-3 px-4 text-gray-600">{r.idealChildRange || 'N/A'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <p className="text-sm">No test parameters available</p>
                    </div>
                  )}

                  {/* Notes Section */}
                  {detail.notes ? (
                    <div className="space-y-3">
                      <h4 className="flex items-center text-lg font-semibold text-gray-800">
                        <FileText className="w-5 h-5 mr-2 text-medical-600" />
                        Test Result Notes
                      </h4>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-700">{detail.notes}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <p className="text-sm">No doctor notes available</p>
                    </div>
                  )}
                </CardContent>
              )}
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <TestTube className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No test results yet</h3>
              <p className="text-gray-600">Your test results will appear here when available</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TestResults;