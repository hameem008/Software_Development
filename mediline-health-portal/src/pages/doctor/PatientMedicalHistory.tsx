
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { mockPatients, mockPrescriptions, mockTestResults, mockDoctors, mockHospitals, additionalHospitals } from '@/data/mockData';
import { 
  ArrowLeft, 
  User, 
  FileText, 
  TestTube, 
  Calendar, 
  Pill,
  Download,
  AlertTriangle,
  CheckCircle,
  Filter,
  Search,
  ChevronDown
} from 'lucide-react';

const PatientMedicalHistory = () => {
  const { patientId } = useParams();
  
  // Filter states for test results
  const [searchKeyword, setSearchKeyword] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [testType, setTestType] = useState('all-types');
  const [doctorFilter, setDoctorFilter] = useState('all-doctors');
  const [hospitalFilter, setHospitalFilter] = useState('all-facilities');
  const [hasNotes, setHasNotes] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  const patient = mockPatients.find(p => p.id === patientId);
  const patientPrescriptions = mockPrescriptions.filter(presc => presc.patientId === patientId);
  const patientTests = mockTestResults.filter(test => test.patientId === patientId);

  // All available hospitals including additional ones
  const allHospitals = [...mockHospitals, ...additionalHospitals];


  // Filter test results based on applied filters
  const filteredTests = patientTests.filter(test => {
    const matchesKeyword = !searchKeyword || 
      test.testName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      test.testType.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      (test.notes && test.notes.toLowerCase().includes(searchKeyword.toLowerCase()));
    
    const matchesFromDate = !fromDate || new Date(test.date) >= new Date(fromDate);
    const matchesToDate = !toDate || new Date(test.date) <= new Date(toDate);
    const matchesType = !testType || testType === 'all-types' || test.testType === testType;
    const matchesDoctor = !doctorFilter || doctorFilter === 'all-doctors' || test.performedBy?.includes(doctorFilter);
    const matchesHospital = !hospitalFilter || hospitalFilter === 'all-facilities' || test.hospitalId === hospitalFilter;
    const matchesNotes = !hasNotes || (test.notes && test.notes.length > 0);

    return matchesKeyword && matchesFromDate && matchesToDate && 
           matchesType && matchesDoctor && matchesHospital && matchesNotes;
  });

  const clearFilters = () => {
    setSearchKeyword('');
    setFromDate('');
    setToDate('');
    setTestType('all-types');
    setDoctorFilter('all-doctors');
    setHospitalFilter('all-facilities');
    setHasNotes(false);
  };

  if (!patient) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Patient Not Found</h2>
        <p className="text-gray-600 mb-4">The requested patient could not be found.</p>
        <Link to="/doctor/patients">
          <Button>Back to Patient List</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/doctor/appointments">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Appointments
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{patient.name}</h1>
            <p className="text-gray-600">Complete Medical History</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Link to={`/doctor/prescriptions/create?patientId=${patientId}`}>
            <Button className="bg-medical-600 hover:bg-medical-700">
              <Pill className="w-4 h-4 mr-2" />
              Write Prescription
            </Button>
          </Link>
        </div>
      </div>

      {/* Patient Info Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2 text-medical-600" />
            Patient Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Age</p>
              <p className="text-base text-gray-900">
                {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} years
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Gender</p>
              <p className="text-base text-gray-900 capitalize">{patient.gender}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Blood Group</p>
              <p className="text-base text-gray-900">{patient.bloodGroup}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Phone</p>
              <p className="text-base text-gray-900">{patient.phone}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Medical History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2 text-medical-600" />
            Medical History
          </CardTitle>
          <CardDescription>View patient prescriptions and test results</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="prescriptions" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="prescriptions" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Prescriptions ({patientPrescriptions.length})
              </TabsTrigger>
              <TabsTrigger value="tests" className="flex items-center gap-2">
                <TestTube className="w-4 h-4" />
                Test Results ({filteredTests.length})
              </TabsTrigger>
            </TabsList>
            
            {/* Prescriptions Tab */}
            <TabsContent value="prescriptions" className="mt-6">
              {patientPrescriptions.length > 0 ? (
                <div className="space-y-4">
                  {patientPrescriptions.map((prescription) => (
                    <div key={prescription.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-medium text-gray-900">{prescription.diagnosis}</p>
                          <p className="text-sm text-gray-600 flex items-center mt-1">
                            <Calendar className="w-4 h-4 mr-1" />
                            {prescription.date}
                          </p>
                        </div>
                        <Link to={`/doctor/prescription/${prescription.id}/view`}>
                          <Button size="sm" variant="outline" className="hover:bg-medical-50">
                            View Full
                          </Button>
                        </Link>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Medications:</p>
                        <div className="flex flex-wrap gap-2">
                          {prescription.medications.map((med, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {med.name} - {med.dosage}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {prescription.notes && (
                        <div className="mt-3 p-2 bg-gray-50 rounded">
                          <p className="text-sm text-gray-600">{prescription.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No prescription history found</p>
                </div>
              )}
            </TabsContent>

            {/* Test Results Tab */}
            <TabsContent value="tests" className="mt-6">
              {/* Filter Panel */}
              <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full mb-4 justify-between">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      Advanced Filters
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Card className="p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Keyword Search */}
                      <div className="space-y-2">
                        <Label htmlFor="keyword">Keyword Search</Label>
                        <div className="relative">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="keyword"
                            placeholder="Test name, type, notes..."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            className="pl-9"
                          />
                        </div>
                      </div>

                      {/* From Date */}
                      <div className="space-y-2">
                        <Label htmlFor="fromDate">From Date</Label>
                        <Input
                          id="fromDate"
                          type="date"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                        />
                      </div>

                      {/* To Date */}
                      <div className="space-y-2">
                        <Label htmlFor="toDate">To Date</Label>
                        <Input
                          id="toDate"
                          type="date"
                          value={toDate}
                          onChange={(e) => setToDate(e.target.value)}
                        />
                      </div>

                      {/* Test Type */}
                      <div className="space-y-2">
                        <Label>Test Type</Label>
                        <Select value={testType} onValueChange={setTestType}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent className="bg-background">
                            <SelectItem value="all-types">All Types</SelectItem>
                            <SelectItem value="Pathology">Pathology</SelectItem>
                            <SelectItem value="Imaging">Imaging</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Doctor Filter */}
                      <div className="space-y-2">
                        <Label>Performed By</Label>
                        <Select value={doctorFilter} onValueChange={setDoctorFilter}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select doctor" />
                          </SelectTrigger>
                          <SelectContent className="bg-background">
                            <SelectItem value="all-doctors">All Doctors</SelectItem>
                            {mockDoctors.map((doctor) => (
                              <SelectItem key={doctor.id} value={doctor.name}>
                                {doctor.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Hospital Filter */}
                      <div className="space-y-2">
                        <Label>Hospital/Lab</Label>
                        <Select value={hospitalFilter} onValueChange={setHospitalFilter}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select facility" />
                          </SelectTrigger>
                          <SelectContent className="bg-background">
                            <SelectItem value="all-facilities">All Facilities</SelectItem>
                            {allHospitals.map((hospital) => (
                              <SelectItem key={hospital.id} value={hospital.id}>
                                {hospital.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Has Notes Toggle */}
                    <div className="flex items-center space-x-2 mt-4">
                      <Switch
                        id="hasNotes"
                        checked={hasNotes}
                        onCheckedChange={setHasNotes}
                      />
                      <Label htmlFor="hasNotes">Only show tests with notes/findings</Label>
                    </div>

                    {/* Clear Filters */}
                    <div className="flex justify-end mt-4">
                      <Button variant="outline" onClick={clearFilters}>
                        Clear All Filters
                      </Button>
                    </div>
                  </Card>
                </CollapsibleContent>
              </Collapsible>

              {/* Test Results List */}
              {filteredTests.length > 0 ? (
                <div className="space-y-4">
                  {filteredTests.map((test) => (
                    <div key={test.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <Link 
                            to={`/doctor/test-result/${test.id}/view`}
                            className="font-medium text-gray-900 hover:text-medical-600 transition-colors cursor-pointer"
                          >
                            {test.testName}
                          </Link>
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-sm text-gray-600">{test.date}</p>
                            <Badge variant="secondary" className="text-xs">
                              {test.testType}
                            </Badge>
                          </div>
                          <Badge 
                            variant={test.status === 'completed' ? 'default' : 'secondary'}
                            className={test.status === 'completed' ? 'bg-green-100 text-green-800 mt-1' : 'mt-1'}
                          >
                            {test.status}
                          </Badge>
                          {test.performedBy && (
                            <p className="text-xs text-gray-500 mt-1">
                              Performed by: {test.performedBy}
                            </p>
                          )}
                          {test.hospitalId && (
                            <p className="text-xs text-gray-500">
                              Facility: {allHospitals.find(h => h.id === test.hospitalId)?.name || 'Unknown'}
                            </p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          {test.reportUrl && (
                            <Button size="sm" variant="outline">
                              <Download className="w-3 h-3 mr-1" />
                              PDF
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-3">{test.result}</p>
                      
                      {test.parameters && test.parameters.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700">Parameters:</p>
                          <div className="space-y-1">
                            {test.parameters.map((param, index) => (
                              <div key={index} className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded">
                                <span className="font-medium">{param.name}</span>
                                <div className="flex items-center space-x-2">
                                  <span className={param.isNormal ? 'text-green-600' : 'text-red-600'}>
                                    {param.value} {param.unit}
                                  </span>
                                  {param.isNormal ? (
                                    <CheckCircle className="w-3 h-3 text-green-600" />
                                  ) : (
                                    <AlertTriangle className="w-3 h-3 text-red-600" />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {test.notes && (
                        <div className="mt-3 p-2 bg-blue-50 rounded">
                          <p className="text-sm text-blue-700">{test.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <TestTube className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>{patientTests.length === 0 ? 'No test results found' : 'No results match your filters'}</p>
                  {patientTests.length > 0 && filteredTests.length === 0 && (
                    <Button variant="link" onClick={clearFilters} className="mt-2">
                      Clear filters to see all results
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Medication Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Medication Timeline</CardTitle>
          <CardDescription>Current and past medications with duration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {patientPrescriptions.flatMap(presc => 
              presc.medications.map((med, index) => (
                <div key={`${presc.id}-${index}`} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-medical-600 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-900">{med.name}</p>
                      <p className="text-sm text-gray-600">{med.dosage} - {med.frequency}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{med.duration}</p>
                    <p className="text-xs text-gray-500">{presc.date}</p>
                  </div>
                </div>
              ))
            )}
            
            {patientPrescriptions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Pill className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No medication history found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientMedicalHistory;