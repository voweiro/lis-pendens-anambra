import React, { useState, useRef } from 'react';
import { FiUser } from 'react-icons/fi';

interface UsernameSettingProps {
  username: string;
  onChange: (value: string) => void;
}

const UsernameSetting: React.FC<UsernameSettingProps> = ({ username, onChange }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(username);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleEdit = () => {
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleBlur = () => {
    setEditing(false);
    onChange(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setEditing(false);
      onChange(value);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-2 min-w-[320px]">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-lg">Username</span>
        <button onClick={handleEdit} className="text-gray-400 hover:text-black"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l4 4M3 13.5V17h3.5l9.5-9.5-3.5-3.5L3 13.5z"/></svg></button>
      </div>
      <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 cursor-pointer" onClick={handleEdit}>
        <FiUser className="text-2xl text-gray-400" />
        {editing ? (
          <input
            ref={inputRef}
            className="bg-transparent outline-none text-base w-full"
            value={value}
            onChange={e => setValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <span className="text-base">{username}</span>
        )}
      </div>
    </div>
  );
};

export default UsernameSetting;
