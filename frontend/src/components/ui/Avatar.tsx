import { cn } from '../../lib/utils';
import { getInitials } from '../../lib/utils';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
};

const colorPalette = [
  'bg-brand-primary text-white',
  'bg-purple-500 text-white',
  'bg-blue-500 text-white',
  'bg-amber-500 text-white',
  'bg-rose-500 text-white',
  'bg-cyan-500 text-white',
];

function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const colorIndex =
    name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colorPalette.length;

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('rounded-full object-cover', sizeMap[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-semibold',
        sizeMap[size],
        colorPalette[colorIndex],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}

export { Avatar };
