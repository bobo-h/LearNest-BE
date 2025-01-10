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
      res.status(404).json({ message: 'The unit does not exist.' });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server error occurred.',
      error: (error as Error).message,
    });
  }
};
