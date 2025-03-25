
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BookingDetails, TimeSlot } from '@/utils/bookingUtils';

interface BookingContextType {
  bookingData: BookingDetails | null;
  setBookingData: (data: BookingDetails) => void;
  paymentProofImage: string | null;
  setPaymentProofImage: (imageUrl: string | null) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [bookingData, setBookingData] = useState<BookingDetails | null>(null);
  const [paymentProofImage, setPaymentProofImage] = useState<string | null>(null);

  return (
    <BookingContext.Provider value={{ 
      bookingData, 
      setBookingData,
      paymentProofImage,
      setPaymentProofImage
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
