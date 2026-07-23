import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-surface-light border border-border-light rounded-2xl shadow-[0_1px_3px_0_rgb(0,0,0,0.04)] p-5 transition-all duration-200',
          'dark:bg-surface-dark dark:border-border-dark',
          hover && 'hover:shadow-[0_4px_12px_0_rgb(0,0,0,0.06)] cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export { Card };
