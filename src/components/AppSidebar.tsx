
'use client';

import type { User } from '@supabase/supabase-js';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  User as UserIcon,
  Clock,
  Shield,
  Users,
  Briefcase,
  ClipboardList,
  Eye,
  ChevronDown,
  Building,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import LogoutButton from './LogOutButton';
import { useState } from 'react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles?: string[];
  subItems?: NavItem[];
}

const navItems: NavItem[] = [
  { label: 'Perfil', href: '/perfil', icon: UserIcon },
  { label: 'Checador', href: '/checador', icon: Clock },
  {
    label: 'Administración',
    href: '/administracion',
    icon: Shield,
    roles: ['Administrador'],
    subItems: [
      {
        label: 'Personal',
        href: '/administracion/personal',
        icon: Users,
        roles: ['Administrador'],
      },
    ],
  },
  {
    label: 'Dirección',
    href: '/direccion',
    icon: Briefcase,
    roles: ['Dirección'],
  },
  { label: 'Recursos Humanos', href: '/rh', icon: ClipboardList, roles: ['RH'] },
  { label: 'Supervisor', href: '/supervisor', icon: Eye, roles: ['Supervisor'] },
];

interface AppSidebarProps {
  userRoles: string[];
  user: User & { fullName: string };
}

export default function AppSidebar({ userRoles, user }: AppSidebarProps) {
  const pathname = usePathname();
  const { state: sidebarState } = useSidebar();
  const [openCollapsibles, setOpenCollapsibles] = useState<string[]>([]);

  const hasAccess = (requiredRoles?: string[]) => {
    if (!requiredRoles || requiredRoles.length === 0) return true;
    return requiredRoles.some((role) => userRoles.includes(role));
  };

  const isNavItemActive = (item: NavItem) => {
    if (pathname === item.href) return true;
    if (item.subItems) {
      return item.subItems.some(sub => pathname.startsWith(sub.href));
    }
    return false;
  };

  const handleCollapsibleToggle = (label: string) => {
    setOpenCollapsibles(prev => 
      prev.includes(label) ? prev.filter(item => item !== label) : [...prev, label]
    );
  };
  
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <Building className="size-6 text-primary"/>
            <span className="text-lg font-semibold">INMATMEX</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) =>
            hasAccess(item.roles) ? (
              <SidebarMenuItem key={item.label}>
                {!item.subItems ? (
                  <SidebarMenuButton
                    asChild
                    isActive={isNavItemActive(item)}
                    tooltip={item.label}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                ) : (
                  <Collapsible open={openCollapsibles.includes(item.label)} onOpenChange={() => handleCollapsibleToggle(item.label)}>
                    <CollapsibleTrigger asChild>
                       <SidebarMenuButton
                        isActive={isNavItemActive(item)}
                        className="justify-between"
                      >
                         <div className="flex items-center gap-2">
                          <item.icon />
                          <span>{item.label}</span>
                         </div>
                        <ChevronDown className={cn("size-4 transition-transform", openCollapsibles.includes(item.label) && "rotate-180")} />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                       {sidebarState === 'expanded' && (
                         <SidebarMenuSub>
                          {item.subItems.map(
                            (subItem) =>
                              hasAccess(subItem.roles) && (
                                <SidebarMenuSubItem key={subItem.label}>
                                  <SidebarMenuSubButton asChild isActive={pathname === subItem.href}>
                                    <Link href={subItem.href}>
                                        <span>{subItem.label}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              )
                          )}
                        </SidebarMenuSub>
                       )}
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </SidebarMenuItem>
            ) : null
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={`https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(
                user.fullName
              )}`}
            />
            <AvatarFallback>{user.fullName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-sm overflow-hidden">
            <span className="font-semibold truncate">{user.fullName}</span>
            <span className="text-muted-foreground text-xs truncate">
              {user.email}
            </span>
          </div>
          <LogoutButton />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
