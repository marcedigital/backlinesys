
import React from 'react';
import { 
  CalendarClock, 
  MousePointerClick,
  Check,
  CalendarRange
} from 'lucide-react';

const BookingInstructions: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-5 mb-8 shadow-sm border border-border">
      <h3 className="font-semibold text-lg mb-4">Cómo reservar una sala</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-2">
            <CalendarRange className="h-6 w-6 text-accent" />
          </div>
          <h4 className="font-medium mb-1">1. Elige fecha</h4>
          <p className="text-sm text-gray-600">Selecciona el día en que deseas reservar la sala</p>
        </div>
        
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-2">
            <CalendarClock className="h-6 w-6 text-accent" />
          </div>
          <h4 className="font-medium mb-1">2. Selecciona horario</h4>
          <p className="text-sm text-gray-600">Haz clic en la hora de inicio y fin para tu reserva</p>
        </div>
        
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-2">
            <MousePointerClick className="h-6 w-6 text-accent" />
          </div>
          <h4 className="font-medium mb-1">3. Selecciona extras</h4>
          <p className="text-sm text-gray-600">Agrega equipos o servicios adicionales si lo necesitas</p>
        </div>
        
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-2">
            <Check className="h-6 w-6 text-accent" />
          </div>
          <h4 className="font-medium mb-1">4. Confirma tu reserva</h4>
          <p className="text-sm text-gray-600">Revisa los detalles y completa el proceso de reserva</p>
        </div>
      </div>
    </div>
  );
};

export default BookingInstructions;
