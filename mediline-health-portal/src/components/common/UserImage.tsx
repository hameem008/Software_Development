import React from 'react';
import { User } from 'lucide-react';

interface UserImageProps {
  avatar?: string;
  name: string;
}

const UserImage: React.FC<UserImageProps> = ({ avatar, name }) => {
  return (
    <div className="flex-shrink-0">
      {avatar ? (
        <img
          src={avatar}
          alt={name}
          className="w-24 h-24 rounded-full object-cover"
          data-testid="doctor-avatar"
        />
      ) : (
        <div
          className="w-24 h-24 bg-medical-100 rounded-full flex items-center justify-center"
          data-testid="avatar-fallback"
        >
          <User className="w-12 h-12 text-medical-600" data-testid="user-icon" />
        </div>
      )}
    </div>
  );
};

export default UserImage;