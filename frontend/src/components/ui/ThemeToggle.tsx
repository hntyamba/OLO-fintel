import { useTheme } from '../../hooks/useTheme';
import { Moon, Sun, Monitor } from 'lucide-react';
import { cn } from '../../lib/utils';

function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  const nextTheme = () => {
    const order: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const idx = order.indexOf(theme);
    setTheme(order[(idx + 1) % order.length]);
  };

  const icons = {
    light: Sun,
    dark: Moon,
    system: Monitor,
  };

  const Icon = icons[theme];

  return (
    <button
      onClick={nextTheme}
      className={cn(
        'p-2 rounded-xl text-text-light-secondary hover:bg-neutralBg hover:text-text-light-primary transition-colors',
        'dark:text-text-dark-secondary dark:hover:bg-surface-dark-elevated dark:hover:text-text-dark-primary',
        className
      )}
      title={`Tema: ${theme}`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

export { ThemeToggle };
