import { Outlet, NavLink } from 'react-router-dom'
import { useState } from 'react'
import { LayoutDashboard, List, Settings, Plus } from 'lucide-react'
import { WeightForm } from '@/components/WeightForm'

const navItems = [
  { to: '/app', label: 'Home', icon: LayoutDashboard, end: true },
  { to: '/app/history', label: 'History', icon: List },
  { to: '/app/settings', label: 'Settings', icon: Settings },
]

export function AppLayout() {
  const [formOpen, setFormOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState(null)

  function openAdd() {
    setEditingEntry(null)
    setFormOpen(true)
  }

  function openEdit(entry) {
    setEditingEntry(entry)
    setFormOpen(true)
  }

  return (
    <div className="flex min-h-dvh flex-col bg-[#fafafa]">
      {/* Desktop top header */}
      <header className="hidden md:flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
        <span className="text-lg font-light tracking-tight text-gray-900">zen weight</span>
        <nav className="flex items-center gap-1">
          {navItems.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `rounded-lg px-3 py-1.5 text-sm font-medium ${
                  isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 rounded-lg bg-lime-500 px-4 py-2 text-sm font-medium text-white hover:bg-lime-400"
        >
          <Plus size={16} />
          Log weight
        </button>
      </header>

      {/* Mobile top bar */}
      <div className="flex md:hidden items-center justify-between px-4 py-3 border-b border-gray-100 bg-white">
        <span className="text-base font-light tracking-tight text-gray-900">zen weight</span>
        <button
          onClick={openAdd}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-lime-500 text-white hover:bg-lime-400"
          aria-label="Log weight"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Main content */}
      <main className="flex-1 px-4 py-6 pb-28 md:pb-8 md:px-6">
        <div className="mx-auto w-full max-w-lg">
          <Outlet context={{ openEdit }} />
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 md:hidden border-t border-gray-200 bg-white">
        <div className="flex">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium ${
                  isActive ? 'text-lime-600' : 'text-gray-400 hover:text-gray-700'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 1.75} />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      <WeightForm
        open={formOpen}
        editingEntry={editingEntry}
        onClose={() => { setFormOpen(false); setEditingEntry(null) }}
      />
    </div>
  )
}
