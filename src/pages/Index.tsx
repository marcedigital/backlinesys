
import React from 'react';
import Calendar from '@/components/Calendar';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">Meeting Room Scheduler</h1>
          <p className="text-muted-foreground mt-1">Book Sala 1 or Sala 2 for your next meeting</p>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <Calendar />
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-border py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Meeting Room Scheduler &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default Index;
