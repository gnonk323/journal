import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.auth_token
  if (!token) return res.status(401).send('Unauthorized')

  try {
    jwt.verify(token, env.jwtSecret)
    next()
  } catch (err) {
    res.status(401).send('Invalid Token')
  }
}