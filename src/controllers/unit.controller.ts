import { Request, Response } from 'express';
import Unit from '../models/Unit';
import Subunit from '../models/Subunit';
import sequelize from '../database';

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
        message: '단원명은 필수 입력 값입니다.',
      });
      return;
    }

    const newUnit = await Unit.create({ class_id, name, description });
    res.status(201).json({
      status: 'success',
      message: '단원이 성공적으로 생성되었습니다.',
      unit: newUnit,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: '단원 생성 중 오류가 발생했습니다.',
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
        message: '단원을 찾을 수 없습니다.',
      });
      return;
    }

    if (unit.deleted_at) {
      res.status(400).json({
        status: 'fail',
        message: '삭제된 단원은 수정할 수 없습니다.',
      });
      return;
    }

    await unit.update({ name, description });
    res.status(200).json({
      status: 'success',
      message: '단원이 성공적으로 수정되었습니다.',
      unit,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: '단원 수정 중 오류가 발생했습니다.',
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
        message: '단원을 찾을 수 없습니다.',
      });
      return;
    }

    await unit.destroy();

    res.status(200).json({
      status: 'success',
      message: '단원이 성공적으로 삭제되었습니다.',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: '단원 삭제 중 오류가 발생했습니다.',
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
      message: '단원 및 소단원이 성공적으로 조회되었습니다.',
      units,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: '단원 및 소단원 조회 중 오류가 발생했습니다.',
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
        message: '단원을 찾을 수 없습니다.',
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
      message: '단원 상세 정보를 가져오는 중 오류가 발생했습니다.',
      error: (error as Error).message,
    });
  }
};
