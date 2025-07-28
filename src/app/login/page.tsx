// app/login/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import styles from './Login.module.css'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setError(error.message)
    } else {
      router.push('/sharer')
    }

    setLoading(false)
  }

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        router.push('/sharer')
      }
    }

    checkSession()
  }, [])

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Nero Screen Share</h1>
      <form className={styles.form} onSubmit={handleLogin}>
        <div className={styles.group}>
          <label>Email</label>
          <input
            className={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.group}>
          <label>Password</label>
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button className={styles.button} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className={styles.signup}>
          Don’t have an account? <Link href="/signup">Sign up</Link>
        </p>
      </form>
    </main>
  )
}
