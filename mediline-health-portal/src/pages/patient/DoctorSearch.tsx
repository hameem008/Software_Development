
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

const DoctorSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  // const specialties = [...new Set(mockDoctors.map(doctor => doctor.specialization))];
  // const locations = [...new Set(mockDoctors.map(doctor => doctor.hospital))];

  const [specialties, setSpecialties] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);

  // const filteredDoctors = mockDoctors.filter(doctor => {
  //   const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //                        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
  //   const matchesSpecialty = !selectedSpecialty || selectedSpecialty === 'all-specialties' || doctor.specialization === selectedSpecialty;
  //   const matchesLocation = !selectedLocation || selectedLocation === 'all-locations' || doctor.hospital === selectedLocation;
    
  //   return matchesSearch && matchesSpecialty && matchesLocation;
  // });

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

    if (selectedSpecialty || selectedLocation) {
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
              {/*<Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="All Specialties" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">All Specialties</SelectItem>
                  {specialties.map(specialty => (
                    <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                  ))}
                </SelectContent>
              </Select>*/}

              <DropDown
                value={selectedSpecialty}
                onChange={setSelectedSpecialty}
                options={specialties}
                placeholder="Specialties"
              />
            </div>
            <div>
              {/*<Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>*/}
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

        {doctors.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {doctors.map((doctor) => (
              <Card key={doctor.doctorId} className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {doctor.avatar ? (
                        <img 
                          src={doctor.avatar} 
                          alt={doctor.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-medical-100 rounded-full flex items-center justify-center">
                          <User className="w-8 h-8 text-medical-600" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm text-gray-600">{doctor.rating}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Badge variant="secondary" className="bg-medical-100 text-medical-700">
                          {doctor.specialization}
                        </Badge>
                        
                        <p className="text-sm text-gray-600">{doctor.degree}</p>
                        
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-1" />
                          {doctor.academicInstitution}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-gray-600">
                            <Clock className="w-4 h-4 mr-1" />
                            {doctor.designation} 
                          </div>
                          <div className="flex items-center text-gray-900 font-medium">
                            <DollarSign className="w-4 h-4 mr-1" />
                            ${doctor.consultationFee}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mt-2">
                          {doctor.availableDays.slice(0, 3).map((day) => (
                            <Badge key={day} variant="outline" className="text-xs">
                              {day}
                            </Badge>
                          ))}
                          {doctor.availableDays.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{doctor.availableDays.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 mt-4">
                        <Link to={`/patient/book-appointment/${doctor.doctorId}`}>
                          <Button 
                            size="sm"
                            className="bg-medical-600 hover:bg-medical-700"
                          >
                            Book Appointment
                          </Button>
                        </Link>
                        <Link to={`/patient/doctors/${doctor.doctorId}`}>
                          <Button size="sm" variant="outline">
                            View Profile
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
