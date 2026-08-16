import bcrypt from 'bcryptjs';
import * as UserModel from '../models/user.model.js';
import { signToken } from '../utils/jwt.js';

export async function signup({ username, email, password }) {
  const existing = await UserModel.findUserByEmail(email)
  if (existing) {
    const err = new Error('Email already registered')
    err.status = 409
    throw err
  }
 
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await UserModel.createUser({ username, email, passwordHash })
  const token = signToken({ userId: user.id })
 
  return { user, token }
}
 
export async function login({ email, password }) {
  const user = await UserModel.findUserByEmail(email)
  if (!user) {
    const err = new Error('Invalid email or password')
    err.status = 401
    throw err
  }
 
  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) {
    const err = new Error('Invalid email or password')
    err.status = 401
    throw err
  }
 
  const token = signToken({ userId: user.id })
  return { user, token }
}