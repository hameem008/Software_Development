
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { mockPatients, mockPrescriptions, mockDoctors } from '@/data/mockData';
import { Upload, FileText, User, TestTube, Search } from 'lucide-react';
import api from "../../lib/api";

const TestUpload = () => {
  const { toast } = useToast();
  const [selectedPatient, setSelectedPatient] = useState();
  const [selectedPrescription, setSelectedPrescription] = useState(0);
  const [testName, setTestName] = useState(0);
   const [date, setDate] = useState('');
  const [testType, setTestType] = useState();
  const [result, setResult] = useState('');
  const [notes, setNotes] = useState('');
  const [performedBy, setPerformedBy] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parameters, setParameters] = useState([{ name: '', value: '', unit: '', normalRange: '' }]);

  const testTypes = [
    'Pathology',
    'Imaging'
  ];

  const pathologyTests = [
    'Complete Blood Count (CBC)',
    'Lipid Panel',
    'Liver Function Test',
    'Kidney Function Test',
    'Blood Sugar Test',
    'Thyroid Function Test',
    'Urinalysis'
  ];

  const imagingTests = [
    'X-Ray',
    'MRI',
    'CT Scan',
    'Ultrasound',
    'ECG',
    'Endoscopy'
  ];

  const getPatientPrescriptions = (patientId: string) => {
    return mockPrescriptions.filter(presc => presc.patientId === patientId);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!allowedTypes.includes(file.type)) {
        toast({
          title: 'Invalid file type',
          description: 'Please select a PDF, JPEG, or PNG file.',
          variant: 'destructive',
        });
        return;
      }

      if (file.size > maxSize) {
        toast({
          title: 'File too large',
          description: 'Please select a file smaller than 10MB.',
          variant: 'destructive',
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  const addParameter = () => {
    setParameters([...parameters, { name: '', value: '', unit: '', normalRange: '' }]);
  };

  const removeParameter = (index: number) => {
    setParameters(parameters.filter((_, i) => i !== index));
  };

  const updateParameter = (index: number, field: string, value: string) => {
    const updated = parameters.map((param, i) => 
      i === index ? { ...param, [field]: value } : param
    );
    setParameters(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPatient || !testType || !result.trim() || !performedBy) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    try {
        const response = await api.post('/hospital/test-upload', {
          prescriptionId: 5,
          testId: 5,
          date: '2025-06-12',
          note: "its a note",
          suggested: 2,
          reviewed: 3,
          cost: 500,
          hospitalId: 1
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


    // Reset form
    // setSelectedPatient('');
    setSelectedPrescription(5);
    setTestName(10);
    setDate('2025-02-12')
    // setTestType('');
    setResult('');
    setNotes('');
    setPerformedBy('');
    setSelectedFile(null);
    setParameters([{ name: '', value: '', unit: '', normalRange: '' }]);
  };

  const handleInputChange = (field, value) => {
    setSelectedPrescription(value);
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patient">Select Patient *</Label>
                <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a patient" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {mockPatients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name} - {patient.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              

                <div>
                  <Label htmlFor="prescription">Related Prescription (Optional)</Label>
                  <Input
                      id="firstName"
                      value={selectedPrescription}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                  >
                   {/* <SelectContent className="bg-white">
                      {getPatientPrescriptions(selectedPatient).map((prescription) => (
                        <SelectItem key={prescription.id} value={prescription.id}>
                          {prescription.diagnosis} - {prescription.date}
                        </SelectItem>
                      ))}
                    </SelectContent>*/}
                  </Input>
                </div>
            </div>
            
            {selectedPatient && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">Patient Details</p>
                {(() => {
                  const patient = mockPatients.find(p => p.id === selectedPatient);
                  return patient ? (
                    <div className="text-sm text-gray-600 mt-1">
                      <p>Age: {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()}</p>
                      <p>Blood Group: {patient.bloodGroup}</p>
                      <p>Phone: {patient.phone}</p>
                    </div>
                  ) : null;
                })()}
              </div>
            )}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="testType">Test Type *</Label>
                <Select value={testType} onValueChange={setTestType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select test type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {testTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="testName">Test Name *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select test name" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {testType === 'Pathology' && pathologyTests.map((test) => (
                      <SelectItem key={test} value={test}>{test}</SelectItem>
                    ))}
                    {testType === 'Imaging' && imagingTests.map((test) => (
                      <SelectItem key={test} value={test}>{test}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="performedBy">Performed By *</Label>
                <Select value={performedBy} onValueChange={setPerformedBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {mockDoctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.name}>{doctor.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/*<div className="mt-4">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional observations, recommendations, or notes..."
                className="min-h-[80px]"
              />
            </div>*/}
          </CardContent>
        </Card>

        {/* Parameter Inputs for Pathology */}
        {testType === 'Pathology' && (
          <Card>
            <CardHeader>
              <CardTitle>Test Parameters</CardTitle>
              <CardDescription>
                Enter detailed parameter values for pathology tests
              </CardDescription>
            </CardHeader>
            <CardContent>
                {parameters.map((param, index) => (
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div>
                      <Label>Parameter Name</Label>
                      <p className="text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-md px-3 py-2">{param.name || 'N/A'}</p>
                    </div>
                    <div>
                      <Label>Value</Label>
                      <Input
                        placeholder="e.g., 14.2"
                        value={param.value}
                        onChange={(e) => updateParameter(index, 'value', e.target.value)}
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
                        {param.normalRange || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <Label>Ideal Male Range</Label>
                      <p className="text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
                        {param.normalRange || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <Label>Ideal Child Range</Label>
                      <p className="text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-md px-3 py-2">{param.normalRange || 'N/A'}</p>
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
        )}

        {/* File Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="w-5 h-5 mr-2 text-medical-600" />
              Upload Report File
            </CardTitle>
            <CardDescription>
              Upload the test report file (PDF, JPEG, PNG - Max 10MB)
            </CardDescription>
          </CardHeader>
          <CardContent>
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
