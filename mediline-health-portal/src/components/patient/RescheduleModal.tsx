
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockTimeSlots } from '@/data/mockData';

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: any;
  onReschedule: (appointmentId: string, newDate: string, newTime: string) => void;
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onReschedule
}) => {
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const { toast } = useToast();

  const handleReschedule = () => {
    if (!newDate || !newTime) {
      toast({
        title: "Missing Information",
        description: "Please select both new date and time.",
        variant: "destructive"
      });
      return;
    }

    onReschedule(appointment?.id, newDate, newTime);
    toast({
      title: "Reschedule Request Sent",
      description: `Your request to reschedule to ${newDate} at ${newTime} has been sent to the doctor.`,
    });
    
    onClose();
    setNewDate('');
    setNewTime('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reschedule Appointment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            <p><strong>Current appointment:</strong></p>
            <p>{appointment?.date} at {appointment?.time}</p>
            <p>With: {appointment?.doctorName}</p>
          </div>
          
          <div>
            <Label htmlFor="new-date">New Date</Label>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <Input
                id="new-date"
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="new-time">New Time</Label>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <Select value={newTime} onValueChange={setNewTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new time" />
                </SelectTrigger>
                <SelectContent>
                  {mockTimeSlots.map((time) => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button onClick={handleReschedule} className="flex-1">
              Send Reschedule Request
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RescheduleModal;
