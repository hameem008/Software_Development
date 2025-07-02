import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User, Star } from 'lucide-react';

interface Review {
  patientName: string;
  reviewText: string | null;
  rating: number;
  date: string;
}

interface ReviewsTabProps {
  reviews: Review[];
}

const ReviewsTab: React.FC<ReviewsTabProps> = ({ reviews }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review, index) => (
              <div key={index}>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-500" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900">{review.patientName}</span>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    {review.reviewText && <p className="text-gray-600">{review.reviewText}</p>}
                  </div>
                </div>
                {index < reviews.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">No reviews yet</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewsTab;