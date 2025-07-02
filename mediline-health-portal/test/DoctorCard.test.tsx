import { render, screen } from '@testing-library/react';
import DoctorCard from '@/components/patient/DoctorCard';
import { MemoryRouter } from 'react-router-dom';

const mockDoctor = {
  doctorId: 'doc123',
  name: 'Dr. John Doe',
  specialization: 'Cardiology',
  degree: 'MBBS, MD',
  academicInstitution: 'Dhaka Medical College',
  designation: 'Consultant Cardiologist',
  consultationFee: 500,
  availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
  rating: 4.7,
  avatar: '', // Leave blank to test fallback icon
};

describe('DoctorCard', () => {
  it('renders doctor info correctly', () => {
    render(
      <MemoryRouter>
        <DoctorCard doctor={mockDoctor} />
      </MemoryRouter>
    );

    expect(screen.getByText('Dr. John Doe')).toBeInTheDocument();
    expect(screen.getByText('Cardiology')).toBeInTheDocument();
    expect(screen.getByText('MBBS, MD')).toBeInTheDocument();
    expect(screen.getByText('Dhaka Medical College')).toBeInTheDocument();
    expect(screen.getByText('Consultant Cardiologist')).toBeInTheDocument();
    expect(screen.getByText('$500')).toBeInTheDocument();
    expect(screen.getByText('+1 more')).toBeInTheDocument(); // 4 available days
  });

  it('has working navigation links', () => {
    render(
      <MemoryRouter>
        <DoctorCard doctor={mockDoctor} />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /book appointment/i })).toHaveAttribute(
      'href',
      `/patient/book-appointment/${mockDoctor.doctorId}`
    );

    expect(screen.getByRole('link', { name: /view profile/i })).toHaveAttribute(
      'href',
      `/patient/doctors/${mockDoctor.doctorId}`
    );
  });
});
