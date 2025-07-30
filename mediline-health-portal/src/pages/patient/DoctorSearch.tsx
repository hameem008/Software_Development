
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { mockDoctors } from '@/data/mockData';
import { Search, MapPin, Star, Clock, DollarSign, User } from 'lucide-react';
import api from '@/lib/api';
import DropDown from "@/components/common/DropDown";
import DoctorCard from "@/components/patient/DoctorCard";

const DoctorSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const [specialties, setSpecialties] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);

  const filteredDoctors = doctors.filter((doctor) => {
      const lowerSearch = searchTerm.toLowerCase();
        return (
          doctor.name.toLowerCase().includes(lowerSearch) ||
          doctor.specialization.toLowerCase().includes(lowerSearch)
        );
    });

  useEffect(() => {
    const fetchSpecialtiesAndLocations = async () => {
      try {
        const [specialtiesResponse, locationsResponse] = await Promise.all([
          api.get('/patient/specialties'),
          api.get('/patient/locations')
        ]);

        setSpecialties(specialtiesResponse.data);
        setLocations(locationsResponse.data);
      } catch (error) {
        console.error('Error fetching specialties or locations:', error);
      }
    };

    fetchSpecialtiesAndLocations();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const body = {
          specialization: selectedSpecialty || null,
          location: selectedLocation || ''
        };
        if(body.specialization == "all")
          body.specialization = null
        if(body.location=="all")
          body.location=''

        const response = await api.post('/patient/find-doctors', body);
        setDoctors(response.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    

    if (selectedSpecialty || selectedLocation ) {
      fetchDoctors();
    }

    fetchDoctors();

  }, [selectedSpecialty, selectedLocation]);


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Doctors</h1>
        <p className="text-gray-600">Search for healthcare professionals in your area</p>
      </div>

      {/* Search Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="w-5 h-5 mr-2 text-medical-600" />
            Search Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Search by name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <DropDown
                value={selectedSpecialty}
                onChange={setSelectedSpecialty}
                options={specialties}
                placeholder="Specialties"
              />
            </div>
            <div>
              <DropDown
                value={selectedLocation}
                onChange={setSelectedLocation}
                options={locations}
                placeholder="Locations"
              />
            </div>
            <div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSpecialty('');
                  setSelectedLocation('');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Doctor Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Available Doctors ({doctors.length})
          </h2>
        </div>

        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredDoctors.map((doctor) => (
              <DoctorCard key={doctor.doctorId} doctor={doctor} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DoctorSearch;
