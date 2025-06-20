
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

const TestUpload = () => {
  const { toast } = useToast();
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState('');
  const [testName, setTestName] = useState('');
  const [testType, setTestType] = useState('');
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPatient || !testName.trim() || !testType || !result.trim() || !performedBy) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    // Mock upload operation
    toast({
      title: 'Test results uploaded successfully!',
      description: 'The test results have been saved and are now available to the patient and their doctor.',
    });

    // Reset form
    setSelectedPatient('');
    setSelectedPrescription('');
    setTestName('');
    setTestType('');
    setResult('');
    setNotes('');
    setPerformedBy('');
    setSelectedFile(null);
    setParameters([{ name: '', value: '', unit: '', normalRange: '' }]);
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
              
              {selectedPatient && (
                <div>
                  <Label htmlFor="prescription">Related Prescription (Optional)</Label>
                  <Select value={selectedPrescription} onValueChange={setSelectedPrescription}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose related prescription" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {getPatientPrescriptions(selectedPatient).map((prescription) => (
                        <SelectItem key={prescription.id} value={prescription.id}>
                          {prescription.diagnosis} - {prescription.date}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
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
                <Select value={testName} onValueChange={setTestName}>
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
            
            <div className="mt-4">
              <Label htmlFor="result">Test Results *</Label>
              <Textarea
                id="result"
                value={result}
                onChange={(e) => setResult(e.target.value)}
                placeholder="Enter the test results, findings, or measurements..."
                className="min-h-[120px]"
                required
              />
            </div>
            
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
              <div className="space-y-4">
                {parameters.map((param, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div>
                      <Label>Parameter Name</Label>
                      <Input
                        placeholder="e.g., Hemoglobin"
                        value={param.name}
                        onChange={(e) => updateParameter(index, 'name', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Value</Label>
                      <Input
                        placeholder="e.g., 14.2"
                        value={param.value}
                        onChange={(e) => updateParameter(index, 'value', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Unit</Label>
                      <Input
                        placeholder="e.g., g/dL"
                        value={param.unit}
                        onChange={(e) => updateParameter(index, 'unit', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Normal Range</Label>
                      <Input
                        placeholder="e.g., 12-15.5"
                        value={param.normalRange}
                        onChange={(e) => updateParameter(index, 'normalRange', e.target.value)}
                      />
                    </div>
                    <div>
                      {parameters.length > 1 && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeParameter(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addParameter}
                  className="w-full"
                >
                  Add Parameter
                </Button>
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
            <div className="space-y-4">
              <div>
                <Label htmlFor="file">Report File</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                  className="cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: PDF, JPEG, PNG (Maximum size: 10MB)
                </p>
              </div>
              
              {selectedFile && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">{selectedFile.name}</span>
                    <span className="text-xs text-green-600">
                      ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                </div>
              )}
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
              <Button type="button" variant="outline">
                Save as Draft
              </Button>
              <Button type="button" variant="outline">
                Preview
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default TestUpload;
