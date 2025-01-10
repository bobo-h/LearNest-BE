import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

export const checkRole = (requiredRole: 'admin' | 'user') => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ status: 'fail', message: 'Invalid request.' });
        return;
      }

      const user = await User.findByPk(userId);
      if (!user || user.role !== requiredRole) {
        res
          .status(403)
          .json({ status: 'fail', message: 'You do not have permission.' });
        return;
      }

      next();
    } catch (error) {
      res
        .status(500)
        .json({ status: 'error', message: 'Server error occurred.' });
    }
  };
};
