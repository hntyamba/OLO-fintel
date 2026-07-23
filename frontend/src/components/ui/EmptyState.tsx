import { cn } from '../../lib/utils';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 text-center',
        className
      )}
    >
      <div className="mb-4 p-4 rounded-2xl bg-gray-100 dark:bg-surface-dark-elevated">
        {icon || <Inbox className="h-8 w-8 text-gray-400 dark:text-text-dark-secondary" />}
      </div>
      <h3 className="text-base font-semibold text-text-light-primary dark:text-text-dark-primary mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary max-w-sm mb-4">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}

export { EmptyState };
