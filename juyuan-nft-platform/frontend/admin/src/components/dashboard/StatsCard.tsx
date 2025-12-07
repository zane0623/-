import { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'cyan' | 'red';
}

const colorMap = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
  },
  green: {
    bg: 'bg-green-50',
    icon: 'text-green-600',
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'text-purple-600',
  },
  orange: {
    bg: 'bg-orange-50',
    icon: 'text-orange-600',
  },
  cyan: {
    bg: 'bg-cyan-50',
    icon: 'text-cyan-600',
  },
  red: {
    bg: 'bg-red-50',
    icon: 'text-red-600',
  },
};

export function StatsCard({ title, value, icon: Icon, trend, trendUp, color }: StatsCardProps) {
  const colors = colorMap[color];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className={clsx('p-3 rounded-lg', colors.bg)}>
          <Icon className={clsx('w-6 h-6', colors.icon)} />
        </div>
        {trend && (
          <span
            className={clsx(
              'text-sm font-medium',
              trendUp ? 'text-green-600' : 'text-red-600'
            )}
          >
            {trend}
          </span>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  );
}

