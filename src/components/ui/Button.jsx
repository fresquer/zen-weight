const variants = {
  primary:
    'bg-lime-500 text-white hover:bg-lime-400 focus-visible:ring-2 focus-visible:ring-lime-300',
  secondary:
    'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-gray-200',
  ghost:
    'text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-gray-200',
  danger:
    'text-red-500 hover:text-red-700 hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-200',
}

export function Button({
  variant = 'primary',
  className = '',
  disabled,
  children,
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
