
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import RoomsSettings from '@/components/admin/settings/RoomsSettings';
import EmailSettings from '@/components/admin/settings/EmailSettings';
import CouponsSettings from '@/components/admin/settings/CouponsSettings';

const AdminSettings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(
    tabParam === 'emails' ? 'emails' : 
    tabParam === 'coupons' ? 'coupons' : 'rooms'
  );

  useEffect(() => {
    // Update active tab when URL parameters change
    if (tabParam === 'emails') {
      setActiveTab('emails');
    } else if (tabParam === 'coupons') {
      setActiveTab('coupons');
    } else {
      setActiveTab('rooms');
    }
  }, [tabParam]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'rooms') {
      setSearchParams({});
    } else {
      setSearchParams({ tab: value });
    }
  };

  return (
    <AdminLayout title="Configuración">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
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
