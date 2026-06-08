import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function ForgotPassword() {
  const { resetPasswordEmail } = useAuthStore()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await resetPasswordEmail(email)
      setSent(true)
    } catch {
      setError('Could not send reset email. Try again.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-gray-700">
          Check your inbox — we sent a reset link to <strong>{email}</strong>.
        </p>
        <Link to="/login" className="block text-sm text-gray-500 hover:text-gray-900">
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-center text-sm text-gray-500">
        Enter your email and we&#39;ll send you a reset link.
      </p>
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
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Sending…' : 'Send reset link'}
        </Button>
      </form>
      <p className="text-center text-sm">
        <Link to="/login" className="text-gray-500 hover:text-gray-900">
          Back to sign in
        </Link>
      </p>
    </div>
  )
}
