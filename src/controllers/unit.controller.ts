import { Request, Response } from 'express';
import sequelize from '../database';
import { Unit, Subunit } from '../models';

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
          attributes: [
            'id',
            'unit_id',
            'sort_order',
            'name',
            'description',
            'content',
            'materials_path',
          ],
          order: [['sort_order', 'ASC']],
        },
      ],
      attributes: ['id', 'sort_order', 'name', 'description'],
      order: [['sort_order', 'ASC']],
    });

    // JSON 문자열을 역직렬화(Deserialization)
    const parsedUnits = units.map((unit) => {
      const unitWithSubunits = unit.toJSON() as Unit & { subunits?: Subunit[] };
      return {
        ...unitWithSubunits,
        subunits: unitWithSubunits.subunits?.map((subunit) => ({
          ...subunit,
          content: subunit.content ? JSON.parse(subunit.content) : null,
          materials_path: subunit.materials_path
            ? JSON.parse(subunit.materials_path)
            : null,
        })),
      };
    });

    res.status(200).json({
      status: 'success',
      message: 'Units and subunits retrieved successfully.',
      units: parsedUnits,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error occurred.',
      error: (error as Error).message,
    });
  }
};

export const fetchUnitsWithSubunits = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const class_id = Number(req.params.classId);
  const { units } = req.body;

  if (!class_id || !Array.isArray(units)) {
    res.status(400).json({ message: 'Invalid request format' });
    return;
  }

  try {
    await sequelize.transaction(async (transaction) => {
      for (const unit of units) {
        let unitInstance;

        // 단원 처리
        if (unit.type === 'create') {
          unitInstance = await Unit.create(
            {
              class_id,
              sort_order: unit.sort_order,
              name: unit.name,
              description: unit.description,
            },
            { transaction },
          );
        } else if (unit.type === 'update') {
          unitInstance = await Unit.findByPk(unit.id);
          if (unitInstance) {
            await unitInstance.update(
              {
                name: unit.name,
                sort_order: unit.sort_order,
                description: unit.description,
              },
              { transaction },
            );
          }
        } else if (unit.type === 'delete') {
          await Unit.destroy({ where: { id: unit.id }, transaction });
          continue; // 삭제 시에는 소단원 처리 생략
        }

        // 소단원 처리
        if (unit.subunits && Array.isArray(unit.subunits)) {
          for (const subunit of unit.subunits) {
            if (subunit.type === 'create') {
              await Subunit.create(
                {
                  unit_id: unitInstance?.id || unit.id,
                  sort_order: subunit.sort_order,
                  name: subunit.name,
                  description: subunit.description,
                  content: subunit.content,
                  materials_path: subunit.materials_path,
                },
                { transaction },
              );
            } else if (subunit.type === 'update') {
              const subunitInstance = await Subunit.findByPk(subunit.id);
              if (subunitInstance) {
                await subunitInstance.update(
                  {
                    sort_order: subunit.sort_order,
                    name: subunit.name,
                    description: subunit.description,
                    content: subunit.content,
                    materials_path: subunit.materials_path,
                  },
                  { transaction },
                );
              }
            } else if (subunit.type === 'delete') {
              await Subunit.destroy({
                where: { id: subunit.id },
                transaction,
              });
            }
          }
        }
      }
    });

    res.status(200).json({ message: 'Batch actions processed successfully' });
  } catch (error) {
    console.error('Error processing batch actions:', error);
    res.status(500).json({ message: 'Error processing batch actions', error });
  }
};
