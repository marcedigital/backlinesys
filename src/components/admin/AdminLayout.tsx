
import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { MusicIcon, LayoutDashboard, Settings, Calendar, LogOut, BookOpen, Users, Menu, X } from 'lucide-react';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail
} from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const { isAuthenticated, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    reservaciones: location.pathname.includes('/admin/reservaciones'),
    configuracion: location.pathname.includes('/admin/settings')
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Mobile navigation menu content (for reuse in both modal and sidebar)
  const navigationItems = (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton 
          asChild 
          isActive={isActive('/admin/dashboard')}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <Link to="/admin/dashboard">
            <LayoutDashboard />
            <span>Panel Principal</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton 
          asChild 
          isActive={location.pathname.startsWith('/admin/reservaciones')}
          onClick={() => toggleSection('reservaciones')}
        >
          <div className="cursor-pointer">
            <BookOpen />
            <span>Reservaciones</span>
          </div>
        </SidebarMenuButton>
        {expandedSections.reservaciones && (
          <SidebarMenuSub>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton 
                asChild 
                isActive={isActive('/admin/reservaciones')}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link to="/admin/reservaciones">Gestión de Reservas</Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          </SidebarMenuSub>
        )}
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton 
          asChild 
          isActive={location.pathname.startsWith('/admin/settings')}
          onClick={() => toggleSection('configuracion')}
        >
          <div className="cursor-pointer">
            <Settings />
            <span>Configuración</span>
          </div>
        </SidebarMenuButton>
        {expandedSections.configuracion && (
          <SidebarMenuSub>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton 
                asChild 
                isActive={isActive('/admin/settings')}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link to="/admin/settings">Ajustes</Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          </SidebarMenuSub>
        )}
      </SidebarMenuItem>
    </>
  );

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex bg-slate-50 w-full">
        {/* Mobile Hamburger Menu */}
        <div className="md:hidden fixed top-4 left-4 z-50">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-10 w-10">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
                <div className="border-b flex items-center gap-2 px-4 h-14">
                  <MusicIcon className="h-6 w-6 text-primary" />
                  <span className="font-semibold text-xl">Sala de Ensayo</span>
                </div>
                <div className="flex-1 p-2">
                  <SidebarMenu>
                    {navigationItems}
                  </SidebarMenu>
                </div>
                <div className="border-t p-4">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Sidebar */}
        <Sidebar className="hidden md:flex">
          <SidebarRail />
          <SidebarHeader className="border-b">
            <div className="flex items-center gap-2 px-4 h-14">
              <MusicIcon className="h-6 w-6 text-primary" />
              <span className="font-semibold text-xl">Sala de Ensayo</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navigationItems}
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
        
        <main className="flex-1 overflow-auto md:ml-0">
          <div className="container mx-auto py-6 px-6">
            <h1 className="text-3xl font-bold mb-6 mt-10 md:mt-0">{title}</h1>
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
