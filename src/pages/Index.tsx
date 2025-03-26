
import React from 'react';
import Calendar from '@/components/Calendar';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Backline Studios - Reserva de Salas</h1>
        <Calendar />
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-border py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          Backline Studios &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default Index;
