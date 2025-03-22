import React, { useState, useEffect } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Music, Mic, Headphones } from 'lucide-react';
import TimeSlot from './TimeSlot';
import BookingModal from './BookingModal';
import { cn } from '@/lib/utils';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import {
  getDefaultAddOns,
  getUnavailableTimes,
  generateTimeSlots,
  calculatePrice,
  TimeSlot as TimeSlotType,
  BookingDetails,
  AddOn,
  rooms
} from '@/utils/bookingUtils';

const Calendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedRoom, setSelectedRoom] = useState(rooms[0].id);
  const [timeSlots, setTimeSlots] = useState<{ [roomId: string]: TimeSlotType[] }>({});
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<TimeSlotType | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<TimeSlotType | null>(null);
  const [tempSelectionEnd, setTempSelectionEnd] = useState<TimeSlotType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    room: rooms[0].name,
    startTime: null,
    endTime: null,
    addOns: getDefaultAddOns(),
    totalPrice: 0
  });

  const roomImages = {
    room1: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&h=800",
    room2: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&h=800"
  };

  useEffect(() => {
    const newTimeSlots: { [roomId: string]: TimeSlotType[] } = {};
    
    rooms.forEach(room => {
      const unavailableTimes = getUnavailableTimes(selectedDate, room.id);
      newTimeSlots[room.id] = generateTimeSlots(selectedDate, room.id, unavailableTimes);
    });
    
    setTimeSlots(newTimeSlots);
    resetSelection();
  }, [selectedDate]);

  useEffect(() => {
    if (selectionStart && selectionEnd) {
      const startSlot = selectionStart.startTime < selectionEnd.startTime ? selectionStart : selectionEnd;
      const endSlot = selectionStart.startTime < selectionEnd.startTime ? selectionEnd : selectionStart;
      
      const roomName = rooms.find(room => room.id === selectedRoom)?.name || '';
      
      setBookingDetails(prev => ({
        ...prev,
        room: roomName,
        startTime: startSlot.startTime,
        endTime: endSlot.endTime
      }));
    }
  }, [selectionStart, selectionEnd, selectedRoom]);

  useEffect(() => {
    if (bookingDetails.startTime && bookingDetails.endTime) {
      const total = calculatePrice(
        bookingDetails.startTime,
        bookingDetails.endTime,
        bookingDetails.addOns
      );
      
      setBookingDetails(prev => ({
        ...prev,
        totalPrice: total
      }));
    }
  }, [bookingDetails.startTime, bookingDetails.endTime, bookingDetails.addOns]);

  const resetSelection = () => {
    setSelectionStart(null);
    setSelectionEnd(null);
    setTempSelectionEnd(null);
    setIsSelecting(false);
    
    if (timeSlots[selectedRoom]) {
      setTimeSlots(prev => ({
        ...prev,
        [selectedRoom]: prev[selectedRoom].map(slot => ({
          ...slot,
          isSelected: false
        }))
      }));
    }
  };

  const handlePreviousDay = () => {
    setSelectedDate(prev => subDays(prev, 1));
  };

  const handleNextDay = () => {
    setSelectedDate(prev => addDays(prev, 1));
  };

  const handleRoomChange = (roomId: string) => {
    resetSelection();
    setSelectedRoom(roomId);
    
    const roomName = rooms.find(room => room.id === roomId)?.name || '';
    setBookingDetails(prev => ({
      ...prev,
      room: roomName
    }));
  };

  const handleSelectStart = (slot: TimeSlotType) => {
    if (!slot.isAvailable) return;
    
    setIsSelecting(true);
    setSelectionStart(slot);
    setTempSelectionEnd(slot);
    
    setTimeSlots(prev => ({
      ...prev,
      [selectedRoom]: prev[selectedRoom].map(s => ({
        ...s,
        isSelected: s.id === slot.id
      }))
    }));
  };

  const handleSelectEnd = (slot: TimeSlotType) => {
    if (!isSelecting || !slot.isAvailable) return;
    
    setIsSelecting(false);
    setSelectionEnd(slot);
    setTempSelectionEnd(null);
    
    const currentTimeSlots = timeSlots[selectedRoom] || [];
    const startIndex = currentTimeSlots.findIndex(s => s.id === selectionStart?.id);
    const endIndex = currentTimeSlots.findIndex(s => s.id === slot.id);
    
    if (startIndex !== -1 && endIndex !== -1) {
      const min = Math.min(startIndex, endIndex);
      const max = Math.max(startIndex, endIndex);
      
      setTimeSlots(prev => ({
        ...prev,
        [selectedRoom]: prev[selectedRoom].map((s, i) => ({
          ...s,
          isSelected: i >= min && i <= max && s.isAvailable
        }))
      }));
      
      setIsModalOpen(true);
    }
  };

  const handleMouseEnter = (slot: TimeSlotType) => {
    if (isSelecting) {
      setTempSelectionEnd(slot);
    }
  };

  const isInSelectionRange = (slot: TimeSlotType) => {
    if (!isSelecting || !selectionStart || !tempSelectionEnd) return false;
    
    const startTime = selectionStart.startTime;
    const endTime = tempSelectionEnd.startTime;
    
    if (startTime <= endTime) {
      return slot.startTime >= startTime && slot.startTime <= endTime;
    } else {
      return slot.startTime >= endTime && slot.startTime <= startTime;
    }
  };

  const handleToggleAddOn = (id: string) => {
    setBookingDetails(prev => ({
      ...prev,
      addOns: prev.addOns.map(addOn => 
        addOn.id === id ? { ...addOn, selected: !addOn.selected } : addOn
      )
    }));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmBooking = () => {
    setIsModalOpen(false);
    resetSelection();
    
    console.log('Booking confirmed:', bookingDetails);
    
    setBookingDetails(prev => ({
      ...prev,
      startTime: null,
      endTime: null,
      addOns: prev.addOns.map(addOn => ({ ...addOn, selected: false }))
    }));
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Music className="mr-2 h-5 w-5 text-booking-purple" />
          <h2 className="text-xl font-semibold">Music Rehearsal Room Booking</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousDay}
            className="flex items-center"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="px-4 py-2 rounded-md bg-booking-purple text-white font-medium">
            {format(selectedDate, 'MMMM d, yyyy')}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextDay}
            className="flex items-center"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="bg-booking-light-blue p-4 rounded-lg mb-6 text-sm border border-booking-blue">
        <p className="font-medium text-booking-blue">How to book:</p>
        <ol className="list-decimal ml-5 mt-1 space-y-1 text-gray-800">
          <li>Select a rehearsal room by clicking on a room tab</li>
          <li>Select a start time by clicking on an available time slot</li>
          <li>Drag to select the duration of your session</li>
          <li>Choose optional equipment and confirm your booking</li>
        </ol>
      </div>
      
      <Tabs 
        defaultValue={rooms[0].id} 
        value={selectedRoom} 
        onValueChange={handleRoomChange}
        className="w-full"
      >
        <div className="mb-6">
          <h3 className="text-base font-medium mb-3">Select a rehearsal room:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {rooms.map(room => (
              <div 
                key={room.id}
                className={cn(
                  "cursor-pointer transition-all duration-300 rounded-xl overflow-hidden border shadow-sm",
                  selectedRoom === room.id ? "ring-2 ring-booking-purple border-booking-purple" : "border-gray-200 hover:border-booking-purple"
                )}
                onClick={() => handleRoomChange(room.id)}
              >
                <AspectRatio ratio={3/2}>
                  <img 
                    src={roomImages[room.id as keyof typeof roomImages]} 
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                </AspectRatio>
                <div className={cn(
                  "p-4",
                  selectedRoom === room.id ? "bg-booking-purple text-white" : "bg-white"
                )}>
                  <div className="flex items-center">
                    {room.id === 'room1' ? <Mic className="mr-2 h-4 w-4" /> : <Headphones className="mr-2 h-4 w-4" />}
                    <h3 className="font-medium">{room.name}</h3>
                  </div>
                  <p className="text-sm mt-1 opacity-80">
                    {room.id === 'room1' 
                      ? "Perfect for bands and full rehearsals" 
                      : "Ideal for solo musicians and vocalists"}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <TabsList className="hidden">
            {rooms.map(room => (
              <TabsTrigger key={room.id} value={room.id}>
                {room.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        {rooms.map(room => (
          <TabsContent key={room.id} value={room.id} className="mt-0">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
              <h3 className="text-base font-medium mb-4">Available Times - {room.name}</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {timeSlots[room.id]?.map((slot) => (
                  <TimeSlot
                    key={slot.id}
                    slot={slot}
                    isSelecting={isSelecting}
                    isInSelectionRange={isInSelectionRange(slot)}
                    onSelectStart={handleSelectStart}
                    onSelectEnd={handleSelectEnd}
                    onMouseEnter={handleMouseEnter}
                  />
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t flex flex-wrap gap-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-white border border-gray-300 rounded-sm mr-2"></div>
                  <span className="text-sm">Available</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-booking-light-blue border border-booking-blue rounded-sm mr-2"></div>
                  <span className="text-sm">Selected</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-booking-gray rounded-sm mr-2"></div>
                  <span className="text-sm">Unavailable</span>
                </div>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
      
      <BookingModal
        isOpen={isModalOpen}
        bookingDetails={bookingDetails}
        onClose={handleCloseModal}
        onToggleAddOn={handleToggleAddOn}
        onConfirm={handleConfirmBooking}
      />
    </div>
  );
};

export default Calendar;
