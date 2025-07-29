
import React, {useEffect, useState} from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, User, TestTube, Search } from 'lucide-react';

import {Combobox} from "@/components/ui/combobox";
import api from '@/lib/api';

interface Option {
    id: number;
    name: string;
}

interface Test {
  testId: number;
  testName: string;
  suggestedByDoctorId: number;
  suggestedByDoctorName: string;
  parameters: Parameter[];
}

interface Parameter {
    index: number;
    name: string;
    value: string;
    unit: string;
    normalMaleRange: string;
    normalFemaleRange: string;
    normalChildRange: string;
}

interface Patient {
    id: number;
    name: string;
    email: string;
    dateOfBirth: string;
    bloodGroup: string;
    phone: string;
}


const TestUpload = () => {
  const { toast } = useToast();
  const [patient, setPatient] = useState<Patient>();
  const [test, setTest] = useState<Test>();
  const [doctorOptions, setDoctorOptions] = useState<Option[]>({"id": 0, "name": ""});
  const [performedBy, setPerformedBy] = useState<Option>({"id": 0, "name": ""});
  const [reviewedBy, setReviewedBy] = useState<Option>({"id": 0, "name": ""});
  const [notes, setNotes] = useState('');



  const fetchDoctors = async () => {
    console.log('Initiating fetchDoctors...');
    try {
      const response = await api.get('http://localhost:8080/hospital/test/all-doctors');
      console.log('fetchDoctors response:', response.data);
      setDoctorOptions(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw error;
    }
  };

  const fetchTest = async () => {
     console.log(".........  [[[]]]]]]]............................")
      try {
        const response = await api.post('http://localhost:8080/hospital/test/test-params', {
            testRequestId: 1
        });

        const initializedTest: Test = {
          ...response.data,
          parameters: response.data.parameters.map((param: Parameter) => ({
            ...param,
            value: param.value ?? "",
          }))
        };

        setTest(initializedTest);
    } catch (error) {
        console.error('Error fetching test', error);
    }
  };

  const fetchPatient = async () => {
    console.log("......... |||||||||||| ............................")
      try {
        const response = await api.post('http://localhost:8080/hospital/test/patient-info', {
            patientId: 1
        });
        setPatient(response.data);
      } catch (error) {
        console.error('Error fetching patient:', error);
      }
  };



  useEffect(() => {
    console.log('Fetching initial data...');
    fetchTest().then(r => {
        console.log('Test fetched successfully');
    });
    fetchPatient().then(r => {
        console.log('Patient fetched successfully');
    });
    fetchDoctors().then(r => {
        console.log('Fetched successfully');
    });
  }, []);

  const updateParameter = (index: number, value: string) => {
    if (!test) return;

    const updatedParams = [...test.parameters];
    updatedParams[index] = { ...updatedParams[index], ['value']: value };
    setTest({ ...test, parameters: updatedParams });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!test?.parameters.every(p => !!p.value?.trim())) {
        toast({
            title: 'Missing Parameters',
            description: 'Please fill in all parameter values before submitting.',
            variant: 'destructive',
        });

      return;
    }

    try {
        const response = await api.post('/hospital/test/result-upload', {
          requestId: 2,
          note: notes,
          performedDoctorId: performedBy.id,
          reviewedDoctorID: reviewedBy.id,
          resultEntries: test.parameters.map(param => ({
            name: param.name,
            value: param.value,
          }))
        });
        console.log('Profile data updated:', response.data);
        toast({
          title: 'Test updated successfully!',
          description: 'Your changes have been saved.',
        });

      } catch (error) {
        console.error('Error uploading test', error);
        toast({
          title: 'Error uploading test',
          description: 'There was an issue saving your changes.',
          variant: 'destructive',
        });
      }
  };


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Test Results</h1>
        <p className="text-gray-600">Upload patient test results and diagnostic reports</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2 text-medical-600" />
              Patient Information
            </CardTitle>
            <CardDescription>
              Select the patient for these test results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              {patient && (
                <div className="text-sm text-gray-600 mt-1">
                  <p>Name: {patient.name || null}</p>
                  <p>Email: {patient.email || null }</p>
                  <p>Age: {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear() || null}</p>
                  <p>Blood Group: {patient.bloodGroup || null}</p>
                  <p>Phone: {patient.phone || null}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Test Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TestTube className="w-5 h-5 mr-2 text-medical-600" />
              Test Information
            </CardTitle>
            <CardDescription>
              Enter details about the test performed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="testName">Test Name *</Label>
                  {test && (
                    <>
                      <p className="text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
                        {test.testName || 'N/A'}
                      </p>
                    </>
                  )}
              </div>
              <div>
                <Label htmlFor="performedBy">Prescribed By *</Label>
                { test && (
                  <p className="text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
                    {test.suggestedByDoctorName || 'N/A'}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="performedBy">Performed By *</Label>
                { doctorOptions && doctorOptions.length > 0 && (
                  <Combobox
                    options={doctorOptions}
                    selectedId={performedBy.id || null}
                    onChange={(id, name) => setPerformedBy({ id: Number(id), name })}
                    placeholder="Select Performed by doctor"
                  />
                )}
              </div>
              <div>
                <Label htmlFor="performedBy">Reviewed By *</Label>
                { doctorOptions && doctorOptions.length > 0 && (
                <Combobox
                  options={doctorOptions}
                  selectedId={reviewedBy.id || null}
                  onChange={(id, name) => setReviewedBy({ id: Number(id), name })}
                  placeholder="Select Performed by doctor"
                />)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Parameter Inputs for Pathology */}
          <Card>
            <CardHeader>
              <CardTitle>Test Parameters</CardTitle>
              <CardDescription>
                Enter detailed parameter values for pathology tests
              </CardDescription>
            </CardHeader>
            <CardContent>
                {test && test.parameters.map((param, index) => (
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div>
                      <Label>Parameter Name</Label>
                      <p className="text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
                        {param.name || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <Label>Value</Label>
                      <Input
                        placeholder="e.g., 14.2"
                        value={param.value}
                        onChange={(e) => updateParameter(index, e.target.value)}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label>Unit</Label>
                      <p className="text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
                        {param.unit || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <Label>Ideal Female Range</Label>
                      <p className="text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
                        {param.normalFemaleRange || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <Label>Ideal Male Range</Label>
                      <p className="text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
                        {param.normalMaleRange || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <Label>Ideal Child Range</Label>
                      <p className="text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
                        {param.normalChildRange || 'N/A'}
                      </p>
                    </div>
                  </div>
                ))}
              <div className="mt-4">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional observations, recommendations, or notes..."
                className="min-h-[80px]"
              />
            </div>
            </CardContent>
          </Card>
        {/* Submit */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex space-x-4">
              <Button type="submit" className="bg-medical-600 hover:bg-medical-700">
                <Upload className="w-4 h-4 mr-2" />
                Upload Test Results
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default TestUpload;
