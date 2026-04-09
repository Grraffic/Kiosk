import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const login = (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Use env variables or fallback defaults for the admin
  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'kiosk2026';

  if (username === adminUser && password === adminPass) {
    const token = jwt.sign(
      { username },
      process.env.JWT_SECRET || 'fallback_secret_for_development',
      { expiresIn: '1d' }
    );
    return res.json({ token });
  }

  return res.status(401).json({ message: 'Invalid credentials' });
};
