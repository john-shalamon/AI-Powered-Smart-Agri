'use client';

import { Card } from '@/components/ui/card';
import { RatingDisplay } from '@/components/shared/rating-display';
import { Star, ThumbsUp } from 'lucide-react';

const reviews = [
  {
    id: '1',
    orderId: 'ORD-12345',
    customerName: 'Rajesh Kumar',
    rating: 5,
    comment: 'Excellent service! Delivery was on time and the driver was very professional.',
    date: '2024-06-15',
  },
  {
    id: '2',
    orderId: 'ORD-12344',
    customerName: 'Priya Sharma',
    rating: 5,
    comment: 'Great experience. Crops arrived in perfect condition.',
    date: '2024-06-14',
  },
  {
    id: '3',
    orderId: 'ORD-12343',
    customerName: 'Amit Patel',
    rating: 4,
    comment: 'Good service, slightly delayed but overall satisfied.',
    date: '2024-06-13',
  },
  {
    id: '4',
    orderId: 'ORD-12342',
    customerName: 'Sunita Reddy',
    rating: 5,
    comment: 'Very reliable transporter. Highly recommend!',
    date: '2024-06-12',
  },
];

export default function ReviewsPage() {
  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const totalReviews = reviews.length;
  const fiveStarCount = reviews.filter(r => r.rating === 5).length;
  const fourStarCount = reviews.filter(r => r.rating === 4).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Reviews & Ratings</h1>
        <p className="text-muted-foreground">See what customers are saying about your service</p>
      </div>

      {/* Rating Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 backdrop-blur-xl bg-card/80 border-border shadow-lg">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Average Rating</p>
            <p className="text-5xl font-bold text-foreground mb-2">{averageRating.toFixed(1)}</p>
            <RatingDisplay rating={averageRating} />
            <p className="text-sm text-muted-foreground mt-2">{totalReviews} reviews</p>
          </div>
        </Card>

        <Card className="p-6 backdrop-blur-xl bg-card/80 border-border shadow-lg">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-muted-foreground">Rating Distribution</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm text-foreground">5</span>
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${(fiveStarCount / totalReviews) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-8 text-right">{fiveStarCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm text-foreground">4</span>
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${(fourStarCount / totalReviews) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-8 text-right">{fourStarCount}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 backdrop-blur-xl bg-card/80 border-border shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-green-100 flex items-center justify-center">
              <ThumbsUp className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">{((fiveStarCount / totalReviews) * 100).toFixed(0)}%</p>
              <p className="text-sm text-muted-foreground">Positive Reviews</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Recent Reviews</h3>
        {reviews.map((review) => (
          <Card key={review.id} className="p-6 backdrop-blur-xl bg-card/80 border-border shadow-lg">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-foreground">{review.customerName}</p>
                  <p className="text-sm text-muted-foreground">Order #{review.orderId}</p>
                </div>
                <div className="text-right">
                  <RatingDisplay rating={review.rating} />
                  <p className="text-sm text-muted-foreground mt-1">{new Date(review.date).toLocaleDateString()}</p>
                </div>
              </div>
              <p className="text-foreground leading-relaxed">{review.comment}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
