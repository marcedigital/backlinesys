
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import RoomsSettings from '@/components/admin/settings/RoomsSettings';
import EmailSettings from '@/components/admin/settings/EmailSettings';
import CouponsSettings from '@/components/admin/settings/CouponsSettings';

const AdminSettings = () => {
  return (
    <AdminLayout title="Configuración">
      <Tabs defaultValue="rooms" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3 mb-4">
          <TabsTrigger value="rooms">Salas</TabsTrigger>
          <TabsTrigger value="emails">Notificaciones</TabsTrigger>
          <TabsTrigger value="coupons">Cupones</TabsTrigger>
        </TabsList>
        
        <Card>
          <TabsContent value="rooms" className="p-4">
            <RoomsSettings />
          </TabsContent>
          
          <TabsContent value="emails" className="p-4">
            <EmailSettings />
          </TabsContent>
          
          <TabsContent value="coupons" className="p-4">
            <CouponsSettings />
          </TabsContent>
        </Card>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminSettings;
