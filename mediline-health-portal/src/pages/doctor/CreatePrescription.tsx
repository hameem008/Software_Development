
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { mockPatients } from '@/data/mockData';
import { useSearchParams } from 'react-router-dom';
import { Plus, Trash2, FileText, User, Pill, TestTube, Heart } from 'lucide-react';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface TestOrder {
  id: string;
  testName: string;
  reason: string;
}

interface HealthVitals {
  heartRate: string;
  bloodPressureSystolic: string;
  bloodPressureDiastolic: string;
  weight: string;
  height: string;
  temperature: string;
  oxygenSaturation: string;
}

const CreatePrescription = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [selectedPatient, setSelectedPatient] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [medications, setMedications] = useState<Medication[]>([]);
  const [testOrders, setTestOrders] = useState<TestOrder[]>([]);
  const [healthVitals, setHealthVitals] = useState<HealthVitals>({
    heartRate: '',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    weight: '',
    height: '',
    temperature: '',
    oxygenSaturation: ''
  });

  useEffect(() => {
    const patientId = searchParams.get('patientId');
    if (patientId) {
      setSelectedPatient(patientId);
    }
  }, [searchParams]);

  const addMedication = () => {
    const newMedication: Medication = {
      id: Date.now().toString(),
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: ''
    };
    setMedications([...medications, newMedication]);
  };

  const removeMedication = (id: string) => {
    setMedications(medications.filter(med => med.id !== id));
  };

  const updateMedication = (id: string, field: keyof Medication, value: string) => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, [field]: value } : med
    ));
  };

  const addTestOrder = () => {
    const newTest: TestOrder = {
      id: Date.now().toString(),
      testName: '',
      reason: ''
    };
    setTestOrders([...testOrders, newTest]);
  };

  const removeTestOrder = (id: string) => {
    setTestOrders(testOrders.filter(test => test.id !== id));
  };

  const updateTestOrder = (id: string, field: keyof TestOrder, value: string) => {
    setTestOrders(testOrders.map(test => 
      test.id === id ? { ...test, [field]: value } : test
    ));
  };

  const updateHealthVital = (field: keyof HealthVitals, value: string) => {
    setHealthVitals(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPatient || !diagnosis.trim()) {
      toast({
        title: 'Missing required fields',
        description: 'Please select a patient and enter a diagnosis.',
        variant: 'destructive',
      });
      return;
    }

    if (medications.length === 0) {
      toast({
        title: 'No medications added',
        description: 'Please add at least one medication.',
        variant: 'destructive',
      });
      return;
    }

    // Mock save operation
    toast({
      title: 'Prescription created successfully!',
      description: 'The prescription has been saved and sent to the patient.',
    });

    // Reset form
    setSelectedPatient('');
    setDiagnosis('');
    setNotes('');
    setMedications([]);
    setTestOrders([]);
    setHealthVitals({
      heartRate: '',
      bloodPressureSystolic: '',
      bloodPressureDiastolic: '',
      weight: '',
      height: '',
      temperature: '',
      oxygenSaturation: ''
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Write Prescription</h1>
        <p className="text-gray-600">Create a new prescription for your patient</p>
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
              Select the patient for this prescription
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patient">Select Patient</Label>
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
                <div className="p-3 bg-gray-50 rounded-lg">
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
            </div>
          </CardContent>
        </Card>

        {/* Health Vitals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="w-5 h-5 mr-2 text-medical-600" />
              Health Vitals
            </CardTitle>
            <CardDescription>
              Record patient's current vital signs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                <Input
                  id="heartRate"
                  type="number"
                  value={healthVitals.heartRate}
                  onChange={(e) => updateHealthVital('heartRate', e.target.value)}
                  placeholder="e.g., 72"
                />
              </div>
              <div>
                <Label htmlFor="bloodPressure">Blood Pressure (mmHg)</Label>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    value={healthVitals.bloodPressureSystolic}
                    onChange={(e) => updateHealthVital('bloodPressureSystolic', e.target.value)}
                    placeholder="120"
                  />
                  <span className="flex items-center text-gray-500">/</span>
                  <Input
                    type="number"
                    value={healthVitals.bloodPressureDiastolic}
                    onChange={(e) => updateHealthVital('bloodPressureDiastolic', e.target.value)}
                    placeholder="80"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={healthVitals.weight}
                  onChange={(e) => updateHealthVital('weight', e.target.value)}
                  placeholder="e.g., 70.5"
                />
              </div>
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={healthVitals.height}
                  onChange={(e) => updateHealthVital('height', e.target.value)}
                  placeholder="e.g., 175"
                />
              </div>
              <div>
                <Label htmlFor="temperature">Temperature (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  value={healthVitals.temperature}
                  onChange={(e) => updateHealthVital('temperature', e.target.value)}
                  placeholder="e.g., 37.0"
                />
              </div>
              <div>
                <Label htmlFor="oxygenSaturation">Oxygen Saturation (%)</Label>
                <Input
                  id="oxygenSaturation"
                  type="number"
                  value={healthVitals.oxygenSaturation}
                  onChange={(e) => updateHealthVital('oxygenSaturation', e.target.value)}
                  placeholder="e.g., 98"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Diagnosis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2 text-medical-600" />
              Diagnosis & Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="diagnosis">Primary Diagnosis *</Label>
                <Input
                  id="diagnosis"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="Enter primary diagnosis"
                  required
                />
              </div>
              <div>
                <Label htmlFor="notes">Clinical Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional notes, follow-up instructions, etc."
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="flex items-center">
                <Pill className="w-5 h-5 mr-2 text-medical-600" />
                Medications
              </CardTitle>
              <CardDescription>
                Add medications with dosage and instructions
              </CardDescription>
            </div>
            <Button type="button" onClick={addMedication} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Medication
            </Button>
          </CardHeader>
          <CardContent>
            {medications.length > 0 ? (
              <div className="space-y-4">
                {medications.map((medication, index) => (
                  <div key={medication.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Medication {index + 1}</h4>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeMedication(medication.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div>
                        <Label>Medicine Name</Label>
                        <Input
                          value={medication.name}
                          onChange={(e) => updateMedication(medication.id, 'name', e.target.value)}
                          placeholder="e.g., Paracetamol"
                        />
                      </div>
                      <div>
                        <Label>Dosage</Label>
                        <Input
                          value={medication.dosage}
                          onChange={(e) => updateMedication(medication.id, 'dosage', e.target.value)}
                          placeholder="e.g., 500mg"
                        />
                      </div>
                      <div>
                        <Label>Frequency</Label>
                        <Select 
                          value={medication.frequency} 
                          onValueChange={(value) => updateMedication(medication.id, 'frequency', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="once-daily">Once daily</SelectItem>
                            <SelectItem value="twice-daily">Twice daily</SelectItem>
                            <SelectItem value="three-times-daily">Three times daily</SelectItem>
                            <SelectItem value="four-times-daily">Four times daily</SelectItem>
                            <SelectItem value="as-needed">As needed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Duration</Label>
                        <Input
                          value={medication.duration}
                          onChange={(e) => updateMedication(medication.id, 'duration', e.target.value)}
                          placeholder="e.g., 7 days"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Special Instructions</Label>
                      <Input
                        value={medication.instructions}
                        onChange={(e) => updateMedication(medication.id, 'instructions', e.target.value)}
                        placeholder="e.g., Take with food"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Pill className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No medications added yet</p>
                <Button type="button" onClick={addMedication} variant="outline" className="mt-2">
                  Add First Medication
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="flex items-center">
                <TestTube className="w-5 h-5 mr-2 text-medical-600" />
                Test Orders
              </CardTitle>
              <CardDescription>
                Order tests and diagnostic procedures
              </CardDescription>
            </div>
            <Button type="button" onClick={addTestOrder} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Test
            </Button>
          </CardHeader>
          <CardContent>
            {testOrders.length > 0 ? (
              <div className="space-y-3">
                {testOrders.map((test, index) => (
                  <div key={test.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Test {index + 1}</h4>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeTestOrder(test.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label>Test Name</Label>
                        <Input
                          value={test.testName}
                          onChange={(e) => updateTestOrder(test.id, 'testName', e.target.value)}
                          placeholder="e.g., Complete Blood Count"
                        />
                      </div>
                      <div>
                        <Label>Reason/Indication</Label>
                        <Input
                          value={test.reason}
                          onChange={(e) => updateTestOrder(test.id, 'reason', e.target.value)}
                          placeholder="e.g., Routine monitoring"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <TestTube className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No tests ordered</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex space-x-4">
              <Button type="submit" className="bg-medical-600 hover:bg-medical-700">
                Save Prescription
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

export default CreatePrescription;
