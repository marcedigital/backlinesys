
import React from 'react';

const BookingInstructions: React.FC = () => {
  return (
    <div className="bg-booking-light-blue p-4 rounded-lg mb-6 text-sm border border-booking-blue">
      <p className="font-medium text-booking-blue">How to book:</p>
      <ol className="list-decimal ml-5 mt-1 space-y-1 text-gray-800">
        <li>Select a rehearsal room by clicking on a room tab</li>
        <li>Select a start time by clicking on an available time slot</li>
        <li>Drag to select the duration of your session</li>
        <li>Choose optional equipment and confirm your booking</li>
      </ol>
    </div>
  );
};

export default BookingInstructions;
