import { useState } from 'react';
import { cn } from '../../lib/utils';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab?: string;
  onChange: (tabId: string) => void;
  className?: string;
}

function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  const [active, setActive] = useState(activeTab || tabs[0]?.id);

  const handleChange = (id: string) => {
    setActive(id);
    onChange(id);
  };

  const current = activeTab ?? active;

  return (
    <div className={cn('flex gap-1 border-b border-border-light dark:border-border-dark', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleChange(tab.id)}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px',
            current === tab.id
              ? 'border-brand-primary text-brand-primary'
              : 'border-transparent text-text-light-secondary hover:text-text-light-primary dark:text-text-dark-secondary dark:hover:text-text-dark-primary'
          )}
        >
          {tab.icon}
          {tab.label}
          {tab.count !== undefined && (
            <span className="ml-1 px-1.5 py-0.5 text-xs rounded-md bg-gray-100 dark:bg-gray-800">
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export { Tabs };
export type { Tab, TabsProps };
