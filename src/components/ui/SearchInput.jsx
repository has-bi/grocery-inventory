"use client";
import { FiX } from "react-icons/fi";

export function SearchInput({
  placeholder,
  icon,
  value,
  onChange,
  className = ""
}) {
  const handleClear = () => {
    onChange("");
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        {icon}
      </div>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-base sm:text-sm text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-black transition-colors"
          onClick={handleClear}
        >
          <FiX />
        </button>
      )}
    </div>
  );
}
