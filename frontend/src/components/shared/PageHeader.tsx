import { cn } from '../../lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
  className?: string;
}

function PageHeader({ title, description, action, breadcrumbs, className }: PageHeaderProps) {
  return (
    <div className={cn('mb-6', className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 mb-3 text-xs text-text-light-secondary dark:text-text-dark-secondary">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <span>/</span>}
              {crumb.href ? (
                <a href={crumb.href} className="hover:text-brand-primary transition-colors">
                  {crumb.label}
                </a>
              ) : (
                <span className="text-text-light-primary dark:text-text-dark-primary font-medium">
                  {crumb.label}
                </span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-light-primary dark:text-text-dark-primary tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-text-light-secondary dark:text-text-dark-secondary">
              {description}
            </p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}

export { PageHeader };
