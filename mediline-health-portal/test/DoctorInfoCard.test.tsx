import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import DoctorInfoCard from '@/components/patient/DoctorInfoCard';



const mockDoctor = {
  doctorId: 2,
  name: 'Dr. Rajib Saha Rony',
  specialization: 'Medicine',
  designation: 'Medical Officer',
  academicInstitution: 'Armed Forces Medical College',
  degrees: [{ degree: 'MBBS', institution: 'Armed Forces Medical College', year: 1990 }],
  rating: 3.4,
  avatar: 'http://example.com/avatar.jpg',
};

describe('DoctorInfoCard', () => {
  it('renders doctor details correctly', () => {
    render(<DoctorInfoCard doctor={mockDoctor} reviewCount={10} onBookAppointment={() => {}} />);

    expect(screen.getByText('Dr. Rajib Saha Rony')).toBeInTheDocument();
    expect(screen.getByText('Medicine')).toBeInTheDocument();
    expect(screen.getByText('MBBS')).toBeInTheDocument();
    expect(screen.getByText('Armed Forces Medical College')).toBeInTheDocument();
    expect(screen.getByText('Medical Officer')).toBeInTheDocument();
    expect(screen.getByText('3.4')).toBeInTheDocument();
    expect(screen.getByText('(10 reviews)')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Dr. Rajib Saha Rony' })).toHaveAttribute('src', mockDoctor.avatar);
  });

  it('displays zero reviews correctly', () => {
    render(<DoctorInfoCard doctor={mockDoctor} reviewCount={0} onBookAppointment={() => {}} />);

    expect(screen.getByText('(0 reviews)')).toBeInTheDocument();
    expect(screen.getByText('3.4')).toBeInTheDocument();
  });

  it('renders no degrees correctly', () => {
    const doctorNoDegrees = { ...mockDoctor, degrees: [] };
    render(<DoctorInfoCard doctor={doctorNoDegrees} reviewCount={10} onBookAppointment={() => {}} />);

    expect(screen.getByText('Dr. Rajib Saha Rony')).toBeInTheDocument();
    expect(screen.queryByText('MBBS')).not.toBeInTheDocument();
  });

  it('calls onBookAppointment when the Book Appointment button is clicked', () => {
    const mockOnBookAppointment = vi.fn();
    render(<DoctorInfoCard doctor={mockDoctor} reviewCount={10} onBookAppointment={mockOnBookAppointment} />);

    fireEvent.click(screen.getByText('Book Appointment'));
    expect(mockOnBookAppointment).toHaveBeenCalledTimes(1);
  });
});