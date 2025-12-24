import jwt from 'jsonwebtoken';
import { Request, Response } from "express"
import bcrypt from "bcrypt"
import { env } from "../config/env"

export const login = async (req: Request, res: Response) => {
  const { password } = req.body
  const hash = env.passwordHash

  const isMatch = await bcrypt.compare(password, hash)

  if (isMatch) {
    const token = jwt.sign({ authenticated: true }, env.jwtSecret, { expiresIn: '1d' });
    
    res.cookie('auth_token', token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.json({ success: true });
  }

  res.status(401).json({ error: 'Incorrect password' });
}

export const logout = (req: Request, res: Response) => {
  res.clearCookie('auth_token', {
    httpOnly: true,
    sameSite: 'strict',
  });

  return res.status(200).json({ success: true, message: 'Logged out successfully' })
}

export const checkAuth = (req: Request, res: Response) => {
  res.status(200).json({ authenticated: true })
}