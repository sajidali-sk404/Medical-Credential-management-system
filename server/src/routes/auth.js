// routes/auth.js
import express from 'express'
import {
  register,
  login,
  logout,
  getMe,
} from '../controllers/auth.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

// ── Public routes — no token needed ──────────────────────────────
router.post('/register', register)
router.post('/login',    login)
router.post('/logout',   logout)

// ── Protected route — token required ─────────────────────────────
router.get('/me', verifyToken, getMe)

export default router