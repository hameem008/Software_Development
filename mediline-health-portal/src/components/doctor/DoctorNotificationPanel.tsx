
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, Calendar, UserCheck, XCircle, Clock } from 'lucide-react';

interface DoctorNotification {
  id: string;
  type: 'new_appointment' | 'reschedule_request' | 'appointment_cancelled';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  patientName?: string;
}

const mockDoctorNotifications: DoctorNotification[] = [
  {
    id: '1',
    type: 'new_appointment',
    title: 'New Appointment Booked',
    message: 'John Smith has booked an appointment for June 15 at 2:00 PM.',
    time: '1 hour ago',
    isRead: false,
    patientName: 'John Smith'
  },
  {
    id: '2',
    type: 'reschedule_request',
    title: 'Reschedule Request',
    message: 'Sarah Wilson wants to reschedule from June 10 to June 12.',
    time: '3 hours ago',
    isRead: false,
    patientName: 'Sarah Wilson'
  },
  {
    id: '3',
    type: 'appointment_cancelled',
    title: 'Appointment Cancelled',
    message: 'Mike Johnson cancelled his appointment for June 8.',
    time: '1 day ago',
    isRead: true,
    patientName: 'Mike Johnson'
  }
];

const DoctorNotificationPanel = () => {
  const [notifications, setNotifications] = useState(mockDoctorNotifications);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_appointment':
        return <UserCheck className="w-4 h-4 text-green-600" />;
      case 'reschedule_request':
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case 'appointment_cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 bg-white" align="end">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-96 overflow-y-auto">
          {notifications.slice(0, 5).map((notification) => (
            <DropdownMenuItem 
              key={notification.id}
              className="p-0"
              onClick={() => markAsRead(notification.id)}
            >
              <div className={`w-full p-3 ${!notification.isRead ? 'bg-blue-50' : ''}`}>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <div className="flex items-center mt-2">
                      <Clock className="w-3 h-3 mr-1 text-gray-400" />
                      <span className="text-xs text-gray-500">{notification.time}</span>
                    </div>
                  </div>
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                  )}
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-center">
          <span className="text-sm text-medical-600 font-medium">View All Notifications</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DoctorNotificationPanel;
