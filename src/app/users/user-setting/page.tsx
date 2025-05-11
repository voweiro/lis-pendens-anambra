"use client";

import React, { useState, useEffect } from 'react';
import UsernameSetting from '@/components/users/setting/UsernameSetting';
import PasswordSetting from '@/components/users/setting/PasswordSetting';
import PasswordConfirmationSetting from '@/components/users/setting/PasswordConfirmationSetting';
import DOBSetting from '@/components/users/setting/DOBSetting';
import DeleteAccountModal from '@/components/users/setting/DeleteAccountModal';
import NormalUserLayout from '@/components/users/layout';
import { UpdateProfileRequest } from '@/Services/AuthRequest/auth.request';
import { toast } from 'react-toastify';

const UserSettingPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Function to fetch user data from session storage
  const fetchUserData = () => {
    try {
      // Get user data from session storage
      const authStr = sessionStorage.getItem('auth');
      if (authStr) {
        const auth = JSON.parse(authStr);
        if (auth.data) {
          // Use data from auth object
          setUsername(auth.data.first_name || auth.data.name || 'User');
          setEmail(auth.data.email || '');
          setDob(auth.data.date_of_birth || auth.data.dob || '');
          console.log('Loaded user data from auth:', auth.data);
        } else {
          // Fallback to user object if available
          const userStr = sessionStorage.getItem('user');
          if (userStr) {
            const userData = JSON.parse(userStr);
            setUsername(userData.first_name || userData.name || 'User');
            setEmail(userData.email || '');
            setDob(userData.date_of_birth || userData.dob || '');
            console.log('Loaded user data from user:', userData);
          } else {
            console.log('No user data found in session storage');
            // Set default values
            setUsername('User');
          }
        }
      } else {
        console.log('No auth data found in session storage');
        // Set default values
        setUsername('User');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load user data');
      // Set default values
      setUsername('User');
    }
  };

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);

    try {
      // Validate password confirmation if password is provided
      if (password && password !== passwordConfirmation) {
        setLoading(false);
        setMessage({ type: 'error', text: 'Passwords do not match' });
        return;
      }

      // Prepare update data
      const updateData: {
        name?: string;
        dob?: string;
        password?: string;
        password_confirmation?: string;
      } = {};

      // Only include fields that have changed
      if (username) updateData.name = username;
      if (dob) updateData.dob = dob;
      if (password) {
        updateData.password = password;
        updateData.password_confirmation = passwordConfirmation;
      }

      // Call the update profile API
      const response = await UpdateProfileRequest(updateData);
      console.log('Profile update response:', response);

      // Reload user data from session storage to reflect the changes
      fetchUserData();

      setLoading(false);
      setMessage({ type: 'success', text: 'Profile updated successfully' });
      toast.success('Profile updated successfully');

      // Clear password fields after successful update
      setPassword('');
      setPasswordConfirmation('');
    } catch (error) {
      console.error('Error updating profile:', error);
      setLoading(false);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
      toast.error('Failed to update profile');
    }
  };

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
            <DOBSetting dob={dob} onChange={setDob} />
            <PasswordSetting 
              password={password} 
              onChange={setPassword}
            />
            <PasswordConfirmationSetting 
              passwordConfirmation={passwordConfirmation}
              onChangeConfirmation={setPasswordConfirmation}
            />
          </div>
          <div className="flex justify-between items-center mt-8">
            <button
              className="bg-red-50 text-red-600 border border-red-200 px-6 py-2 rounded-lg font-semibold hover:bg-red-100 transition"
              onClick={() => setModalOpen(true)}
            >
              Delete Account
            </button>
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
          {message && (
            <div className={`mt-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message.text}
            </div>
          )}
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
