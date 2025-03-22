
import React from 'react';
import { cn } from '@/lib/utils';
import { formatTime } from '@/utils/bookingUtils';
import type { TimeSlot as TimeSlotType } from '@/utils/bookingUtils';

interface TimeSlotProps {
  slot: TimeSlotType;
  isSelecting: boolean;
  isInSelectionRange: boolean;
  onSelectStart: (slot: TimeSlotType) => void;
  onSelectEnd: (slot: TimeSlotType) => void;
  onMouseEnter: (slot: TimeSlotType) => void;
}

const TimeSlot: React.FC<TimeSlotProps> = ({
  slot,
  isSelecting,
  isInSelectionRange,
  onSelectStart,
  onSelectEnd,
  onMouseEnter,
}) => {
  const handleMouseDown = () => {
    if (slot.isAvailable) {
      onSelectStart(slot);
    }
  };

  const handleMouseUp = () => {
    if (isSelecting && slot.isAvailable) {
      onSelectEnd(slot);
    }
  };

  const handleMouseEnter = () => {
    onMouseEnter(slot);
  };

  return (
    <div
      className={cn(
        'time-slot relative rounded-md p-2 mb-1 transition-all duration-200 border',
        slot.isAvailable ? 'cursor-pointer hover:shadow-md' : 'cursor-not-allowed',
        slot.isSelected ? 'border-booking-purple bg-booking-purple bg-opacity-10 text-booking-purple' : 'border-transparent',
        isInSelectionRange && slot.isAvailable ? 'bg-booking-purple bg-opacity-10 border-booking-purple' : '',
        !slot.isAvailable && 'bg-booking-gray text-booking-dark-gray',
        isSelecting && 'cursor-ns-resize'
      )}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
    >
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{formatTime(slot.startTime)}</span>
        {!slot.isAvailable && (
          <span className="text-xs px-2 py-0.5 bg-booking-red bg-opacity-10 text-booking-red rounded-full">
            Booked
          </span>
        )}
      </div>
      
      {/* Hover effect */}
      <div 
        className={cn(
          "absolute inset-0 rounded-md border-2 border-booking-purple opacity-0 transition-opacity duration-200",
          (!isSelecting && slot.isAvailable) && "group-hover:opacity-100"
        )}
      />
      
      {/* Visual indicator for selected slots */}
      {(slot.isSelected || isInSelectionRange) && slot.isAvailable && (
        <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-4 bg-booking-purple rounded-full" />
      )}
    </div>
  );
};

export default TimeSlot;
