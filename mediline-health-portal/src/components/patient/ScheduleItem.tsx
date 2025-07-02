import React from 'react';
import { Calendar, Clock } from 'lucide-react';

interface ScheduleItemProps {
  schedule: {
    day: string;
    time: string;
  };
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({ schedule }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-medical-50 rounded-lg">
      <div className="flex items-center space-x-3">
        <Calendar className="w-4 h-4 text-medical-600" />
        <span className="font-medium text-medical-700">{schedule.day}</span>
      </div>
      <div className="flex items-center space-x-2">
        <Clock className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-600">{schedule.time}</span>
      </div>
    </div>
  );
};

export default ScheduleItem;