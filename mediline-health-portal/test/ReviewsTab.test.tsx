import { render, screen } from '@testing-library/react';
import ReviewsTab from '@/components/patient/ReviewsTab';


const mockReviews = [
  {
    patientName: 'Farhan Miah',
    reviewText: 'Expected better communication.',
    rating: 2,
    date: '2024-11-03',
  },
  {
    patientName: 'Nafis Hasan',
    reviewText: 'Excellent care and very attentive.',
    rating: 5,
    date: '2024-10-19',
  }
];

describe('ReviewsTab', () => {
  it('renders all reviews with correct details', () => {
    render(<ReviewsTab reviews={mockReviews} />);

    expect(screen.getByText('Patient Reviews')).toBeInTheDocument();

    mockReviews.forEach((review) => {
      // Verify patient name
      expect(screen.getByText(review.patientName)).toBeInTheDocument();

      // Verify date
      expect(screen.getByText(review.date)).toBeInTheDocument();
    });
  });

  it('renders "No reviews yet" when reviews array is empty', () => {
    render(<ReviewsTab reviews={[]} />);

    expect(screen.getByText('No reviews yet')).toBeInTheDocument();
    expect(screen.queryByText(mockReviews[0].patientName)).not.toBeInTheDocument();
    expect(screen.queryByTestId('separator')).not.toBeInTheDocument();
  });
});