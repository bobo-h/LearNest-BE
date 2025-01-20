import { Request, Response } from 'express';
import Subunit from '../models/Subunit';

export const getSubunitDetails = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const subunit = await Subunit.findOne({
      where: { id },
      attributes: ['id', 'name', 'description', 'content', 'materials_path'],
    });

    if (!subunit) {
      res.status(404).json({
        status: 'fail',
        message: 'Subunit not found.',
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      subunit,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error occurred.',
      error: (error as Error).message,
    });
  }
};
