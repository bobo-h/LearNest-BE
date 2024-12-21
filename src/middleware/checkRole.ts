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
        res
          .status(401)
          .json({ status: 'fail', message: '인증되지 않았습니다.' });
        return;
      }

      const user = await User.findByPk(userId);
      if (!user || user.role !== requiredRole) {
        res
          .status(403)
          .json({ status: 'fail', message: '접근 권한이 없습니다.' });
        return;
      }

      next();
    } catch (error) {
      res
        .status(500)
        .json({ status: 'error', message: '서버 오류가 발생했습니다.' });
    }
  };
};
