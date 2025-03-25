
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
  // Organize slots in columns based on the number of slots
  const organizeInColumns = () => {
    if (timeSlots.length <= 6) {
      // For next day (6 hours or less), split into two even columns
      const halfLength = Math.ceil(timeSlots.length / 2);
      const column1 = timeSlots.slice(0, halfLength);
      const column2 = timeSlots.slice(halfLength);
      return [column1, column2];
    } else {
      // For current day (24 hours), split at noon (12 slots per column)
      const slot1 = timeSlots.slice(0, 12); // 12am - 11am
      const slot2 = timeSlots.slice(12, 24); // 12pm - 11pm
      return [slot1, slot2];
    }
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
