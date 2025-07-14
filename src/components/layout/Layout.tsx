// src/components/layout/Layout.tsx
import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from '@/components/ui/sidebar';
import Header from './Header'; // Assuming you have this
import { Home, Users, PlusCircle } from 'lucide-react';

interface LayoutProps {
    children?: ReactNode; // Explicitly define children prop
}
interface MenuItem {
    id: string;
    label: string;
    path: string;
    permission?: string;
    icon?: React.ElementType; // Type for React component (icon)
  }

  
const Layout = ({ children }: LayoutProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: Home },
    { id: 'users', label: 'Users Listing', path: '/userslisting', permission: 'manage_users',icon: Users },
    { id: 'projects', label: 'Create Project', path: '/projects/create', permission: 'create_projects', icon: PlusCircle },
    // Add more menu items as needed
  ];

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        {/* Sidebar */}
        <Sidebar side="left" collapsible="icon">
          <SidebarHeader>
            {/* <h2 className="text-lg font-bold text-sidebar-foreground">Menu</h2> */}
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map(item => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild>
                  <a href={item.path} className="w-full block flex items-center gap-2">
                      {item.icon && <item.icon className="h-4 w-4" />}
                      <span className="truncate">{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarTrigger />
        </Sidebar>

        {/* Main Content and Header/Footer */}
        <div className="flex-1 flex flex-col min-h-0">
          <Header />
          <main className="flex-1 p-6 bg-gray-50 overflow-auto">
            {children || <Outlet />} {/* Render children if provided, otherwise use Outlet */}
          </main>         
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;