import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, User, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import { format } from 'date-fns';
import {Label} from "@radix-ui/react-label";

interface PrescriptionSummary {
  prescriptionId: number;
  doctorName: string;
  doctorId: number;
  issuedDate: string;
  summary: string;
  diagnosis: string[];
}

interface Doctor {
  doctorId: number;
  name: string;
}

interface Disease {
  diseaseId: number;
  name: string;
}

const PrescriptionListView = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState<PrescriptionSummary[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    doctorId: 0,
    diseaseId: 0,
    keyword: '',
  });

  useEffect(() => {
    const fetchDropDownDoctorsAndDiseases = async () => {
      try {
        api.get('/patient/history/prescription/doctors').then((res) =>
            setDoctors(res.data));
        api.get('/patient/history/prescription/diseases').then((res) =>
            setDiseases(res.data));
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load doctors and disease',
          variant: 'destructive',
        });
      }
    };
    fetchDropDownDoctorsAndDiseases();
  }, []);

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      console.log(filters)

      const res = await api.post('/patient/history/all-prescriptions', {
          dateFrom: filters.dateFrom || undefined,
          dateTo: filters.dateTo || undefined,
          doctorId: filters.doctorId !== 0 ? filters.doctorId : undefined,
          diseaseId: filters.diseaseId !== 0 ? filters.diseaseId : undefined,
          keyword: filters.keyword || undefined,
      });
      setPrescriptions(res.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load prescriptions.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions().then(r => {});
  }, []);

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      doctorId: 0,
      diseaseId: 0,
      keyword: '',
    });
    setPrescriptions([]);
  };

  const handleView = (prescriptionId: number) => {
    navigate('/patient/prescriptions/details', {
      state: { prescriptionId },
    });
  };

  const today = new Date().toISOString().split('T')[0]; // Format as yyyy-mm-dd

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Prescription History</h1>
        <p className="text-sm text-gray-600">Search and filter your past prescriptions</p>
      </div>

      {/* Filters */}
      <Card className="mb-4">
        <CardContent>
          <div className="mt-3">
            <label className="text-sm text-gray-700">Keyword</label>
            <Input
              type="text"
              placeholder="Search summary or symptoms"
              value={filters.keyword}
              onChange={(e) => handleFilterChange('keyword', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
            <div>
              <label className="text-sm text-gray-700">From</label>
              <Input
                type="date"
                max={today}
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-gray-700">To</label>
              <Input
                type="date"
                max={today}
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-gray-700">Doctor</label>
              <Select
                value={filters.doctorId.toString()}
                onValueChange={(value) => handleFilterChange('doctorId', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Doctor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">All</SelectItem>
                  {doctors.map((doc) => (
                    <SelectItem key={doc.doctorId} value={doc.doctorId.toString()}>
                      {doc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Disease</Label>
              <Select
                value={filters.diseaseId.toString()}
                onValueChange={(value) => handleFilterChange('diseaseId', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Disease" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">All</SelectItem>
                  {diseases.map((disease) => (
                    <SelectItem key={disease.diseaseId} value={disease.diseaseId.toString()}>
                      {disease.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={fetchPrescriptions} className="w-full">
                Search
              </Button>
              <Button onClick={clearFilters} className="w-full">
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {loading ? (
        <p className="text-gray-600">Loading prescriptions...</p>
      ) : prescriptions.length > 0 ? (
        <div className="space-y-4">
          {prescriptions.map((prescription) => (
            /*<Link
              key={prescription.prescriptionId}
              to={`/patient/prescriptions/${prescription.prescriptionId}`}
            >*/
              <Card className="hover:shadow-sm transition-shadow">
                <CardContent className="flex items-center justify-between py-4">
                  <div className="space-y-1">
                    <h4 className="font-medium text-gray-900">
                      Prescription #{prescription.prescriptionId}
                    </h4>
                    <p className="text-sm text-gray-600">
                      <User className="w-4 h-4 inline mr-1" />
                      {prescription.doctorName} &nbsp;|&nbsp;
                      <Calendar className="w-4 h-4 inline mr-1" />
                      {format(new Date(prescription.issuedDate), 'MMM dd, yyyy')}
                    </p>
                    <p className="text-sm text-gray-600">{prescription.summary}</p>
                  </div>
                  <Button size="sm" variant="outline"
                   onClick={() => handleView(prescription.prescriptionId)}
                  >
                    View
                  </Button>
                </CardContent>
              </Card>
           /* </Link>*/
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-10 text-gray-600">
            <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No prescriptions found. Try adjusting your filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PrescriptionListView;
