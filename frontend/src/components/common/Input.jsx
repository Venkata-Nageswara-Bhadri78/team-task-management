const Input = ({ label, name, type = 'text', value, onChange, placeholder, error, required = false }) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor={name}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-2 rounded-xl border focus:ring-2 focus:outline-none transition ${
          error ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-200'
        }`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
