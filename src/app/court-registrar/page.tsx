"use client";

import React, { useState, useEffect } from 'react';
import CourtRegistrarLayout from '@/components/court-registrar/layout';

import TopActions from '@/components/court-registrar/dashboard/TopActions';
import StatsBar from '@/components/court-registrar/dashboard/StatsBar';
import UploadedCasesTable from '@/components/court-registrar/dashboard/UploadedCasesTable';

const CourtRegistrarDashboardPage = () => {
  const [courtInfo, setCourtInfo] = useState<string>("Court Registrar");

  // Function to fetch court registrar data from storage
  const fetchCourtRegistrarData = () => {
    try {
      // First try to get data from sessionStorage auth object
      const authStr = sessionStorage.getItem('auth');
      if (authStr) {
        const auth = JSON.parse(authStr);
        if (auth.data && auth.data.court_info) {
          setCourtInfo(auth.data.court_info);
          console.log('Updated court info from auth:', auth.data.court_info);
          return;
        }
      }

      // If not found, try sessionStorage user object
      const userStr = sessionStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.court_info) {
          setCourtInfo(user.court_info);
          console.log('Updated court info from user:', user.court_info);
          return;
        }
      }

      // If still not found, try localStorage
      const localUserStr = localStorage.getItem('user');
      if (localUserStr) {
        const localUser = JSON.parse(localUserStr);
        if (localUser.court_info) {
          setCourtInfo(localUser.court_info);
          console.log('Updated court info from localStorage user:', localUser.court_info);
          return;
        }
      }

      // Try settings in localStorage
      const settingsStr = localStorage.getItem('court_registrar_settings');
      if (settingsStr) {
        const settings = JSON.parse(settingsStr);
        if (settings.court_info) {
          setCourtInfo(settings.court_info);
          console.log('Updated court info from settings:', settings.court_info);
          return;
        }
      }

      // If no court info is found, keep the default value
      console.log('No court info found in storage, using default');
    } catch (error) {
      console.error('Error fetching court registrar data:', error);
    }
  };

  // Initial load of court registrar data
  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== 'undefined') {
      fetchCourtRegistrarData();
    }
  }, []);
  
  // Listen for settings updates
  useEffect(() => {
    // Handler for the custom event
    const handleSettingsUpdate = (event: CustomEvent) => {
      console.log('Settings update event received:', event.detail);
      if (event.detail && event.detail.court_info) {
        setCourtInfo(event.detail.court_info);
      } else {
        // If the event doesn't contain court_info, fetch from storage
        fetchCourtRegistrarData();
      }
    };
    
    // Add event listener
    if (typeof window !== 'undefined') {
      window.addEventListener('courtRegistrarSettingsUpdated', handleSettingsUpdate as EventListener);
    }
    
    // Clean up event listener
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('courtRegistrarSettingsUpdated', handleSettingsUpdate as EventListener);
      }
    };
  }, []);

  return (
    <CourtRegistrarLayout 
      className="mb-8" 
      title="Court Registrar" 
      description={courtInfo}
    >
      <StatsBar />
      <TopActions />
      <div className="mt-8 px-8">
        <UploadedCasesTable />
      </div>
    </CourtRegistrarLayout>
  );
};

export default CourtRegistrarDashboardPage;
