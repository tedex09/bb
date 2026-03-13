import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div
      className={cn(
        'flex-1 w-full mx-auto px-4 py-6 pb-24 md:pb-6 md:px-6 lg:px-8 max-w-7xl',
        className
      )}
    >
      {children}
    </div>
  );
}
