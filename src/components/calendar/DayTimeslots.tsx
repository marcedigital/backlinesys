
import React from 'react';
import RoomTimeslots from './RoomTimeslots';
import { Room, TimeSlot as TimeSlotType } from '@/utils/bookingUtils';
import { cn } from '@/lib/utils';

interface DayTimeslotsProps {
  title: string;
  rooms: Room[];
  selectedRoom: string;
  timeSlots: { [roomId: string]: TimeSlotType[] };
  isSelecting: boolean;
  onRoomChange: (roomId: string) => void;
  onSelectStart: (slot: TimeSlotType) => void;
  onSelectEnd: (slot: TimeSlotType) => void;
  onMouseEnter: (slot: TimeSlotType) => void;
  isInSelectionRange: (slot: TimeSlotType) => boolean;
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
  className?: string;
}

const DayTimeslots: React.FC<DayTimeslotsProps> = ({
  title,
  rooms,
  selectedRoom,
  timeSlots,
  isSelecting,
  onRoomChange,
  onSelectStart,
  onSelectEnd,
  onMouseEnter,
  isInSelectionRange,
  selectedDate,
  onDateChange,
  className
}) => {
  return (
    <div className={cn("bg-white rounded-xl p-4 shadow-sm border border-border", className)}>
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      
      <RoomTimeslots
        rooms={rooms}
        selectedRoom={selectedRoom}
        timeSlots={timeSlots}
        isSelecting={isSelecting}
        onRoomChange={onRoomChange}
        onSelectStart={onSelectStart}
        onSelectEnd={onSelectEnd}
        onMouseEnter={onMouseEnter}
        isInSelectionRange={isInSelectionRange}
        selectedDate={selectedDate}
        onDateChange={onDateChange}
      />
    </div>
  );
};

export default DayTimeslots;
