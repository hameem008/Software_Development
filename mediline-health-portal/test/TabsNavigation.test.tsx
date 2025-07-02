import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import TabsNavigation from '@/components/patient/TabsNavigation';



const mockTabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'availability', label: 'Availability & Locations' },
  { key: 'reviews', label: 'Reviews (10)' },
];

describe('TabsNavigation', () => {
  it('renders all tabs with correct labels', () => {

    render(<TabsNavigation tabs={mockTabs} activeTab="overview" onTabChange={() => {}} />);

    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Availability & Locations')).toBeInTheDocument();
    expect(screen.getByText('Reviews (10)')).toBeInTheDocument();
  });

  
  it('calls onTabChange with correct tab key when a tab is clicked', () => {
    const mockOnTabChange = vi.fn();
    render(<TabsNavigation tabs={mockTabs} activeTab="overview" onTabChange={mockOnTabChange} />);

    fireEvent.click(screen.getByText('Availability & Locations'));
    expect(mockOnTabChange).toHaveBeenCalledWith('availability');

    fireEvent.click(screen.getByText('Reviews (10)'));
    expect(mockOnTabChange).toHaveBeenCalledWith('reviews');
  });

  it('renders correctly with empty tabs array', () => {
    render(<TabsNavigation tabs={[]} activeTab="overview" onTabChange={() => {}} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

});