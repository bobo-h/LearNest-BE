import { Request, Response } from 'express';
import Subunit from '../models/Subunit';
import Unit from '../models/Unit';

export const createSubunit = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const unit_id = Number(req.params.unitId);
    const { name, description, content } = req.body;

    if (!name) {
      res.status(400).json({ message: 'name is required.' });
      return;
    }

    const newSubunit = await Subunit.create({
      unit_id,
      name,
      description,
      content,
    });

    res
      .status(201)
      .json({ message: 'Subunit created successfully.', subunit: newSubunit });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create subunit.',
      error: (error as Error).message,
    });
  }
};

export const updateSubunit = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, content } = req.body;

    const subunit = await Subunit.findByPk(id);
    if (!subunit) {
      res.status(404).json({ message: 'Subunit not found.' });
      return;
    }

    if (subunit.deleted_at) {
      res.status(400).json({
        status: 'fail',
        message: 'Deleted subunits cannot be modified.',
      });
      return;
    }

    await subunit.update({ name, description, content });

    res.status(200).json({ message: 'Subunit updated successfully.', subunit });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update subunit.',
      error: (error as Error).message,
    });
  }
};

export const deleteSubunit = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const subunit = await Subunit.findByPk(id);
    if (!subunit) {
      res.status(404).json({ message: 'Subunit not found.' });
      return;
    }

    await subunit.destroy();

    res.status(200).json({ message: 'Subunit deleted successfully.' });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete subunit.',
      error: (error as Error).message,
    });
  }
};

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
