import { render, screen } from '@testing-library/react';
import UserImage from '@/components/common/UserImage';


describe('UserImage', () => {
  it('renders the avatar image when provided', () => {
    const avatarUrl = 'http://example.com/avatar.jpg';
    const name = 'Dr. Rajib Saha Rony';

    render(<UserImage avatar={avatarUrl} name={name} />);

    const img = screen.getByTestId('doctor-avatar');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', avatarUrl);
    expect(img).toHaveAttribute('alt', name);
    expect(img).toHaveClass('w-24', 'h-24', 'rounded-full', 'object-cover');
    expect(screen.queryByTestId('avatar-fallback')).not.toBeInTheDocument();
    expect(screen.queryByTestId('user-icon')).not.toBeInTheDocument();
  });

  it('renders the fallback UI when no avatar is provided', () => {
    const name = 'Dr. Rajib Saha Rony';

    render(<UserImage avatar={undefined} name={name} />);

    const fallback = screen.getByTestId('avatar-fallback');
    expect(fallback).toBeInTheDocument();
    expect(fallback).toHaveClass('w-24', 'h-24', 'bg-medical-100', 'rounded-full', 'flex', 'items-center', 'justify-center');
    expect(screen.getByTestId('user-icon')).toBeInTheDocument();
    expect(screen.getByTestId('user-icon')).toHaveClass('w-12', 'h-12', 'text-medical-600');
    expect(screen.queryByTestId('doctor-avatar')).not.toBeInTheDocument();
  });

  it('handles empty name gracefully in fallback mode', () => {
    render(<UserImage avatar={undefined} name="" />);

    const fallback = screen.getByTestId('avatar-fallback');
    expect(fallback).toBeInTheDocument();
    expect(screen.getByTestId('user-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('doctor-avatar')).not.toBeInTheDocument();
  });

});