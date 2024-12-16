import { Request, Response } from 'express';
import User from '../models/User';

export const getUserProfile = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: [
        'id',
        'name',
        'email',
        'birth_date',
        'role',
        'created_at',
        'updated_at',
      ],
    });

    if (!user) {
      res.status(404).json({
        status: 'fail',
        code: 404,
        message: '사용자를 찾을 수 없습니다.',
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      user,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      code: 500,
      message: '서버 내부 오류가 발생했습니다.',
      error: (error as Error).message,
    });
  }
};
