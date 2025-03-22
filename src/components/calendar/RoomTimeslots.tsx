
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Room, TimeSlot as TimeSlotType } from '@/utils/bookingUtils';
import TimeSlotsGrid from './TimeSlotsGrid';
import TimeSlotsLegend from './TimeSlotsLegend';

interface RoomTimeslotsProps {
  rooms: Room[];
  selectedRoom: string;
  timeSlots: { [roomId: string]: TimeSlotType[] };
  isSelecting: boolean;
  onRoomChange: (roomId: string) => void;
  onSelectStart: (slot: TimeSlotType) => void;
  onSelectEnd: (slot: TimeSlotType) => void;
  onMouseEnter: (slot: TimeSlotType) => void;
  isInSelectionRange: (slot: TimeSlotType) => boolean;
}

const RoomTimeslots: React.FC<RoomTimeslotsProps> = ({
  rooms,
  selectedRoom,
  timeSlots,
  isSelecting,
  onRoomChange,
  onSelectStart,
  onSelectEnd,
  onMouseEnter,
  isInSelectionRange,
}) => {
  return (
    <Tabs 
      value={selectedRoom} 
      onValueChange={onRoomChange}
      className="w-full"
    >
      <TabsList className="hidden">
        {rooms.map(room => (
          <TabsTrigger key={room.id} value={room.id}>
            {room.name}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {rooms.map(room => (
        <TabsContent key={room.id} value={room.id} className="mt-0">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
            <h3 className="text-base font-medium mb-4">Available Times - {room.name}</h3>
            
            <TimeSlotsGrid
              timeSlots={timeSlots[room.id] || []}
              isSelecting={isSelecting}
              onSelectStart={onSelectStart}
              onSelectEnd={onSelectEnd}
              onMouseEnter={onMouseEnter}
              isInSelectionRange={isInSelectionRange}
            />
            
            <TimeSlotsLegend />
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default RoomTimeslots;
