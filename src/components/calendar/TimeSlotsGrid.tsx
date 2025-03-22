
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
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {timeSlots.map((slot) => (
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
  );
};

export default TimeSlotsGrid;
