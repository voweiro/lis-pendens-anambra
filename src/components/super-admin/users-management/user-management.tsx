"use client";

import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronLeft, ChevronRight, Check, Phone, Calendar, User as UserIcon, Mail, Clock, Building, MapPin, Trash2, AlertTriangle } from 'lucide-react';
import { UserData, getAllUsers, updateUserStatus, addUser, deleteUser, NewUserData } from '@/components/utils/api';

// Enhanced user interface with UI state
interface UserWithUIState extends UserData {
  // UI state properties
  showDetails?: boolean;
}

// New user form interface - matches the API's NewUserData interface
interface NewUser extends Omit<NewUserData, 'court_info'> {
  court_info?: string;
  court_number?: string;
  judicial_division?: string;
  password_confirmation: string;
}

const UserManagementSystem: React.FC = () => {
  const [users, setUsers] = useState<UserWithUIState[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPermissionDropdown, setShowPermissionDropdown] = useState(false);
  const [newUser, setNewUser] = useState<NewUser>({
    name: '',
    email: '',
    phone_number: '',
    dob: '',
    type: 'individual',
    password: '',
    password_confirmation: '',
    is_active: '1',
    court_info: '',
    court_number: '',
    judicial_division: ''
  });
  
  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUsers();
      // Map API response to component state
      const mappedUsers = Array.isArray(response) ? response : [];
      setUsers(mappedUsers.map(user => ({
        ...user,
        showDetails: false
      })));
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const userTypeOptions = [
    'individual',
    'company',
    'court_staff',
    'admin'
  ];

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleAddUser = async () => {
    // Clear previous error
    setFormError(null);
    
    // Validate form fields - only check the most critical fields
    let emptyFields: string[] = [];
    
    // Check basic required fields
    if (!newUser.name || newUser.name.trim() === '') emptyFields.push('Name');
    if (!newUser.email || newUser.email.trim() === '') emptyFields.push('Email');
    if (!newUser.password || newUser.password.trim() === '') emptyFields.push('Password');
    if (!newUser.password_confirmation || newUser.password_confirmation.trim() === '') emptyFields.push('Password Confirmation');
    
    // Don't strictly validate these fields as they might be optional
    // Phone number and date of birth might be optional in some cases
    
    if (emptyFields.length > 0) {
      setFormError(`Please fill in the following required fields: ${emptyFields.join(', ')}`);
      return;
    }

    // Check if passwords match
    if (newUser.password !== newUser.password_confirmation) {
      setFormError('Passwords do not match');
      return;
    }
    
    // Make sure password is at least 6 characters
    if (newUser.password.length < 6) {
      setFormError('Password must be at least 6 characters long');
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    try {
      // Prepare user data for API
      const userData: NewUserData = {
        name: newUser.name,
        email: newUser.email,
        phone_number: newUser.phone_number,
        dob: newUser.dob, // API expects YYYY-MM-DD format
        type: newUser.type,
        password: newUser.password,
        password_confirmation: newUser.password_confirmation,
        is_active: newUser.is_active
      };
      
      // Log the data being sent to the API for debugging
      console.log('Sending user data to API:', JSON.stringify(userData, null, 2));

      // Add court-related fields if user type is court_staff
      if (newUser.type === 'court_staff') {
        if (newUser.court_info) {
          userData.court_info = newUser.court_info;
        }
        // Include additional court-related fields in the API request
        if (newUser.court_number) {
          userData.court_number = newUser.court_number;
        }
        if (newUser.judicial_division) {
          userData.judicial_division = newUser.judicial_division;
        }
      }

      // Call API to add user
      const response = await addUser(userData);
      console.log('User added successfully:', response);
      
      // Close modal and show success message
      setShowAddModal(false);
      setShowSuccessModal(true);
      
      // Refresh user list
      fetchUsers();
      
      // Reset form
      setNewUser({
        name: '',
        email: '',
        phone_number: '',
        dob: '',
        type: 'individual',
        password: '',
        password_confirmation: '',
        is_active: '1',
        court_info: '',
        court_number: '',
        judicial_division: ''
      });
    } catch (err) {
      console.error('Error adding user:', err);
      
      // Provide more detailed error information
      if (err instanceof Error) {
        setFormError(`Error: ${err.message}`);
        console.error('Error details:', err);
      } else if (typeof err === 'object' && err !== null) {
        // Try to extract more information from the error object
        const errorMessage = JSON.stringify(err);
        setFormError(`API Error: ${errorMessage}`);
      } else {
        setFormError('Failed to add user. Please check the console for more details.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to open delete confirmation modal
  const confirmDelete = (userId: number) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
    setDeleteError(null);
  };

  // Function to handle user deletion
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      await deleteUser(userToDelete);
      
      // Remove the deleted user from the state
      setUsers(users.filter(user => user.id !== userToDelete));
      
      // Close the modal
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      
      // Set error message
      if (err instanceof Error) {
        setDeleteError(err.message);
      } else {
        setDeleteError('Failed to delete user. Please try again.');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleStatus = async (id: number, currentStatus: string) => {
    try {
      const newStatus = currentStatus === '1' ? '0' : '1';
      await updateUserStatus(id, newStatus);
      
      // Update local state
      setUsers(users.map(user => 
        user.id === id 
          ? { ...user, is_active: newStatus }
          : user
      ));
    } catch (err) {
      console.error('Error updating user status:', err);
      setError('Failed to update user status. Please try again.');
    }
  };

  const StatusToggle = ({ isActive, onChange }: { isActive: string; onChange: () => void }) => (
    <div className="flex items-center gap-2">
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          isActive === '1' ? 'bg-green-500' : 'bg-gray-400'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isActive === '1' ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      <span className={`text-sm ${isActive === '1' ? 'text-green-600' : 'text-gray-500'}`}>
        {isActive === '1' ? 'Active' : 'Inactive'}
      </span>
    </div>
  );

  return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 border-b-2 border-blue-600 inline-block pb-1">
          User list
        </h1>
      </div>

      {/* Add User Button */}
      <div className="mb-4 sm:mb-6">
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New User
        </button>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="text-center py-8 bg-white rounded-lg shadow-sm">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading users...</p>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          <p>{error}</p>
          <button 
            onClick={fetchUsers}
            className="mt-2 text-sm text-red-600 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && users.length === 0 && (
        <div className="text-center py-8 bg-white rounded-lg shadow-sm">
          <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding a new user.</p>
        </div>
      )}

      {/* User Table - Desktop */}
      {!loading && !error && users.length > 0 && (
        <div className="hidden lg:block bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-3 xl:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                  #
                </th>
                <th className="px-3 xl:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-3 xl:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-3 xl:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 xl:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Type
                </th>
                <th className="px-3 xl:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-3 xl:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}.
                  </td>
                  <td className="px-3 xl:px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-500 underline">{user.email}</div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </div>
                  </td>
                  <td className="px-3 xl:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-3 xl:px-6 py-4 whitespace-nowrap">
                    <StatusToggle 
                      isActive={user.is_active} 
                      onChange={() => toggleStatus(user.id, user.is_active)} 
                    />
                  </td>
                  <td className="px-3 xl:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="max-w-32 xl:max-w-none truncate">{user.type}</div>
                  </td>
                  <td className="px-3 xl:px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                        Edit
                      </button>
                      <button 
                        onClick={() => confirmDelete(user.id)}
                        className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50 transition-colors flex items-center"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination - Desktop */}
        <div className="px-3 xl:px-6 py-4 flex items-center justify-between border-t">
          <div className="flex items-center gap-1 sm:gap-2">
            <button 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className="p-2 rounded hover:bg-gray-100 transition-colors"
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {[1, 2, 3, 4].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-2 sm:px-3 py-1 rounded transition-colors ${
                  currentPage === page
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button 
              onClick={() => setCurrentPage(Math.min(4, currentPage + 1))}
              className="p-2 rounded hover:bg-gray-100 transition-colors"
              disabled={currentPage === 4}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      )}

      {/* User Cards - Mobile & Tablet */}
      {!loading && !error && users.length > 0 && (
        <div className="lg:hidden space-y-4">
        {users.map((user, index) => (
          <div key={user.id} className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-gray-500">#{index + 1}</span>
                  <span className="text-base font-medium text-gray-900">{user.name}</span>
                </div>
                <div className="text-sm text-gray-500 underline mb-2">{user.email}</div>
                <div className="text-sm text-gray-700 mb-2">
                  <span className="font-medium">User Type:</span> {user.type}
                </div>
              </div>
              <div className="flex space-x-2 ml-4">
                <button className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                  Edit
                </button>
                <button 
                  onClick={() => confirmDelete(user.id)}
                  className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50 transition-colors flex items-center"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <StatusToggle 
                isActive={user.is_active} 
                onChange={() => toggleStatus(user.id, user.is_active)} 
              />
            </div>
          </div>
        ))}

        {/* Pagination - Mobile */}
        <div className="mt-4 bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-center gap-1">
            <button 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className="p-2 rounded hover:bg-gray-100 transition-colors"
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {[1, 2, 3, 4].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded transition-colors ${
                  currentPage === page
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button 
              onClick={() => setCurrentPage(Math.min(4, currentPage + 1))}
              className="p-2 rounded hover:bg-gray-100 transition-colors"
              disabled={currentPage === 4}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-gray-700 text-white rounded-t-lg">
              <h2 className="text-lg font-semibold">Add new user</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* User's Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User's Name:
                  </label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              

                {/* User Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User Type:
                  </label>
                  <input
                    type="text"
                    value={newUser.type}
                    onChange={(e) => setNewUser({ ...newUser, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={newUser.phone_number}
                    onChange={(e) => setNewUser({ ...newUser, phone_number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. +234 800 000 0000"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={newUser.dob}
                    onChange={(e) => setNewUser({ ...newUser, dob: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* User Type */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User Type
                  </label>
                  <button
                    onClick={() => setShowPermissionDropdown(!showPermissionDropdown)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-between"
                  >
                    <span className="truncate">{newUser.type}</span>
                    <ChevronDown className="w-4 h-4 flex-shrink-0 ml-2" />
                  </button>
                  
                  {showPermissionDropdown && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 mt-1">
                      {userTypeOptions.map((option: string) => (
                        <button
                          key={option}
                          onClick={() => {
                            setNewUser({ ...newUser, type: option });
                            setShowPermissionDropdown(false);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Status */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setNewUser({
                        ...newUser,
                        is_active: newUser.is_active === '1' ? '0' : '1'
                      })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        newUser.is_active === '1' ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          newUser.is_active === '1' ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <span className={`text-sm ${newUser.is_active === '1' ? 'text-green-600' : 'text-gray-500'}`}>
                      {newUser.is_active === '1' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {/* Password */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Confirm Password */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={newUser.password_confirmation}
                    onChange={(e) => setNewUser({ ...newUser, password_confirmation: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Court Information (conditional) */}
                {newUser.type === 'court_staff' && (
                  <>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Court Information
                      </label>
                      <input
                        type="text"
                        value={newUser.court_info || ''}
                        onChange={(e) => setNewUser({ ...newUser, court_info: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter court information"
                      />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Court Number
                      </label>
                      <input
                        type="text"
                        value={newUser.court_number || ''}
                        onChange={(e) => setNewUser({ ...newUser, court_number: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter court number"
                      />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Judicial Division
                      </label>
                      <input
                        type="text"
                        value={newUser.judicial_division || ''}
                        onChange={(e) => setNewUser({ ...newUser, judicial_division: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter judicial division"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Form Error Display */}
              {formError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  {formError}
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 sm:mt-8">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-full sm:w-auto px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors order-2 sm:order-1"
                  disabled={isSubmitting}
                >
                  Back
                </button>
                <button
                  onClick={handleAddUser}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors order-1 sm:order-2 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    'Add User'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 mx-4 text-center max-w-sm w-full">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this user? This action cannot be undone.</p>
            
            {deleteError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {deleteError}
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-full sm:w-auto px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors order-2 sm:order-1"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={isDeleting}
                className="w-full sm:w-auto px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors order-1 sm:order-2 flex items-center justify-center"
              >
                {isDeleting ? (
                  <>
                    <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete User'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 mx-4 text-center max-w-sm w-full">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Success!</h3>
            <p className="text-gray-600 mb-6">New user has been added successfully.</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementSystem;