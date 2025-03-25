
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { CalendarCheck, MusicIcon, Clock, Mail } from 'lucide-react';
import { useBooking } from '@/context/BookingContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const ThankYou: React.FC = () => {
  const { bookingData } = useBooking();
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-booking-purple to-booking-pink text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Music Rehearsal Room Scheduler</h1>
          <p className="mt-2 opacity-90">¡Gracias por su reserva!</p>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader className="bg-gradient-to-r from-green-500/10 to-green-600/10 border-b">
            <div className="flex items-center gap-2 mb-2">
              <CalendarCheck className="h-6 w-6 text-green-600" />
              <CardTitle className="text-2xl">¡Reserva Exitosa!</CardTitle>
            </div>
            <CardDescription>
              Su solicitud de reserva ha sido recibida. Por favor espere a que revisemos su comprobante de pago.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <MusicIcon className="h-8 w-8 text-green-600" />
              </div>
            </div>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-md">
              <div className="flex">
                <Mail className="h-5 w-5 text-yellow-600 mr-2" />
                <p className="text-sm text-yellow-700">
                  Su sala ha sido reservada y será confirmada una vez que revisemos el comprobante de pago. Recibirá un correo electrónico cuando su reserva sea confirmada.
                </p>
              </div>
            </div>
            
            {bookingData ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Detalles de la Reserva</h3>
                  <span className="text-sm text-muted-foreground">#{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 py-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Sala:</p>
                    <p className="font-medium">{bookingData.room}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha:</p>
                    <p className="font-medium">
                      {bookingData.startTime ? 
                        format(bookingData.startTime, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es }) : 
                        "No disponible"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Hora de inicio:</p>
                    <p className="font-medium">{bookingData.startTime ? format(bookingData.startTime, "HH:mm") : "No disponible"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Hora de fin:</p>
                    <p className="font-medium">{bookingData.endTime ? format(bookingData.endTime, "HH:mm") : "No disponible"}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Equipamiento Adicional</h3>
                  
                  <div className="space-y-2">
                    {bookingData.addOns
                      .filter(addon => addon.selected)
                      .map((addon, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{addon.name}</span>
                        </div>
                      ))}
                    
                    {bookingData.addOns.filter(addon => addon.selected).length === 0 && (
                      <p className="text-muted-foreground italic">Sin equipamiento adicional</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <p>No se encontraron detalles de la reserva</p>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4 items-center">
            <p className="text-sm text-muted-foreground text-center">
              Para cualquier consulta, contáctenos al teléfono 8888-8888.
            </p>
            
            <Link to="/" className="w-full">
              <Button className="w-full bg-booking-blue hover:bg-booking-blue/90">
                Volver al Calendario
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-border py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Music Rehearsal Scheduler &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default ThankYou;
