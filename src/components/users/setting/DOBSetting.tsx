import React, { useState, useRef } from 'react';
import { FiCalendar } from 'react-icons/fi';

interface DOBSettingProps {
  dob: string;
  onChange: (value: string) => void;
}

const DOBSetting: React.FC<DOBSettingProps> = ({ dob, onChange }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(dob);
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
        <span className="font-semibold text-lg">Date of Birth</span>
        <button onClick={handleEdit} className="text-gray-400 hover:text-black"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l4 4M3 13.5V17h3.5l9.5-9.5-3.5-3.5L3 13.5z"/></svg></button>
      </div>
      <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 cursor-pointer" onClick={handleEdit}>
        <FiCalendar className="text-2xl text-gray-400" />
        {editing ? (
          <input
            ref={inputRef}
            className="bg-transparent outline-none text-base w-full"
            value={value}
            onChange={e => setValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            type="date"
          />
        ) : (
          <span className="text-base">{dob}</span>
        )}
      </div>
    </div>
  );
};

export default DOBSetting;
