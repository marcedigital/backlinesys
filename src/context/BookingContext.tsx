
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BookingDetails, TimeSlot } from '@/utils/bookingUtils';

interface BookingContextType {
  bookingData: BookingDetails | null;
  setBookingData: (data: BookingDetails) => void;
  paymentProofImage: string | null;
  setPaymentProofImage: (imageUrl: string | null) => void;
  couponCode: string | null;
  setCouponCode: (code: string | null) => void;
  discountPercentage: number;
  setDiscountPercentage: (percentage: number) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [bookingData, setBookingData] = useState<BookingDetails | null>(null);
  const [paymentProofImage, setPaymentProofImage] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);

  return (
    <BookingContext.Provider value={{ 
      bookingData, 
      setBookingData,
      paymentProofImage,
      setPaymentProofImage,
      couponCode,
      setCouponCode,
      discountPercentage,
      setDiscountPercentage
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
