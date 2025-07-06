import { render, screen } from '@testing-library/react';
import DoctorAvailabilityBadges from "../src/components/patient/DoctorAvailabilityBadges";


describe('DoctorAvailabilityBadges', () => {

  it('renders all days if 3 or fewer', () => {
    render(<DoctorAvailabilityBadges days={['Mon', 'Tue']} />);

    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Tue')).toBeInTheDocument();
    expect(screen.queryByText(/\+\d+ more/)).not.toBeInTheDocument();
  });

  it('shows "+N more" badge when more than 3 days', () => {
    render(<DoctorAvailabilityBadges days={['Mon', 'Tue', 'Wed', 'Thu', 'Fri']} />);

    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Tue')).toBeInTheDocument();
    expect(screen.getByText('Wed')).toBeInTheDocument();
    expect(screen.getByText('+2 more')).toBeInTheDocument();
  });
});
