export function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-5 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
