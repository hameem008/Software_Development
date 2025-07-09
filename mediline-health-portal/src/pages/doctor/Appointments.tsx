import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle , CardDescription} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TestTube, Calendar, Clock, MapPin, FileText, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

const TestResults = () => {
  const [testSummaries, setTestSummaries] = useState([]);
  const [expandedTestId, setExpandedTestId] = useState<number | null>(null);
  const [testDetailsMap, setTestDetailsMap] = useState<{ [id: number]: any }>({});

  const fetchTestSummaries = async () => {
    try {
      const res = await api.get('/patient/history/all-medical-tests');
      setTestSummaries(res.data);
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

  useEffect(() => {
    fetchTestSummaries();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Test Results</h1>
        <p className="text-gray-600">Review completed medical test reports</p>
      </div>

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
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center">
                        <TestTube className="w-5 h-5 mr-2 text-medical-600" />
                        {test.name}
                      </CardTitle>
                      <CardDescription className="mt-1 space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
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
                  <CardContent className="space-y-4 border-t pt-4">
                    {/* Doctor Info */}
                    <div className="text-sm text-gray-700 space-y-1">
                      <p><strong>Ordered By:</strong> {detail.orderedBy?.name} ({detail.orderedBy?.specialization})</p>
                      <p><strong>Performed By:</strong> {detail.performedBy?.name}</p>
                      <p><strong>Reviewed By:</strong> {detail.reviewedBy?.name}</p>
                      <p><strong>Hospital:</strong> {detail.hospital?.name}</p>
                    </div>

                    {/* Results */}
                    {detail.results?.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Test Parameters</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm border">
                            <thead>
                              <tr className="border-b text-left bg-gray-100">
                                <th className="py-2 px-3">Parameter</th>
                                <th className="py-2 px-3">Value</th>
                                <th className="py-2 px-3">Unit</th>
                                <th className="py-2 px-3">Ideal Range</th>
                              </tr>
                            </thead>
                            <tbody>
                              {detail.results.map((r, i) => (
                                <tr key={i} className="border-b">
                                  <td className="py-2 px-3 font-medium">{r.name}</td>
                                  <td className="py-2 px-3">{r.value}</td>
                                  <td className="py-2 px-3">{r.unit || '-'}</td>
                                  <td className="py-2 px-3 text-gray-500">
                                    {r.idealMaleRange || r.idealFemaleRange || r.idealChildRange || 'N/A'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {detail.notes && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Doctor Notes</h4>
                        <p className="text-gray-700">{detail.notes}</p>
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