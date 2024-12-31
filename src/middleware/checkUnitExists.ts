import { Request, Response, NextFunction } from 'express';
import Unit from '../models/Unit';

export const checkUnitExists = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { unitId } = req.params;

    const unit = await Unit.findByPk(unitId);
    if (!unit) {
      res.status(404).json({ message: '존재하지 않는 단원입니다.' });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: '단원 조회에 실패했습니다.',
      error: (error as Error).message,
    });
  }
};
