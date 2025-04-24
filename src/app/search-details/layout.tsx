import React from 'react';
import NavBar from '@/components/home/Navbar';

export default function SearchDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      {/* Add the navbar at the top */}
      <NavBar bgColor="white" backdropBlur="none" />
      
      {/* Main content */}
      <main>
        {children}
      </main>
    </div>
  );
}