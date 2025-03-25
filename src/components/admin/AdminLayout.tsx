
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { MusicIcon, LayoutDashboard, Settings, Calendar, LogOut } from 'lucide-react';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail
} from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const { isAuthenticated, logout } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    toast({
      title: "Sesión cerrada",
      description: "Ha cerrado sesión exitosamente.",
    });
    navigate('/admin');
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex bg-slate-50 w-full">
        <Sidebar>
          <SidebarRail />
          <SidebarHeader className="border-b">
            <div className="flex items-center gap-2 px-4 h-14">
              <MusicIcon className="h-6 w-6 text-primary" />
              <span className="font-semibold text-xl">Sala de Ensayo</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={window.location.pathname === '/admin/dashboard'}>
                  <a href="/admin/dashboard">
                    <LayoutDashboard />
                    <span>Panel Principal</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={window.location.pathname === '/admin/settings'}>
                  <a href="/admin/settings">
                    <Settings />
                    <span>Configuración</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={window.location.pathname === '/admin/calendar'}>
                  <a href="/admin/settings">
                    <Calendar />
                    <span>Calendario</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Button>
          </SidebarFooter>
        </Sidebar>
        
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto py-6 px-6">
            <h1 className="text-3xl font-bold mb-6">{title}</h1>
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
