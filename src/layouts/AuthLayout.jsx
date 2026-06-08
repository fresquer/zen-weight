import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="flex min-h-dvh flex-col items-center px-4 pt-16 pb-8 sm:pt-28">
      <div className="w-full max-w-sm">
        <h1 className="mb-10 text-center text-4xl font-light tracking-tight text-gray-900">
          zen weight
        </h1>
        <Outlet />
      </div>
    </div>
  )
}
