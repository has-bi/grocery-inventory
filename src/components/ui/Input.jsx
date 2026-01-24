export function Input({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  required = false,
  className = "",
  min,
  labelPlacement = "inside"
}) {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {label && labelPlacement === "outside" && (
        <label className="block text-sm text-gray-600 mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={labelPlacement === "inside" ? label || placeholder : placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
        value={value}
        onChange={handleChange}
        required={required}
        min={min}
      />
    </div>
  );
}
