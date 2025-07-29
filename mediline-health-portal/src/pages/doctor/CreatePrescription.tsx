import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { mockPatients } from '@/data/mockData';
import { useSearchParams } from 'react-router-dom';
import {Plus, Trash2, FileText, User, Pill, TestTube, Heart, NotepadText} from 'lucide-react';
import { Combobox } from "../../components/ui/combobox";
import api from "../../lib/api";

// Generic Option Interface
interface Option {
  id: number;
  name: string;
}


interface Medication {
  id: number;
  medicine: Option;
  dosage: string;
  frequency: string;
  durationValue: number;
  durationUnit: string;
  instructions: string;
}

interface TestOrder {
  id: number;
  test: Option | null;
}

interface Diagnosis {
  id: number;
  disease: Option | null;
}

interface HealthVitals {
  heartRate: string;
  bloodPressureSystolic: string;
  bloodPressureDiastolic: string;
  weight: string;
}

const CreatePrescription = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedDiagnoses, setSelectedDiagnoses] = useState<Diagnosis[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [testOrders, setTestOrders] = useState<TestOrder[]>([]);
  const [healthVitals, setHealthVitals] = useState<HealthVitals>({
    heartRate: '',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    weight: ''
  });
  const [diseases, setDiseases] = useState<Option[]>([]);
  const [medicines, setMedicines] = useState<Option[]>([]);
  const [tests, setTests] = useState<Option[]>([]);
  const [notes, setNotes] = useState('');
  const [summary, setSummary] = useState('');
  const [nextAppointment, setNextAppointment] = useState('');

  // Fetch data from backend
  useEffect(() => {
    const patientId = searchParams.get('patientId');
    if (patientId) {
      setSelectedPatient(patientId);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchDiagnoses();
    fetchMedicines();
    fetchTests();
  }, []);

  const fetchDiagnoses = async () => {
    try {
      const response = await api.get('/doctor/prescription/all-diseases');
      setDiseases(response.data);
    } catch (error) {
      console.error('Error fetching diseases:', error);
    }
  };

  const fetchMedicines = async () => {
    try {
      const response = await api.get('/doctor/prescription/all-medicines');
      setMedicines(response.data);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    }
  };

  const fetchTests = async () => {
    try {
      const response = await api.get('/doctor/prescription/all-tests');
      setTests(response.data);
    } catch (error) {
      console.error('Error fetching tests:', error);
    }
  };

  // Diagnosis handlers
  const addDiagnosis = () => {
    const newDiagnosis: Diagnosis = {
      id: Date.now(),
      disease: { id: null, name: '' }
    };
    setSelectedDiagnoses([...selectedDiagnoses, newDiagnosis]);
  };

  const removeDiagnosis = (index: number) => {
    setSelectedDiagnoses(selectedDiagnoses.filter(diagnosis=> diagnosis.id !== index));
  };

  const updateDiagnosis = (index: number, disease: Option) => {
    const newDiagnoses = [...selectedDiagnoses];
    newDiagnoses[index].disease = disease;
    setSelectedDiagnoses(newDiagnoses);
  };

  // Medication handlers
  const addMedication = () => {
    const newMedication: Medication = {
      id: Date.now(),
      medicine: { id: null, name: '' },
      dosage: '',
      frequency: '',
      durationValue: 0,
      durationUnit: '',
      instructions: ''
    };
    setMedications([...medications, newMedication]);
  };

  const removeMedication = (id: number) => {
    setMedications(medications.filter(med => med.id !== id));
  };

  const updateMedication = (id: number, field: keyof Medication, value: any) => {
  setMedications((prev) =>
    prev.map((med) =>
      med.id === id ? { ...med, [field]: value } : med
    )
  );
};

  // Test order handlers
  const addTestOrder = () => {
    const newSuggestedTest: TestOrder = {
      id: Date.now(),
      test: { id: null, name: '' }
    };
    setTestOrders([...testOrders, newSuggestedTest]);
  };

  const removeTestOrder = (index: number) => {
    setTestOrders(testOrders.filter(test => test.id !== index));
  };

  const updateTestOrder = (index: number, test: Option) => {
    const newTestOrders = [...testOrders];
    newTestOrders[index].test = test;
    setTestOrders(newTestOrders);
  };

  // Health vitals handler
  const updateHealthVital = (field: keyof HealthVitals, value: string) => {
    setHealthVitals(prev => ({ ...prev, [field]: value }));
  };

  // Form submission
  const handleSubmit = async () => {

    const validDiagnoses = selectedDiagnoses.filter(d => d.disease !== null);

    const validMedications = medications.filter(m => m.medicine !== null);

    const invalidMedications = validMedications
        .filter(m => !m.frequency ||  !m.durationUnit || !m.durationValue);
    if (invalidMedications.length > 0) {
      toast({
        title: 'Invalid medications',
        description: 'Please fill all required fields for medications.',
        variant: 'destructive',
      });
      return;
    }

    const validTestOrders = testOrders.filter(t => t.test !== null);

    const prescriptionData = {
      patientId: 2,
      hospitalId: 1,
      summary: summary,
      bloodPressure: `${healthVitals.bloodPressureSystolic}/${healthVitals.bloodPressureDiastolic}`,
      weight: healthVitals.weight,
      heartRate: healthVitals.heartRate,
      diagnosis: validDiagnoses.map(d => d.disease.id),
      tests: validTestOrders.map(t => t.test.id),
      medications: validMedications.map(m => ({
        medicineId: m.medicine.id,
        name: m.medicine.name,
        dosage: m.dosage,
        frequency: m.frequency,
        durationValue: m.durationValue,
        durationUnit: m.durationUnit,
        instructions: m.instructions
      })),
      notes: notes,
      nextAppointment: nextAppointment ? new Date(nextAppointment).toISOString() : null
    };

    try {
      console.log('Prescription data:', prescriptionData);
      const response = await api.post('/doctor/prescription/add', prescriptionData);
      console.log('Server response:', response.data);

      toast({
        title: 'Prescription created successfully!',
        description: 'The prescription has been saved and sent to the patient.',
      });

      setSelectedPatient('');
      setSelectedDiagnoses([]);
      setMedications([]);
      setTestOrders([]);
      setHealthVitals({
        heartRate: '',
        bloodPressureSystolic: '',
        bloodPressureDiastolic: '',
        weight: ''
      });
    } catch (error) {
      toast({
        title: 'Error creating prescription',
        description: 'There was an error saving the prescription. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Write Prescription</h1>
        <p className="text-gray-600">Create a new prescription for your patient</p>
      </div>

      <div className="space-y-6">
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
            </div>
          </CardContent>
        </Card>

        {/* Diagnoses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-medical-600" />
                Diagnoses
              </CardTitle>
              <CardDescription>
                Add one or more diagnoses for the patient
              </CardDescription>
            </div>
            <Button type="button" onClick={addDiagnosis} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Diagnosis
            </Button>
          </CardHeader>
          <CardContent>
            {selectedDiagnoses.length > 0 ? (
              <div className="space-y-4">
                {selectedDiagnoses.map((diagnosis, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Diagnosis {index + 1}</h4>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeDiagnosis(diagnosis.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div>
                      <Label>Diagnosis</Label>
                      <Combobox
                        options={diseases}
                        selectedId={diagnosis.disease.id || null}
                        onChange={(id, name) => updateDiagnosis(index, { id: Number(id), name })}
                        placeholder="Select diagnosis"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No diagnoses added yet</p>
                <Button type="button" onClick={addDiagnosis} variant="outline" className="mt-2">
                  Add First Diagnosis
                </Button>
              </div>
            )}
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
                {medications.map((medicine, index) => (
                  <div key={medicine.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Medication {index + 1}</h4>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeMedication(medicine.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                      <div>
                        <Label>Medicine Name</Label>
                        <Combobox
                          options={medicines}
                          selectedId={medicine.medicine?.id || null}
                          onChange={(id, name) =>
                              updateMedication(medicine.id, 'medicine', { id, name })}
                          placeholder="Select medicine"
                        />
                      </div>
                      <div>
                        <Label>Dosage</Label>
                        <Input
                          value={medicine.dosage}
                          onChange={(e) => updateMedication(medicine.id, 'dosage', e.target.value)}
                          placeholder="e.g., 500mg"
                        />
                      </div>
                      <div>
                        <Label>Frequency</Label>
                        <Select
                          value={medicine.frequency}
                          onValueChange={(value) => updateMedication(medicine.id, 'frequency', value)}
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
                            value={medicine.durationValue}
                            onChange={(e) => updateMedication(medicine.id, 'durationValue', e.target.value)}
                            placeholder="e.g., 7"
                          />
                      </div>
                      <div>
                          <Label>Duration Unit</Label>
                          <Select
                            value={medicine.durationUnit}
                            onValueChange={(value) => updateMedication(medicine.id, 'durationUnit', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select unit..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="day">Days</SelectItem>
                              <SelectItem value="month">Months</SelectItem>
                            </SelectContent>
                          </Select>
                      </div>
                    </div>
                    <div>
                      <Label>Special Instructions</Label>
                      <Input
                        value={medicine.instructions}
                        onChange={(e) => updateMedication(medicine.id, 'instructions', e.target.value)}
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
                {testOrders.map((testOrder, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Test {index + 1}</h4>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeTestOrder(testOrder.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label>Test Name</Label>
                        <Combobox
                          options={tests}
                          selectedId={testOrder.test.id || null}
                          onChange={(id, name) => updateTestOrder(index, { id: Number(id), name })}
                          placeholder="Select test"
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
        {/* Notes, Summary & Next Appointment */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="flex items-center">
                <NotepadText className="w-5 h-5 mr-2 text-medical-600"/>
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Input
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="any additional important notes...."
                />
              </div>
              <div>
                <Label htmlFor="summary">Prescription Summary</Label>
                <Input
                  id="summary"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Short summary of prescription...."
                />
              </div>
              <div>
                <Label htmlFor="nextAppointment">Next Appointment Date</Label>
                <Input
                  id="nextAppointment"
                  type="date"
                  value={nextAppointment}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setNextAppointment(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

        {/* Submit */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex space-x-4">
              <Button onClick={handleSubmit} className="bg-medical-600 hover:bg-medical-700">
                Save Prescription
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreatePrescription;