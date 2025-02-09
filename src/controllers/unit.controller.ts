import { Request, Response } from 'express';
import sequelize from '../database';
import { Unit, Subunit, Assignment } from '../models';

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

export const getUnitsWithDetails = async (
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
          include: [
            {
              model: Assignment,
              as: 'assignments',
              attributes: [
                'id',
                'subunit_id',
                'title',
                'content',
                'attachment',
                'created_at',
              ],
              order: [['created_at', 'ASC']],
            },
          ],
          order: [['sort_order', 'ASC']],
        },
      ],
      attributes: ['id', 'sort_order', 'name', 'description'],
      order: [['sort_order', 'ASC']],
    });

    const parsedUnits = units.map((unit) => unit.toJSON());

    res.status(200).json({
      status: 'success',
      message: 'Units, subunits, and assignments retrieved successfully.',
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

export const batchProcessUnits = async (
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
            let subunitInstance;

            if (subunit.type === 'create') {
              subunitInstance = await Subunit.create(
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
              subunitInstance = await Subunit.findByPk(subunit.id);
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
              await Subunit.destroy({ where: { id: subunit.id }, transaction });
              continue; // 삭제 시에는 과제 처리 생략
            }

            // 과제(Assignment) 처리
            if (subunit.assignments && Array.isArray(subunit.assignments)) {
              for (const assignment of subunit.assignments) {
                if (assignment.type === 'create') {
                  await Assignment.create(
                    {
                      subunit_id: subunitInstance?.id || subunit.id,
                      title: assignment.title,
                      content: assignment.content,
                      attachment: assignment.attachment || null,
                    },
                    { transaction },
                  );
                } else if (assignment.type === 'update') {
                  const assignmentInstance = await Assignment.findByPk(
                    assignment.id,
                  );
                  if (assignmentInstance) {
                    await assignmentInstance.update(
                      {
                        title: assignment.title,
                        content: assignment.content,
                        attachment: assignment.attachment || null,
                      },
                      { transaction },
                    );
                  }
                } else if (assignment.type === 'delete') {
                  await Assignment.destroy({
                    where: { id: assignment.id },
                    transaction,
                  });
                }
              }
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
