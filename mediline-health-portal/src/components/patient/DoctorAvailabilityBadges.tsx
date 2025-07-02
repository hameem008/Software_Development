import React from 'react';
import { Badge } from '@/components/ui/badge';

interface Props {
  days: string[];
}

const DoctorAvailabilityBadges = ({ days }: Props) => {
  const displayDays = days.slice(0, 3);
  const extraCount = days.length - 3;

  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {displayDays.map((day) => (
        <Badge key={day} variant="outline" className="text-xs">
          {day}
        </Badge>
      ))}
      {extraCount > 0 && (
        <Badge variant="outline" className="text-xs">
          +{extraCount} more
        </Badge>
      )}
    </div>
  );
};

export default DoctorAvailabilityBadges;
