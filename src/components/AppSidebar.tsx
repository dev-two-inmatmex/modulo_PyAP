'use client';
/*
import type { User } from '@supabase/supabase-js';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
  SidebarMenuButton
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  User as UserIcon,
  Clock,
  Users,
  Briefcase,
  ClipboardList,
  Eye,
  ChevronDown,
  Building,
  Settings,
  LayoutDashboard
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import LogoutButton from './LogOutButton';
import { useState } from 'react';
import { UserAvatar } from './reutilizables/UserAvatar';

// Interfaz para los props que el componente espera recibir
interface AppSidebarProps {
  userRoles: string[];
  user: User & { fullName: string; avatarUrl?: string };
}

export default function AppSidebar({ userRoles, user }: AppSidebarProps) {
  const pathname = usePathname();
  // 1. Obtenemos setOpen para controlar el menú en móvil
  const { setOpen } = useSidebar(); 
  const [openCollapsibles, setOpenCollapsibles] = useState<string[]>([]);

  // 2. Función que se llamará al hacer clic en un enlace para cerrar el menú
  const handleLinkClick = () => {
    setOpen(false);
  };

  const navItems = [
    { label: 'Checador', href: '/checador', icon: Clock, roles: []},
    { label: 'Dashboard', href: '/administracion', icon: LayoutDashboard, roles: ['Administrador'] },
    {
      label: 'Recursos Humanos',
      icon: Briefcase,
      roles: ['Recursos Humanos', 'Administrador'],
      subItems: [
        { label: 'Empleados', href: '/rh/empleados', icon: Users, roles: ['Recursos Humanos', 'Administrador'] },
        { label: 'Asistencias', href: '/rh/asistencias', icon: ClipboardList, roles: ['Recursos Humanos', 'Administrador'] },
      ],
    },
    { label: 'Configuraciones', href: '/administracion/configuraciones', icon: Settings, roles: ['Administrador'] },
    { label: 'Supervisor', href: '/supervisor', icon: Eye, roles: ['Supervisor', 'Administrador'] },
  ];

  const hasAccess = (requiredRoles?: string[]) => {
    if (!requiredRoles || requiredRoles.length === 0) return true;
    return requiredRoles.some((role) => userRoles.includes(role));
  };
  
  const isNavItemActive = (item: { href?: string, subItems?: {href: string}[] }) => {
    if (item.href && pathname === item.href) return true;
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
        <div className="flex items-center gap-2">*/
          {/*<Image src="/img/logo-s-white.svg" width={32} height={32} alt="Logo" className="rounded-lg" />*/}
          {/*<span className="text-lg font-semibold">INMATMEX</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) =>
            hasAccess(item.roles) ? (
              <SidebarMenuItem key={item.label}>
                {!item.subItems ? (
                  // 3. Añadimos onClick a los enlaces
                  <Link href={item.href || '#'} onClick={handleLinkClick}>
                    <SidebarMenuButton isActive={isNavItemActive(item)}>
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </SidebarMenuButton>
                  </Link>
                ) : (
                  <Collapsible open={openCollapsibles.includes(item.label)} onOpenChange={() => handleCollapsibleToggle(item.label)}>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        isActive={isNavItemActive(item)}
                        className="justify-between w-full"
                      >
                        <div className="flex items-center gap-2">
                          <item.icon className="w-5 h-5" />
                          <span>{item.label}</span>
                        </div>
                        <ChevronDown className={cn("size-4 transition-transform", openCollapsibles.includes(item.label) && "rotate-180")} />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.subItems.map(
                            (subItem) =>
                              hasAccess(subItem.roles) && (
                                <SidebarMenuSubItem key={subItem.label}>*/}
                                  {/* 3. Añadimos onClick a los enlaces del submenú */}
                                  {/*<Link href={subItem.href} onClick={handleLinkClick}>
                                      <SidebarMenuSubButton isActive={pathname === subItem.href}>
                                        {subItem.label}
                                      </SidebarMenuSubButton>
                                  </Link>
                                </SidebarMenuSubItem>
                              )
                          )}
                        </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </SidebarMenuItem>
            ) : null
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-3 w-full border-t pt-4">
          <Link href="/perfil" onClick={handleLinkClick}>
            <UserAvatar
              url={user.avatarUrl}
              name={user.fullName}
              className="w-9 h-9"
            />
          </Link>
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
  );*/}
//}


import type { User } from '@supabase/supabase-js';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
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
  Building, Settings,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import LogoutButton from './LogOutButton';
import { useState } from 'react';
import { UserAvatar } from './reutilizables/UserAvatar';

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
        label: 'Configuraciones',
        href: '/administracion/configuraciones',
        icon: Settings,
        roles: ['Administrador'],
      },
    ],
  },
  {
    label: 'Dirección',
    href: '/direccion',
    icon: Briefcase,
    roles: ['Dirección', 'Administrador'],
  },
  {
    label: 'Recursos Humanos', href: '/rh', icon: ClipboardList, roles: ['RH', 'Administrador'],
    subItems: [
      {
        label: 'Empleados',
        href: '/rh/empleados',
        icon: Users,
        roles: ['RH', 'Administrador'],
      },
      {
        label: 'Asistencias',
        href: '/rh/asistencias',
        icon: Users,
        roles: ['RH', 'Administrador'],
      },
    ],
  },
  { label: 'Supervisor', href: '/supervisor', icon: Eye, roles: ['Supervisor', 'Administrador'] },
];

interface AppSidebarProps {
  userRoles: string[];
  user: User & { fullName: string; avatarUrl?: string };
}

export default function AppSidebar({ userRoles, user }: AppSidebarProps) {
  const pathname = usePathname();
  const { state: sidebarState, isMobile,setOpenMobile } = useSidebar();
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

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    // 1. Si el usuario ya está en esta ruta, prevenimos la recarga
    if (pathname === href) {
      e.preventDefault();
    }
    
    // 2. Si estamos en móvil, siempre cerramos la barra lateral al hacer clic
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Building className="size-6 text-primary" />
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
                    <Link href={item.href} onClick={(e) => handleLinkClick(e, item.href)}>
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
                                  <SidebarMenuSubButton 
                                  asChild 
                                  isActive={pathname === subItem.href}>
                                    <Link href={subItem.href} onClick={(e) => handleLinkClick(e, item.href)}>
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
          <UserAvatar
            url={user.avatarUrl}
            name={user.fullName}
            className="w-9 h-9"
          />
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

