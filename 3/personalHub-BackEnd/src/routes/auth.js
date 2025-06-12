import express from 'express'
import { createClient } from '@supabase/supabase-js'

const router = express.Router()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Signup
router.post('/signup', async (req, res) => {
  const { email, password } = req.body

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (error) return res.status(400).json({ error: error.message })
  res.json({ user: data.user })
})

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const response = await fetch(
      `${process.env.SUPABASE_URL}/auth/v1/token?grant_type=password`,
      {
        method: 'POST',
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      }
    )

    const data = await response.json()
    if (data.error) return res.status(401).json({ error: data.error_description })

    // Optionally set cookies here
    // res.cookie('access_token', data.access_token, { httpOnly: true, secure: true })

    res.json(data)
  } catch (err) {
    res.status(500).json({ error: 'Login failed' })
  }
})

// Example: Authenticated user info
router.get('/auth/user', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '')

  if (!token) return res.status(401).json({ error: 'Missing token' })

  const { data, error } = await supabase.auth.getUser(token)
  if (error) return res.status(401).json({ error: error.message })

  res.json({ user: data.user })
})
// Logout
router.post('/logout', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '')

  if (!token) return res.status(400).json({ error: 'Missing token' })

  // Revoke the session using Supabase Admin API
  const { data, error } = await supabase.auth.admin.listUsers()
  if (error) return res.status(500).json({ error: error.message })

  const user = await supabase.auth.getUser(token)
  if (!user.data?.user?.id) return res.status(401).json({ error: 'Invalid token' })

  const revokeRes = await supabase.auth.admin.signOutUser(user.data.user.id)
  if (revokeRes.error) return res.status(500).json({ error: revokeRes.error.message })

  // If you're using cookies, clear them here:
  // res.clearCookie('access_token')

  res.json({ message: 'Logged out successfully' })
})


export default router
