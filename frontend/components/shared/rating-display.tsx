import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingDisplayProps {
  rating: number;
  showNumber?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function RatingDisplay({
  rating,
  showNumber = true,
  size = 'md',
  className,
}: RatingDisplayProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            sizeClasses[size],
            star <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-slate-200 text-slate-200'
          )}
        />
      ))}
      {showNumber && (
        <span className={cn('font-medium text-slate-700 ml-1', textSizes[size])}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
