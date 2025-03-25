
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReservasList from '@/components/admin/reservaciones/ReservasList';
import ClientesList from '@/components/admin/reservaciones/ClientesList';

const Reservaciones = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam === 'clientes' ? 'clientes' : 'reservas');

  useEffect(() => {
    // Update active tab when URL parameters change
    if (tabParam === 'clientes') {
      setActiveTab('clientes');
    } else {
      setActiveTab('reservas');
    }
  }, [tabParam]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'clientes') {
      setSearchParams({ tab: 'clientes' });
    } else {
      setSearchParams({});
    }
  };

  return (
    <AdminLayout title="Reservaciones">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
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
