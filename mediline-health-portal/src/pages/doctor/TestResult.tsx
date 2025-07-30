import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { TestTube, Calendar } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import api from '@/lib/api';

interface TestResultData {
  name: string;
  value: string;
  unit: string;
  idealFemaleRange: string;
  idealMaleRange: string;
  idealChildRange: string;
}

interface Test {
  performedTestId: number;
  name: string;
  date: string;
  orderedBy: {
    doctorId: number;
    name: string;
  };
  results: TestResultData[];
  notes: string;
  performedBy: {
    doctorId: number;
    name: string;
  };
  reviewedBy: {
    doctorId: number;
    name: string;
  };
  hospital: {
    hospitalId: number;
    name: string;
  };
}

const TestResult = () => {
  const { toast } = useToast();
  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const { performedTestId } = location.state || {};

  const fetchTestResult = async () => {
    if (!performedTestId) {
      navigate('/doctor/patients');
      return;
    }

    try {
      const response = await api.post('/doctor/patient-history/test/result', {
        performedTestId: performedTestId,
      });
      setTest(response.data);
    } catch (error) {
      console.error('Error loading test result', error);
      toast({
        title: 'Error',
        description: 'Failed to load test result data.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestResult().then(() => {});
  }, []);

  if (loading) {
    return <p>Loading test result...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Result</h1>
        <p className="text-gray-600">View detailed test result information</p>
      </div>

      {test ? (
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TestTube className="w-5 h-5 mr-2 text-medical-600" />
              {test.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm text-gray-600 flex items-center mt-1">
                  <Calendar className="w-4 h-4 mr-1" />
                  {test.date}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Ordered by: {test.orderedBy.name} (ID: {test.orderedBy.doctorId})
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Performed by: {test.performedBy.name} (ID: {test.performedBy.doctorId})
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Reviewed by: {test.reviewedBy.name} (ID: {test.reviewedBy.doctorId})
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Hospital: {test.hospital.name} (ID: {test.hospital.hospitalId})
                </p>
              </div>
              {/* <Button size="sm" variant="outline">
                Download Report
              </Button> */}
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Results:</p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Ideal Female Range</TableHead>
                    <TableHead>Ideal Male Range</TableHead>
                    <TableHead>Ideal Child Range</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {test.results.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell>{result.name}</TableCell>
                      <TableCell>{result.value}</TableCell>
                      <TableCell>{result.unit}</TableCell>
                      <TableCell>{result.idealFemaleRange}</TableCell>
                      <TableCell>{result.idealMaleRange}</TableCell>
                      <TableCell>{result.idealChildRange}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {test.notes && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700">Notes:</p>
                <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">{test.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <TestTube className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Test Result Found</h3>
            <p className="text-gray-600">No test result data available for this ID</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TestResult;