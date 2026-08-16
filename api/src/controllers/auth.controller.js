import * as AuthService from '../services/auth.service.js';

const COOKIE_NAME = 'token';

const isProduction = process.env.NODE_ENV === 'production';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
}
 
export async function signup(req, res, next) {
  try {
    const { username, email, password } = req.body
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'username, email, and password are required' })
    }
 
    const { user, token } = await AuthService.signup({ username, email, password })
    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS)
    res.status(201).json({ user })
  } catch (err) {
    next(err)
  }
}
 
export async function login(req, res, next) {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' })
    }
 
    const { user, token } = await AuthService.login({ email, password })
    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS)
    res.json({ user: { id: user.id, username: user.username, email: user.email } })
  } catch (err) {
    next(err)
  }
}
 
export async function logout(req, res) {
  res.clearCookie(COOKIE_NAME)
  res.json({ message: 'Logged out' })
}
 
export async function me(req, res) {
  res.json({ user: req.user })
}