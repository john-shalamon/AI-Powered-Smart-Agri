import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'sm';
}

export function StatusBadge({ status, variant = 'default' }: StatusBadgeProps) {
  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-700 border-green-200',
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
    'in-transit': 'bg-purple-100 text-purple-700 border-purple-200',
    in_transit: 'bg-purple-100 text-purple-700 border-purple-200',
    delivered: 'bg-green-100 text-green-700 border-green-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200',
    sold: 'bg-slate-100 text-slate-700 border-slate-200',
    reserved: 'bg-orange-100 text-orange-700 border-orange-200',
    expired: 'bg-gray-100 text-gray-700 border-gray-200',
    open: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    assigned: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    accepted: 'bg-teal-100 text-teal-700 border-teal-200',
    rejected: 'bg-rose-100 text-rose-700 border-rose-200',
  };

  const color = statusColors[status.toLowerCase()] || statusColors.pending;

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium border rounded-full',
        variant === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        color
      )}
    >
      {status}
    </span>
  );
}
