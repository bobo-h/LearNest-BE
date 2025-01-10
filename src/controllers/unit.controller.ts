import { Request, Response } from 'express';
import Unit from '../models/Unit';
import Subunit from '../models/Subunit';

export const createUnit = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const class_id = Number(req.params.classId);
    const { name, description } = req.body;

    if (!name) {
      res.status(400).json({
        status: 'fail',
        message: 'Unit name is a required field.',
      });
      return;
    }

    const newUnit = await Unit.create({ class_id, name, description });
    res.status(201).json({
      status: 'success',
      message: 'Unit created successfully.',
      unit: newUnit,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error occurred.',
      error: (error as Error).message,
    });
  }
};

export const updateUnit = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const unit = await Unit.findByPk(id);
    if (!unit) {
      res.status(404).json({
        status: 'fail',
        message: 'Unit not found.',
      });
      return;
    }

    if (unit.deleted_at) {
      res.status(400).json({
        status: 'fail',
        message: 'Deleted units cannot be modified.',
      });
      return;
    }

    await unit.update({ name, description });
    res.status(200).json({
      status: 'success',
      message: 'Unit updated successfully.',
      unit,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error occurred.',
      error: (error as Error).message,
    });
  }
};

export const deleteUnit = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const unit = await Unit.findByPk(id);
    if (!unit) {
      res.status(404).json({
        status: 'fail',
        message: 'Unit not found.',
      });
      return;
    }

    await unit.destroy();

    res.status(200).json({
      status: 'success',
      message: 'Unit deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error occurred.',
      error: (error as Error).message,
    });
  }
};

export const getUnitsWithSubunits = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const class_id = Number(req.params.classId);

    const units = await Unit.findAll({
      where: { class_id },
      include: [
        {
          model: Subunit,
          as: 'subunits',
          attributes: ['id', 'name', 'description'],
        },
      ],
      attributes: ['id', 'name', 'description'],
    });

    res.status(200).json({
      status: 'success',
      message: 'Units and subunits retrieved successfully.',
      units,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error occurred.',
      error: (error as Error).message,
    });
  }
};

export const getUnitDetails = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const unit = await Unit.findOne({
      where: { id },
      attributes: ['id', 'name', 'description'],
    });

    if (!unit) {
      res.status(404).json({
        status: 'fail',
        message: 'Unit not found.',
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      unit,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error occurred.',
      error: (error as Error).message,
    });
  }
};
