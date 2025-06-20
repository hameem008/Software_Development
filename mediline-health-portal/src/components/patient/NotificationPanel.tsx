
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, FileText, TestTube, Calendar, Clock } from 'lucide-react';

interface Notification {
  id: string;
  type: 'prescription' | 'test' | 'appointment';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  actionLink?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'prescription',
    title: 'New Prescription Added',
    message: 'Dr. Sarah Johnson has issued a new prescription.',
    time: '2 hours ago',
    isRead: false,
    actionLink: '/patient/prescriptions'
  },
  {
    id: '2',
    type: 'test',
    title: 'Test Result Ready',
    message: 'CBC test report is now available for viewing.',
    time: '5 hours ago',
    isRead: false,
    actionLink: '/patient/tests'
  },
  {
    id: '3',
    type: 'appointment',
    title: 'Upcoming Appointment Reminder',
    message: 'Reminder: Appointment with Dr. Sarah Johnson on June 5, at 10:00 AM, City General Hospital.',
    time: '1 day ago',
    isRead: true,
    actionLink: '/patient/appointments'
  },
  {
    id: '4',
    type: 'prescription',
    title: 'Medication Refill Due',
    message: 'Your Lisinopril prescription expires in 3 days.',
    time: '2 days ago',
    isRead: true,
    actionLink: '/patient/prescriptions'
  }
];

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'prescription':
        return <FileText className="w-4 h-4" />;
      case 'test':
        return <TestTube className="w-4 h-4" />;
      case 'appointment':
        return <Calendar className="w-4 h-4" />;
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

export default NotificationPanel;
