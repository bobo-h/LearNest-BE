import { Request, Response } from 'express';
import User from '../models/User';

export const getUserProfile = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = req.user?.id;

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
        message: 'User not found.',
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      message: 'User profile retrieved successfully.',
      user,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Internal server error occurred.',
      error: (error as Error).message,
    });
  }
};
