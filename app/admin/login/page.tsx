'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error: err } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (err) throw err

      router.push('/admin')
      router.refresh()
    } catch (err) {
      console.error('Login error:', err)
      setError('Email o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-card p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-coffee rounded-lg flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
            M
          </div>
          <h1 className="text-2xl font-bold text-text-dark">
            Panel Administrador
          </h1>
          <p className="text-text-secondary mt-2">Mimbre Store</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-dark mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-coffee focus:ring-2 focus:ring-coffee/20"
              placeholder="admin@mimbrestore.cl"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-dark mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-coffee focus:ring-2 focus:ring-coffee/20"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-coffee text-white font-semibold rounded-lg hover:bg-coffee-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Iniciando sesión...' : 'Ingresar'}
          </button>
        </form>

        <p className="text-center text-text-secondary text-sm mt-6">
          Para obtener acceso, contacta al administrador
        </p>
      </div>
    </div>
  )
}
