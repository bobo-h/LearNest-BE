import { Op } from 'sequelize';
import { Request, Response, NextFunction } from 'express';
import ClassMember from '../models/ClassMember';

export const checkClassRole = (allowedRoles: string[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      const { classId } = req.params;

      if (!userId || !classId) {
        res.status(400).json({ status: 'fail', message: 'Invalid request.' });
        return;
      }

      const membership = await ClassMember.findOne({
        where: {
          user_id: userId,
          class_id: classId,
          role: { [Op.in]: allowedRoles },
        },
      });

      if (!membership) {
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
