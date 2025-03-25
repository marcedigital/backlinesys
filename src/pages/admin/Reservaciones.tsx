
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReservasList from '@/components/admin/reservaciones/ReservasList';
import ClientesList from '@/components/admin/reservaciones/ClientesList';

const Reservaciones = () => {
  const [activeTab, setActiveTab] = useState('reservas');

  return (
    <AdminLayout title="Reservaciones">
      <Tabs defaultValue="reservas" onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="reservas">Reservas</TabsTrigger>
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
        </TabsList>
        <TabsContent value="reservas">
          <ReservasList />
        </TabsContent>
        <TabsContent value="clientes">
          <ClientesList />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default Reservaciones;
