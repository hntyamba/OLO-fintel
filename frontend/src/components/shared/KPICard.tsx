import { cn } from '../../lib/utils';
import { Card } from '../ui/Card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'flat';
  className?: string;
}

function KPICard({ title, value, change, changeLabel, icon, trend, className }: KPICardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor =
    trend === 'up'
      ? 'text-status-success'
      : trend === 'down'
        ? 'text-status-error'
        : 'text-gray-400';

  return (
    <Card className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-text-light-secondary dark:text-text-dark-secondary uppercase tracking-wider">
          {title}
        </span>
        {icon && (
          <div className="p-2 rounded-xl bg-brand-primary/10 text-brand-primary">
            {icon}
          </div>
        )}
      </div>
      <div className="olo-metric-val">{value}</div>
      {change !== undefined && (
        <div className="flex items-center gap-1.5">
          <TrendIcon className={cn('h-3.5 w-3.5', trendColor)} />
          <span className={cn('text-xs font-semibold', trendColor)}>
            {change > 0 ? '+' : ''}
            {change}%
          </span>
          {changeLabel && (
            <span className="text-xs text-text-light-secondary dark:text-text-dark-secondary">
              {changeLabel}
            </span>
          )}
        </div>
      )}
    </Card>
  );
}

export { KPICard };
