'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Scissors,
  Sparkles,
  DollarSign,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { navigationItems } from '@/lib/navigation';

const iconMap = {
  LayoutDashboard,
  Calendar,
  Users,
  Scissors,
  Sparkles,
  DollarSign,
  Settings,
};

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 border-r border-border bg-background flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold tracking-tight">SalonPro</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Management Platform
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navigationItems.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                isActive
                  ? 'bg-accent text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
            <span className="text-sm font-medium">U</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">User Account</p>
            <p className="text-xs text-muted-foreground truncate">
              user@example.com
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
