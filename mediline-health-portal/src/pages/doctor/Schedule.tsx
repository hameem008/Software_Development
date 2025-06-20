
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  DollarSign, 
  Plus, 
  Edit3, 
  Trash2,
  Save
} from 'lucide-react';

interface ScheduleSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  location: string;
  fee: number;
  capacity: number;
}

const DoctorSchedule = () => {
  const [scheduleSlots, setScheduleSlots] = useState<ScheduleSlot[]>([
    {
      id: '1',
      day: 'Monday',
      startTime: '10:00',
      endTime: '13:00',
      location: 'Green Life Hospital',
      fee: 500,
      capacity: 10
    },
    {
      id: '2',
      day: 'Wednesday',
      startTime: '14:00',
      endTime: '17:00',
      location: 'Central Clinic',
      fee: 700,
      capacity: 5
    },
    {
      id: '3',
      day: 'Friday',
      startTime: '09:00',
      endTime: '12:00',
      location: 'City General Hospital',
      fee: 600,
      capacity: 8
    },
    {
      id: '4',
      day: 'Saturday',
      startTime: '16:00',
      endTime: '19:00',
      location: 'Metro Health Center',
      fee: 800,
      capacity: 6
    }
  ]);

  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleEdit = (id: string) => {
    setIsEditing(id);
  };

  const handleSave = () => {
    setIsEditing(null);
    console.log('Schedule saved');
  };

  const handleDelete = (id: string) => {
    setScheduleSlots(scheduleSlots.filter(slot => slot.id !== id));
  };

  const handleAddSlot = () => {
    const newSlot: ScheduleSlot = {
      id: Date.now().toString(),
      day: 'Monday',
      startTime: '09:00',
      endTime: '12:00',
      location: 'New Clinic',
      fee: 500,
      capacity: 5
    };
    setScheduleSlots([...scheduleSlots, newSlot]);
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Weekly Schedule</h1>
          <p className="text-gray-600">Manage your consultation hours and availability</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="bg-medical-600 hover:bg-medical-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Slot
        </Button>
      </div>

      {/* Schedule Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-medical-600" />
            Current Schedule
          </CardTitle>
          <CardDescription>
            Your weekly consultation schedule across different locations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium text-gray-900">Day</th>
                  <th className="text-left p-3 font-medium text-gray-900">Time</th>
                  <th className="text-left p-3 font-medium text-gray-900">Location</th>
                  <th className="text-left p-3 font-medium text-gray-900">Fee</th>
                  <th className="text-left p-3 font-medium text-gray-900">Capacity</th>
                  <th className="text-left p-3 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {scheduleSlots.map((slot) => (
                  <tr key={slot.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {slot.day}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center text-sm">
                        <Clock className="w-4 h-4 mr-1 text-gray-400" />
                        {isEditing === slot.id ? (
                          <div className="flex items-center space-x-1">
                            <Input 
                              type="time" 
                              defaultValue={slot.startTime}
                              className="w-20 h-8 text-xs"
                            />
                            <span>–</span>
                            <Input 
                              type="time" 
                              defaultValue={slot.endTime}
                              className="w-20 h-8 text-xs"
                            />
                          </div>
                        ) : (
                          <span>{slot.startTime} – {slot.endTime}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center text-sm">
                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                        {isEditing === slot.id ? (
                          <Input 
                            defaultValue={slot.location}
                            className="w-32 h-8 text-xs"
                          />
                        ) : (
                          <span>{slot.location}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center text-sm">
                        <DollarSign className="w-4 h-4 mr-1 text-gray-400" />
                        {isEditing === slot.id ? (
                          <Input 
                            type="number" 
                            defaultValue={slot.fee}
                            className="w-20 h-8 text-xs"
                          />
                        ) : (
                          <span>{slot.fee}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center text-sm">
                        <Users className="w-4 h-4 mr-1 text-gray-400" />
                        {isEditing === slot.id ? (
                          <Input 
                            type="number" 
                            defaultValue={slot.capacity}
                            className="w-16 h-8 text-xs"
                          />
                        ) : (
                          <span>{slot.capacity}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        {isEditing === slot.id ? (
                          <Button 
                            size="sm" 
                            onClick={handleSave}
                            className="h-8 px-2"
                          >
                            <Save className="w-3 h-3" />
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleEdit(slot.id)}
                            className="h-8 px-2"
                          >
                            <Edit3 className="w-3 h-3" />
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDelete(slot.id)}
                          className="h-8 px-2 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {scheduleSlots.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No schedule slots</h3>
              <p className="text-gray-600 mb-4">Add your first consultation slot to get started</p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Schedule Slot
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Slots</p>
                <p className="text-2xl font-bold text-gray-900">{scheduleSlots.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-medical-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Weekly Hours</p>
                <p className="text-2xl font-bold text-gray-900">
                  {scheduleSlots.reduce((total, slot) => {
                    const start = parseInt(slot.startTime.split(':')[0]);
                    const end = parseInt(slot.endTime.split(':')[0]);
                    return total + (end - start);
                  }, 0)}
                </p>
              </div>
              <Clock className="h-8 w-8 text-medical-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Capacity</p>
                <p className="text-2xl font-bold text-gray-900">
                  {scheduleSlots.reduce((total, slot) => total + slot.capacity, 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-medical-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Fee</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${scheduleSlots.length > 0 ? Math.round(scheduleSlots.reduce((total, slot) => total + slot.fee, 0) / scheduleSlots.length) : 0}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-medical-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorSchedule;
