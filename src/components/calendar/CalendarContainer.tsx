
import React from 'react';
import { useCalendarState } from './hooks/useCalendarState';
import BookingModal from '../BookingModal';
import CalendarHeader from './CalendarHeader';
import BookingInstructions from './BookingInstructions';
import RoomSelector from './RoomSelector';
import DayTimeslots from './DayTimeslots';
import { rooms } from '@/utils/bookingUtils';

// Room images
const roomImages = {
  room1: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&h=400",
  room2: "https://images.unsplash.com/photo-1519508234439-4f23643125c1?auto=format&fit=crop&w=1200&h=400"
};

const CalendarContainer: React.FC = () => {
  const {
    selectedDate,
    selectedRoom,
    timeSlots,
    nextDayTimeSlots,
    isSelecting,
    isModalOpen,
    bookingDetails,
    handleDateChange,
    handleRoomChange,
    handleSelectStart,
    handleSelectEnd,
    handleMouseEnter,
    isInSelectionRange,
    handleToggleAddOn,
    handleCloseModal,
    handleConfirmBooking
  } = useCalendarState();

  return (
    <div className="animate-fade-in">
      <CalendarHeader 
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
      />
      
      <BookingInstructions />
      
      <RoomSelector 
        rooms={rooms}
        selectedRoom={selectedRoom}
        onRoomChange={handleRoomChange}
        roomImages={roomImages}
      />
      
      <div className="mt-6 mb-6">
        {/* Current Day Timeslots */}
        <DayTimeslots
          title={`Horas disponibles - ${rooms.find(r => r.id === selectedRoom)?.name}`}
          rooms={rooms}
          selectedRoom={selectedRoom}
          timeSlots={timeSlots}
          isSelecting={isSelecting}
          onRoomChange={handleRoomChange}
          onSelectStart={handleSelectStart}
          onSelectEnd={handleSelectEnd}
          onMouseEnter={handleMouseEnter}
          isInSelectionRange={isInSelectionRange}
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
        />
        
        {/* Next Day Timeslots */}
        <DayTimeslots
          title="Horas disponibles - Siguiente día"
          rooms={rooms}
          selectedRoom={selectedRoom}
          timeSlots={nextDayTimeSlots}
          isSelecting={isSelecting}
          onRoomChange={handleRoomChange}
          onSelectStart={handleSelectStart}
          onSelectEnd={handleSelectEnd}
          onMouseEnter={handleMouseEnter}
          isInSelectionRange={isInSelectionRange}
          className="mt-8"
        />
      </div>
      
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

export default CalendarContainer;
