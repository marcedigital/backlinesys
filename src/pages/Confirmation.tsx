
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from "sonner";
import { Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Confirmation: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // This would come from the booking state in a real app
  const bookingDetails = {
    room: "Sala A - Rock",
    date: new Date().toLocaleDateString("es-ES", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    startTime: "19:00",
    endTime: "22:00",
    hours: 3,
    basePrice: 10000,
    additionalHours: 2,
    additionalHoursPrice: 10000,
    addOns: [
      { name: "Amplificador de guitarra", price: 5000 },
      { name: "Micrófono profesional", price: 3000 }
    ],
    total: 28000
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      toast.success("Comprobante cargado exitosamente. Su reserva ha sido confirmada.");
      // In a real app, we would upload the file to a server here
      setTimeout(() => navigate("/"), 2000);
    } else {
      toast.error("Por favor cargue un comprobante de pago");
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-booking-purple to-booking-pink text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Music Rehearsal Room Scheduler</h1>
          <p className="mt-2 opacity-90">Confirmación de Reserva</p>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center">
        <Card className="w-full max-w-2xl mb-8">
          <CardHeader className="bg-gradient-to-r from-booking-blue/10 to-booking-purple/10">
            <CardTitle className="text-2xl">Resumen de Reserva</CardTitle>
            <CardDescription>
              Detalles de su reserva de sala de ensayo
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Información de Reserva</h3>
                <span className="text-sm text-muted-foreground">#{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 py-2">
                <div>
                  <p className="text-sm text-muted-foreground">Sala:</p>
                  <p className="font-medium">{bookingDetails.room}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fecha:</p>
                  <p className="font-medium">{bookingDetails.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Hora de inicio:</p>
                  <p className="font-medium">{bookingDetails.startTime}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Hora de fin:</p>
                  <p className="font-medium">{bookingDetails.endTime}</p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Detalles del Costo</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Primera hora</span>
                    <span>₡{bookingDetails.basePrice.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Horas adicionales ({bookingDetails.additionalHours} x ₡5,000)</span>
                    <span>₡{bookingDetails.additionalHoursPrice.toLocaleString()}</span>
                  </div>
                  
                  {bookingDetails.addOns.map((addon, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{addon.name}</span>
                      <span>₡{addon.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₡{bookingDetails.total.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-xl">Comprobante de Pago</CardTitle>
            <CardDescription>
              Por favor cargue su comprobante de pago por SINPE (88888888, Andres Bustamante) para completar su reserva
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center">
                {preview ? (
                  <div className="w-full flex flex-col items-center">
                    <img 
                      src={preview} 
                      alt="Comprobante" 
                      className="max-w-full max-h-64 object-contain mb-4" 
                    />
                    <Button 
                      variant="outline" 
                      type="button" 
                      onClick={() => {
                        setFile(null);
                        setPreview(null);
                      }}
                    >
                      Cambiar imagen
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="h-12 w-12 text-muted-foreground mb-2" />
                    <p className="mb-2 text-sm text-center text-muted-foreground">
                      Haga clic para cargar o arrastre y suelte
                    </p>
                    <p className="text-xs text-center text-muted-foreground">
                      PNG, JPG o JPEG (máx. 10MB)
                    </p>
                    <label htmlFor="file-upload" className="mt-4 cursor-pointer">
                      <span className="bg-booking-blue text-white px-4 py-2 rounded-md hover:bg-booking-blue/90 transition-colors">
                        Seleccionar archivo
                      </span>
                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={handleFileChange}
                      />
                    </label>
                  </>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-booking-blue hover:bg-booking-blue/90"
              >
                Confirmar Reserva
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground text-center">
              Una vez confirmado el pago, recibirá un correo electrónico con los detalles de su reserva.
            </p>
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

export default Confirmation;
