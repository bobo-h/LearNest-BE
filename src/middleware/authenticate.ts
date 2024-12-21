import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET_KEY || 'defaultsecret';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ status: 'fail', message: '토큰이 필요합니다.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    res
      .status(401)
      .json({ status: 'fail', message: '유효하지 않은 토큰입니다.' });
  }
};