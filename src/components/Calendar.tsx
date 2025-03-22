
import React, { useState, useEffect } from 'react';
import { addDays, subDays } from 'date-fns';
import {
  getDefaultAddOns,
  getUnavailableTimes,
  generateTimeSlots,
  calculatePrice,
  TimeSlot as TimeSlotType,
  BookingDetails,
  rooms
} from '@/utils/bookingUtils';
import BookingModal from './BookingModal';
import CalendarHeader from './calendar/CalendarHeader';
import BookingInstructions from './calendar/BookingInstructions';
import RoomSelector from './calendar/RoomSelector';
import RoomTimeslots from './calendar/RoomTimeslots';

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
      <CalendarHeader 
        selectedDate={selectedDate}
        onPreviousDay={handlePreviousDay}
        onNextDay={handleNextDay}
      />
      
      <BookingInstructions />
      
      <RoomSelector 
        rooms={rooms}
        selectedRoom={selectedRoom}
        onRoomChange={handleRoomChange}
        roomImages={roomImages}
      />
      
      <RoomTimeslots
        rooms={rooms}
        selectedRoom={selectedRoom}
        timeSlots={timeSlots}
        isSelecting={isSelecting}
        onRoomChange={handleRoomChange}
        onSelectStart={handleSelectStart}
        onSelectEnd={handleSelectEnd}
        onMouseEnter={handleMouseEnter}
        isInSelectionRange={isInSelectionRange}
      />
      
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
