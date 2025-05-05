"use client";

import React, { useState } from 'react';
import UsernameSetting from '@/components/users/setting/UsernameSetting';
import EmailSetting from '@/components/users/setting/EmailSetting';
import PasswordSetting from '@/components/users/setting/PasswordSetting';
import DOBSetting from '@/components/users/setting/DOBSetting';
import DeleteAccountModal from '@/components/users/setting/DeleteAccountModal';
import NormalUserLayout from '@/components/users/layout';

const UserSettingPage = () => {
  const [username, setUsername] = useState('Victor Ukaigwe');
  const [email, setEmail] = useState('iamvickd@gmail.com');
  const [dob, setDob] = useState('2024-01-12');
  const [password, setPassword] = useState('');
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
    <NormalUserLayout title="Settings">
      <div className="relative min-h-screen bg-gray-50">
        <div className={`max-w-7xl mx-auto p-8 w-full transition-all duration-300 ${modalOpen ? 'filter blur-sm pointer-events-none select-none' : ''}`}>
          <h1 className="text-3xl font-bold mb-8">Settings</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <UsernameSetting username={username} onChange={setUsername} />
            <EmailSetting email={email} onChange={setEmail} />
            <PasswordSetting onChange={setPassword} />
            <DOBSetting dob={dob} onChange={setDob} />
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
    </NormalUserLayout>
  );
};

export default UserSettingPage;
