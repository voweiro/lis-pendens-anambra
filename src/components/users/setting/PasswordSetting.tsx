import React, { useState, useRef } from 'react';
import { FiLock } from 'react-icons/fi';

interface PasswordSettingProps {
  password?: string;
  onChange: (value: string) => void;
  passwordConfirmation?: string;
  onChangeConfirmation?: (value: string) => void;
}

const PasswordSetting: React.FC<PasswordSettingProps> = ({ password = '', onChange, passwordConfirmation = '', onChangeConfirmation }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(password);
  const [confirmValue, setConfirmValue] = useState(passwordConfirmation);
  const inputRef = useRef<HTMLInputElement>(null);
  const confirmInputRef = useRef<HTMLInputElement>(null);

  const handleEdit = () => {
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleBlur = () => {
    setEditing(false);
    onChange(value);
    if (onChangeConfirmation) {
      onChangeConfirmation(confirmValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setEditing(false);
      onChange(value);
      if (onChangeConfirmation) {
        onChangeConfirmation(confirmValue);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-2 min-w-[320px]">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-lg">Change password</span>
        <button onClick={handleEdit} className="text-gray-400 hover:text-black"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l4 4M3 13.5V17h3.5l9.5-9.5-3.5-3.5L3 13.5z"/></svg></button>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 cursor-pointer" onClick={handleEdit}>
          <FiLock className="text-2xl text-gray-400" />
          {editing ? (
            <input
              ref={inputRef}
              className="bg-transparent outline-none text-base w-full"
              value={value}
              onChange={e => setValue(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              type="password"
              placeholder="Enter new password"
            />
          ) : (
            <span className="text-base">{password ? '***************' : 'No password set'}</span>
          )}
        </div>
        
        {editing && (
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
            <FiLock className="text-2xl text-gray-400" />
            <input
              ref={confirmInputRef}
              className="bg-transparent outline-none text-base w-full"
              value={confirmValue}
              onChange={e => setConfirmValue(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              type="password"
              placeholder="Confirm new password"
            />
          </div>
        )}
        
        {editing && value && confirmValue && value !== confirmValue && (
          <div className="text-red-500 text-sm mt-1 ml-2">
            Passwords do not match
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordSetting;
