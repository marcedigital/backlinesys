
import React from 'react';

const BookingInstructions: React.FC = () => {
  return (
    <div className="bg-booking-light-blue p-4 rounded-lg mb-6 text-sm border border-booking-blue">
      <p className="font-medium text-booking-blue">Cómo reservar:</p>
      <ol className="list-decimal ml-5 mt-1 space-y-1 text-gray-800">
        <li>Selecciona una sala de ensayo haciendo clic en una pestaña de sala</li>
        <li>Selecciona una hora de inicio haciendo clic en un horario disponible</li>
        <li>Arrastra para seleccionar la duración de tu sesión (solo horas completas)</li>
        <li>Puedes seleccionar horarios continuos incluso entre días diferentes</li>
        <li>Elige equipamiento opcional y confirma tu reserva</li>
      </ol>
    </div>
  );
};

export default BookingInstructions;
