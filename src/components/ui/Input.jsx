export function Input({ label, id, className = '', error, ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-300 focus:border-lime-400 focus:ring-2 focus:ring-lime-100 ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}
