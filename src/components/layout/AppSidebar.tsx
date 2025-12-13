'use client';

import { usePathname } from 'next/navigation';
import {
  ShieldCheck,
  LayoutDashboard,
  FileText,
  PlusCircle,
  Database,
  Users,
} from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const menuItems = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/requests',
      label: 'Requests',
      icon: ShieldCheck,
    },
    {
      href: '/resources',
      label: 'Resources',
      icon: Database,
      roles: ['admin'],
    },
    {
      href: '/users',
      label: 'Users',
      icon: Users,
      roles: ['admin'],
    },
    {
      href: '/audit-log',
      label: 'Audit Log',
      icon: FileText,
      roles: ['admin', 'approver'],
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="font-semibold text-lg">AccessFlow</span>
        </div>
      </SidebarHeader>

      <SidebarMenu>
        {menuItems.map(
          (item) =>
            (!item.roles || item.roles.includes(user?.role || '')) && (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={
                    item.href === '/dashboard'
                      ? pathname === item.href
                      : pathname.startsWith(item.href)
                  }
                  tooltip={{ children: item.label }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
        )}
      </SidebarMenu>
      
      <SidebarFooter>
         <Button asChild className="w-full">
          <Link href="/requests/new">
            <PlusCircle />
            <span>New Request</span>
          </Link>
         </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
