
import React from 'react';
import TimeSlot from '../TimeSlot';
import { TimeSlot as TimeSlotType } from '@/utils/bookingUtils';

interface TimeSlotsGridProps {
  timeSlots: TimeSlotType[];
  isSelecting: boolean;
  onSelectStart: (slot: TimeSlotType) => void;
  onSelectEnd: (slot: TimeSlotType) => void;
  onMouseEnter: (slot: TimeSlotType) => void;
  isInSelectionRange: (slot: TimeSlotType) => boolean;
}

const TimeSlotsGrid: React.FC<TimeSlotsGridProps> = ({
  timeSlots,
  isSelecting,
  onSelectStart,
  onSelectEnd,
  onMouseEnter,
  isInSelectionRange,
}) => {
  // Organizar slots en columnas - 12 horas por columna
  const organizeInColumns = () => {
    const slot1 = timeSlots.slice(0, 12); // 12am - 11am
    const slot2 = timeSlots.slice(12, 24); // 12pm - 11pm
    
    return [slot1, slot2];
  };
  
  const columns = organizeInColumns();
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {columns.map((column, colIndex) => (
        <div key={colIndex} className="flex flex-col space-y-2">
          {column.map((slot) => (
            <TimeSlot
              key={slot.id}
              slot={slot}
              isSelecting={isSelecting}
              isInSelectionRange={isInSelectionRange(slot)}
              onSelectStart={onSelectStart}
              onSelectEnd={onSelectEnd}
              onMouseEnter={onMouseEnter}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default TimeSlotsGrid;
