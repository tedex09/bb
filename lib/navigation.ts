import { NavigationItem } from '@/types';

export const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: 'LayoutDashboard',
  },
  {
    id: 'agenda',
    label: 'Agenda',
    href: '/agenda',
    icon: 'Calendar',
  },
  {
    id: 'clients',
    label: 'Clients',
    href: '/clients',
    icon: 'Users',
  },
  {
    id: 'barbers',
    label: 'Barbers',
    href: '/barbers',
    icon: 'Scissors',
  },
  {
    id: 'services',
    label: 'Services',
    href: '/services',
    icon: 'Sparkles',
  },
  {
    id: 'finance',
    label: 'Finance',
    href: '/finance',
    icon: 'DollarSign',
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: 'Settings',
  },
];
