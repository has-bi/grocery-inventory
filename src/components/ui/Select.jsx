export function Select({
  label,
  placeholder,
  selectedKeys,
  onChange,
  children,
  required = false,
  className = ""
}) {
  const selectedValue = selectedKeys && selectedKeys.length > 0 ? selectedKeys[0] : "";

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm text-gray-600 mb-2">
          {label}
        </label>
      )}
      <select
        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-base sm:text-sm text-black focus:outline-none focus:border-black transition-colors bg-white"
        value={selectedValue}
        onChange={onChange}
        required={required}
      >
        <option value="" disabled className="text-gray-400">
          {placeholder}
        </option>
        {children}
      </select>
    </div>
  );
}

export function SelectItem({ children, value }) {
  return (
    <option value={value} className="text-black">
      {children}
    </option>
  );
}
