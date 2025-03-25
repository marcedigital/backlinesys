
import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Eye } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';

type EmailNotification = {
  id: string;
  name: string;
  subject: string;
  body: string;
  enabled: boolean;
};

const EmailSettings = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<EmailNotification[]>([
    {
      id: 'reservation-completed',
      name: 'Reserva completada',
      subject: 'Su reserva ha sido recibida',
      body: 'Estimado cliente,\n\nGracias por realizar su reserva. Su reserva ha sido recibida correctamente y está pendiente de confirmación.\n\nSaludos cordiales,\nEquipo de Sala de Ensayo',
      enabled: true
    },
    {
      id: 'reservation-confirmed',
      name: 'Reserva confirmada',
      subject: 'Su reserva ha sido confirmada',
      body: 'Estimado cliente,\n\nNos complace informarle que su reserva ha sido confirmada. A continuación encontrará los detalles de su reserva.\n\nSaludos cordiales,\nEquipo de Sala de Ensayo',
      enabled: true
    },
    {
      id: 'reservation-cancelled',
      name: 'Reserva cancelada',
      subject: 'Su reserva ha sido cancelada',
      body: 'Estimado cliente,\n\nLamentamos informarle que su reserva ha sido cancelada. Si tiene alguna consulta, no dude en contactarnos.\n\nSaludos cordiales,\nEquipo de Sala de Ensayo',
      enabled: true
    },
    {
      id: 'reservation-updated',
      name: 'Reserva actualizada',
      subject: 'Su reserva ha sido actualizada',
      body: 'Estimado cliente,\n\nLe informamos que su reserva ha sido actualizada. A continuación encontrará los nuevos detalles de su reserva.\n\nSaludos cordiales,\nEquipo de Sala de Ensayo',
      enabled: false
    },
    {
      id: 'reservation-reminder',
      name: 'Recordatorio de reserva',
      subject: 'Recordatorio de su próxima reserva',
      body: 'Estimado cliente,\n\nLe recordamos que tiene una reserva programada para mañana. A continuación encontrará los detalles de su reserva.\n\nSaludos cordiales,\nEquipo de Sala de Ensayo',
      enabled: false
    }
  ]);

  const handleToggle = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id 
        ? { ...notification, enabled: !notification.enabled } 
        : notification
    ));
    
    const notification = notifications.find(n => n.id === id);
    
    toast({
      title: `Notificación ${notification?.enabled ? 'desactivada' : 'activada'}`,
      description: `Las notificaciones de "${notification?.name}" han sido ${notification?.enabled ? 'desactivadas' : 'activadas'}.`,
    });
  };

  const handleSubjectChange = (id: string, subject: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id 
        ? { ...notification, subject } 
        : notification
    ));
  };

  const handleBodyChange = (id: string, body: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id 
        ? { ...notification, body } 
        : notification
    ));
  };

  const handlePreview = (notification: EmailNotification) => {
    toast({
      title: "Vista previa del correo",
      description: "La función de vista previa estará disponible próximamente.",
    });
  };

  const handleSave = () => {
    toast({
      title: "Configuración guardada",
      description: "La configuración de notificaciones ha sido guardada exitosamente.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Configuración de Notificaciones</h3>
      </div>
      
      <Accordion type="multiple" className="w-full space-y-4">
        {notifications.map((notification) => (
          <AccordionItem 
            key={notification.id} 
            value={notification.id}
            className="border rounded-md px-4"
          >
            <div className="flex items-center justify-between py-4">
              <div className="flex flex-col">
                <span className="font-medium">{notification.name}</span>
                <span className="text-sm text-muted-foreground">
                  {notification.enabled ? 'Activa' : 'Inactiva'}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id={`${notification.id}-switch`} 
                    checked={notification.enabled}
                    onCheckedChange={() => handleToggle(notification.id)}
                  />
                  <Label htmlFor={`${notification.id}-switch`}>
                    {notification.enabled ? 'Activado' : 'Desactivado'}
                  </Label>
                </div>
                <AccordionTrigger className="m-0 p-0"/>
              </div>
            </div>
            <AccordionContent className="pb-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`${notification.id}-subject`}>Asunto del correo</Label>
                <Input 
                  id={`${notification.id}-subject`} 
                  value={notification.subject}
                  onChange={(e) => handleSubjectChange(notification.id, e.target.value)}
                  disabled={!notification.enabled}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${notification.id}-body`}>Contenido del correo</Label>
                <Textarea 
                  id={`${notification.id}-body`} 
                  value={notification.body}
                  onChange={(e) => handleBodyChange(notification.id, e.target.value)}
                  className="min-h-[150px]"
                  disabled={!notification.enabled}
                />
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="gap-1"
                onClick={() => handlePreview(notification)}
                disabled={!notification.enabled}
              >
                <Eye className="h-4 w-4" />
                Vista previa
              </Button>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      
      <div className="flex justify-end">
        <Button onClick={handleSave}>
          Guardar configuración
        </Button>
      </div>
    </div>
  );
};

export default EmailSettings;
