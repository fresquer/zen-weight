import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function Login() {
  const { login } = useAuthStore()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/app')
    } catch {
      setError('Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          id="email"
          type="email"
          placeholder="Email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          id="password"
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      {import.meta.env.DEV && import.meta.env.VITE_DEV_EMAIL && (
        <button
          type="button"
          onClick={() =>
            login(import.meta.env.VITE_DEV_EMAIL, import.meta.env.VITE_DEV_PASSWORD).then(
              () => navigate('/app'),
            )
          }
          className="w-full rounded-lg border border-dashed border-gray-300 py-2 text-xs text-gray-400 hover:border-gray-400 hover:text-gray-600"
        >
          Dev access
        </button>
      )}

      <div className="flex flex-col items-center gap-3 pt-2 text-sm text-gray-500">
        <Link to="/forgot-password" className="hover:text-gray-900">
          Forgot password?
        </Link>
        <span>
          No account?{' '}
          <Link to="/register" className="font-medium text-gray-900 underline underline-offset-2">
            Register
          </Link>
        </span>
      </div>
    </div>
  )
}
