
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { TestTube, MapPin, Star, Calendar, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'react-router-dom';

const availableTests = [
  'Complete Blood Count (CBC)',
  'Lipid Panel',
  'MRI Scan',
  'CT Scan',
  'X-Ray',
  'Ultrasound',
  'ECG',
  'Blood Sugar Test'
];

const mockHospitals = [
  {
    id: '1',
    name: 'City General Hospital',
    location: '456 Hospital Ave, Springfield, IL',
    rating: 4.8,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
    availableTimes: ['9:00 AM', '10:00 AM', '2:00 PM', '3:00 PM'],
    testTypes: ['CBC', 'Lipid Panel', 'X-Ray', 'ECG']
  },
  {
    id: '2',
    name: 'Metro Health Center',
    location: '789 Health Blvd, Springfield, IL',
    rating: 4.6,
    availableDays: ['Monday', 'Wednesday', 'Thursday', 'Saturday'],
    availableTimes: ['8:00 AM', '11:00 AM', '1:00 PM', '4:00 PM'],
    testTypes: ['MRI Scan', 'CT Scan', 'Ultrasound', 'CBC']
  },
  {
    id: '3',
    name: 'Advanced Diagnostics Center',
    location: '321 Medical Plaza, Springfield, IL',
    rating: 4.9,
    availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    availableTimes: ['9:30 AM', '11:30 AM', '2:30 PM', '4:30 PM'],
    testTypes: ['MRI Scan', 'CT Scan', 'Blood Sugar Test', 'Lipid Panel']
  }
];

const TestRequest = () => {
  const [searchParams] = useSearchParams();
  const [selectedTest, setSelectedTest] = useState('');
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const preselected = searchParams.get('preselected');
    if (preselected && availableTests.includes(preselected)) {
      setSelectedTest(preselected);
    }
  }, [searchParams]);

  const filteredHospitals = selectedTest 
    ? mockHospitals.filter(hospital => 
        hospital.testTypes.some(test => 
          test.toLowerCase().includes(selectedTest.toLowerCase().split(' ')[0])
        )
      )
    : [];

  const handleBookTest = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please select both date and time for your test.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Test Request Submitted",
      description: `Your ${selectedTest} request has been sent to ${selectedHospital.name}. You'll be notified once they respond.`,
    });

    setIsModalOpen(false);
    setSelectedDate('');
    setSelectedTime('');
    setNotes('');
  };

  const BookingModal = ({ hospital }) => (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book Test at {hospital?.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="test-type">Test Type</Label>
            <Input id="test-type" value={selectedTest} disabled />
          </div>
          <div>
            <Label htmlFor="date">Preferred Date</Label>
            <Input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <Label htmlFor="time">Preferred Time</Label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {hospital?.availableTimes.map((time) => (
                  <SelectItem key={time} value={time}>{time}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any special requirements or notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <Button onClick={handleBookTest} className="flex-1">Submit Request</Button>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Request Test</h1>
        <p className="text-gray-600">Select a test type and find available hospitals</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TestTube className="w-5 h-5 mr-2 text-medical-600" />
            Select Test Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedTest} onValueChange={setSelectedTest}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose the test you need" />
            </SelectTrigger>
            <SelectContent>
              {availableTests.map((test) => (
                <SelectItem key={test} value={test}>{test}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedTest && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Available Hospitals for {selectedTest}
          </h2>
          
          {filteredHospitals.length > 0 ? (
            <div className="grid gap-4">
              {filteredHospitals.map((hospital) => (
                <Card key={hospital.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{hospital.name}</h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{hospital.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-2 text-yellow-500" />
                          <span>{hospital.rating}/5.0 rating</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>Available: {hospital.availableDays.join(', ')}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>Times: {hospital.availableTimes.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge className="bg-green-100 text-green-800">Available</Badge>
                      <Button 
                        onClick={() => {
                          setSelectedHospital(hospital);
                          setIsModalOpen(true);
                        }}
                        className="bg-medical-600 hover:bg-medical-700"
                      >
                        Book Test
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8">
              <div className="text-center text-gray-500">
                <TestTube className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>No hospitals currently offer this test. Please try a different test type.</p>
              </div>
            </Card>
          )}
        </div>
      )}

      {selectedHospital && <BookingModal hospital={selectedHospital} />}
    </div>
  );
};

export default TestRequest;
