import { cn } from '../../lib/utils';

interface ProgressProps {
  value: number; // 0-100
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'brand' | 'success' | 'warning' | 'error' | 'info';
  showLabel?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

const colorMap = {
  brand: 'bg-brand-primary',
  success: 'bg-status-success',
  warning: 'bg-status-warning',
  error: 'bg-status-error',
  info: 'bg-status-info',
};

function Progress({
  value,
  max = 100,
  size = 'md',
  color = 'brand',
  showLabel = false,
  className,
}: ProgressProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-text-light-secondary dark:text-text-dark-secondary">
            Progresso
          </span>
          <span className="text-xs font-semibold text-text-light-primary dark:text-text-dark-primary">
            {Math.round(percent)}%
          </span>
        </div>
      )}
      <div
        className={cn(
          'w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden',
          sizeMap[size]
        )}
      >
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', colorMap[color])}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export { Progress };
