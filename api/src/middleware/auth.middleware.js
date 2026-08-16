import { verifyToken } from "../utils/jwt.js";
import * as UserModel from '../models/user.model.js';

export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.token
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    const payload = verifyToken(token)
    const user = await UserModel.findUserById(payload.userId)
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session' })
  }
}