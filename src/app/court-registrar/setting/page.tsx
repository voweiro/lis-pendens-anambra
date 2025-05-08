"use client";

import React, { useState } from 'react';
import CourtInfoSetting from '@/components/court-registrar/setting/CourtInfoSetting';
import CourtNumberSetting from '@/components/court-registrar/setting/CourtNumberSetting';
import PasswordSetting from '@/components/court-registrar/setting/PasswordSetting';
import JudicialDivisionSetting from '@/components/court-registrar/setting/JudicialDivisionSetting';
import DeleteAccountModal from '@/components/users/setting/DeleteAccountModal';
import CourtRegistrarLayout from '@/components/court-registrar/layout';

const UserSettingPage = () => {
  const [courtinfo, setCourtinfo] = useState('Court 3 of the Awka Judiciary Division' );
  const [courtnumber, setCourtnumber] = useState('i123456YUGDSFF');
  const [password, setPassword] = useState('');
  const [judicialdivision, setJudicialdivision] = useState('Awka Judicial Division');
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSave = () => {};

  const handleDelete = async () => {
    setLoading(true);
    setMessage(null);
    // Simulate API call
    try {
      await new Promise((res) => setTimeout(res, 1500));
      setLoading(false);
      setModalOpen(false);
      setMessage({ type: 'success', text: 'Account deleted successfully.' });
    } catch (err) {
      setLoading(false);
      setMessage({ type: 'error', text: 'Failed to delete account. Please try again.' });
    }
  };

  return (
    <CourtRegistrarLayout title="Settings" description='Track your searches and manage overall activities'>
      <div className="relative min-h-screen bg-gray-50">
        <div className={`max-w-7xl mx-auto p-8 w-full transition-all duration-300 ${modalOpen ? 'filter blur-sm pointer-events-none select-none' : ''}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <CourtInfoSetting courtinfo={courtinfo} onChange={setCourtinfo} />
            <CourtNumberSetting courtnumber={courtnumber} onChange={setCourtnumber} />
            <JudicialDivisionSetting judicialdivision={judicialdivision} onChange={setJudicialdivision} />
            <PasswordSetting onChange={setPassword} />
          </div>
          <div className="flex justify-between items-center mt-8">
            <button
              className="bg-red-50 text-red-600 border border-red-200 px-6 py-2 rounded-lg font-semibold hover:bg-red-100 transition"
              onClick={() => setModalOpen(true)}
            >
              Delete Account
            </button>
            <button
              className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 transition"
              onClick={handleSave}
            >
              Save changes
            </button>
          </div>
          {message && (
            <div className={`mt-6 text-center font-semibold ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {message.text}
            </div>
          )}
        </div>
        <DeleteAccountModal
          open={modalOpen}
          onClose={() => { setModalOpen(false); setLoading(false); }}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>
    </CourtRegistrarLayout>
  );
};

export default UserSettingPage;
