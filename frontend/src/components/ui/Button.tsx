import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
  {
    variants: {
      variant: {
        primary:
          'bg-brand-primary text-white shadow-[0_2px_8px_rgba(13,166,118,0.25)] hover:shadow-[0_4px_12px_rgba(13,166,118,0.35)] hover:-translate-y-0.5 active:translate-y-0',
        secondary:
          'border border-brand-primary text-brand-primary bg-transparent hover:bg-brand-primary hover:text-white',
        ghost:
          'text-text-light-secondary hover:bg-neutralBg hover:text-text-light-primary dark:text-text-dark-secondary dark:hover:bg-surface-dark-elevated dark:hover:text-text-dark-primary',
        danger:
          'bg-status-error text-white hover:bg-red-600',
        muted:
          'bg-neutralBg text-text-light-secondary hover:bg-gray-200 dark:bg-surface-dark dark:text-text-dark-secondary dark:hover:bg-surface-dark-elevated',
      },
      size: {
        sm: 'h-8 px-3 text-xs rounded-lg',
        md: 'h-9 px-4 text-sm rounded-xl',
        lg: 'h-11 px-6 text-sm rounded-xl',
        icon: 'h-9 w-9 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
