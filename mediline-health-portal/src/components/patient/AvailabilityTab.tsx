import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import ScheduleItem from './ScheduleItem';

interface AvailabilityTabProps {
  scheduleByLocation: {
    [key: string]: Array<{ day: string; time: string }>;
  };
}

const AvailabilityTab: React.FC<AvailabilityTabProps> = ({ scheduleByLocation }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Schedule & Locations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(scheduleByLocation).map(([location, schedules]) => (
              <div key={location} className="border rounded-lg p-4">
                <div className="flex items-start space-x-3 mb-4">
                  <MapPin className="w-5 h-5 text-medical-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">{location}</h4>
                    <p className="text-sm text-gray-500">Consultation Center</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {schedules.map((schedule, index) => (
                    <ScheduleItem key={index} schedule={schedule} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AvailabilityTab;