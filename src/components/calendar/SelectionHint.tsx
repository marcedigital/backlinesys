
import React from 'react';

interface SelectionHintProps {
  isSelecting: boolean;
}

const SelectionHint: React.FC<SelectionHintProps> = ({ isSelecting }) => {
  return (
    <div className="bg-booking-pink bg-opacity-10 border border-booking-pink text-booking-pink p-3 rounded-lg mb-4 text-sm font-medium">
      {isSelecting 
        ? "Seleccione la última hora" 
        : "Seleccione la primera hora"}
    </div>
  );
};

export default SelectionHint;
