import { Request, Response, NextFunction } from 'express';
import ClassMember from '../models/ClassMember';

export const checkClassMember = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { classId } = req.params;

    if (!userId || !classId) {
      res.status(400).json({ status: 'fail', message: '잘못된 요청입니다.' });
      return;
    }

    const membership = await ClassMember.findOne({
      where: { user_id: userId, class_id: classId },
    });

    if (!membership) {
      res
        .status(403)
        .json({ status: 'fail', message: '클래스 멤버가 아닙니다.' });
      return;
    }

    next();
  } catch (error) {
    res
      .status(500)
      .json({ status: 'error', message: '서버 오류가 발생했습니다.' });
  }
};
