
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Settings, BookOpen } from 'lucide-react';
import { 
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton
} from '@/components/ui/sidebar';

interface NavigationItemsProps {
  expandedSections: Record<string, boolean>;
  toggleSection: (section: string) => void;
  isActive: (path: string) => boolean;
  onItemClick?: () => void;
}

const NavigationItems: React.FC<NavigationItemsProps> = ({
  expandedSections,
  toggleSection,
  isActive,
  onItemClick
}) => {
  const location = useLocation();
  
  return (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton 
          asChild 
          isActive={isActive('/admin/dashboard')}
          onClick={onItemClick}
        >
          <Link to="/admin/dashboard">
            <LayoutDashboard />
            <span>Panel Principal</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton 
          onClick={() => toggleSection('reservaciones')}
        >
          <BookOpen />
          <span>Reservaciones</span>
        </SidebarMenuButton>
        {expandedSections.reservaciones && (
          <SidebarMenuSub>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton 
                asChild 
                isActive={isActive('/admin/reservaciones')}
                onClick={onItemClick}
              >
                <Link to="/admin/reservaciones">Reservas</Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton 
                asChild 
                isActive={location.pathname.includes('/admin/clientes')}
                onClick={onItemClick}
              >
                <Link to="/admin/reservaciones?tab=clientes">Clientes</Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          </SidebarMenuSub>
        )}
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton 
          onClick={() => toggleSection('configuracion')}
        >
          <Settings />
          <span>Configuración</span>
        </SidebarMenuButton>
        {expandedSections.configuracion && (
          <SidebarMenuSub>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton 
                asChild 
                isActive={isActive('/admin/settings') && !location.pathname.includes('?tab=')}
                onClick={onItemClick}
              >
                <Link to="/admin/settings">Salas</Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton 
                asChild 
                isActive={location.pathname.includes('/admin/settings?tab=emails')}
                onClick={onItemClick}
              >
                <Link to="/admin/settings?tab=emails">Notificaciones</Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton 
                asChild 
                isActive={location.pathname.includes('/admin/settings?tab=coupons')}
                onClick={onItemClick}
              >
                <Link to="/admin/settings?tab=coupons">Cupones</Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          </SidebarMenuSub>
        )}
      </SidebarMenuItem>
    </>
  );
};

export default NavigationItems;
