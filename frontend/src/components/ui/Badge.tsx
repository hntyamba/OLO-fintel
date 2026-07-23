import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 font-medium rounded-lg px-2.5 py-0.5 text-xs',
  {
    variants: {
      variant: {
        default: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
        success: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        warning: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        error: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        info: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        brand: 'bg-brand-primary/10 text-brand-primary',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            variant === 'success' && 'bg-green-500',
            variant === 'warning' && 'bg-amber-500',
            variant === 'error' && 'bg-red-500',
            variant === 'info' && 'bg-blue-500',
            variant === 'brand' && 'bg-brand-primary',
            variant === 'default' && 'bg-gray-500'
          )}
        />
      )}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
