import { Request, Response } from 'express';
import Class from '../models/Class';
import ClassMember from '../models/ClassMember';
import sequelize from '../database';

export const createClass = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const transaction = await sequelize.transaction();

  try {
    const { name, description, visibility, mainImageUrl } = req.body;

    const userId = req.user?.id;
    if (!userId) {
      res.status(403).json({
        status: 'fail',
        code: 403,
        message: 'You do not have permission to create a class.',
      });
      return;
    }

    if (!name) {
      res.status(400).json({
        status: 'fail',
        code: 400,
        message: 'Class Name is a required field.',
      });
      return;
    }

    const existingClass = await Class.findOne({ where: { name }, transaction });
    if (existingClass) {
      res.status(409).json({
        status: 'fail',
        code: 409,
        message: 'Duplicate class name found.',
      });
      return;
    }

    const newClass = await Class.create(
      {
        name,
        main_image: mainImageUrl || null,
        description: description || null,
        visibility: visibility || 'private',
        created_by: userId,
      },
      { transaction },
    );

    await ClassMember.create(
      {
        class_id: newClass.id,
        user_id: userId,
        role: 'instructor',
      },
      { transaction },
    );

    await transaction.commit();

    res.status(201).json({
      status: 'success',
      message: 'Class creation successful.',
      class: {
        id: newClass.id,
        name: newClass.name,
        visibility: newClass.visibility,
        created_at: newClass.created_at,
        created_by: newClass.created_by,
        main_image: newClass.main_image,
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating class:', error);
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Internal server error occurred.',
      error: (error as Error).message,
    });
  }
};

export const getUserClasses = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(403).json({
        status: 'fail',
        code: 403,
        message: 'User authentication is required.',
      });
      return;
    }

    const allClasses = await Class.findAll({
      include: [
        {
          model: ClassMember,
          where: { user_id: userId },
          attributes: ['role'],
          as: 'members',
          required: false,
        },
      ],
    });

    const createdClasses = allClasses.filter((cls) =>
      cls.members?.some((member: ClassMember) => member.role === 'instructor'),
    );

    const joinedClasses = allClasses.filter((cls) =>
      cls.members?.some((member: ClassMember) => member.role === 'student'),
    );

    res.status(200).json({
      status: 'success',
      created_classes: createdClasses,
      joined_classes: joinedClasses,
    });
  } catch (error) {
    console.error('Error fetching user classes:', error);
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Internal server error occurred.',
      error: (error as Error).message,
    });
  }
};

export const updateClass = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const transaction = await sequelize.transaction();

  try {
    const id = Number(req.params.classId);
    const { name, description, visibility, mainImageUrl } = req.body;

    const userId = req.user?.id;
    if (!userId) {
      res.status(403).json({
        status: 'fail',
        code: 403,
        message: 'You do not have permission to update this class.',
      });
      return;
    }

    const targetClass = await Class.findOne({
      where: { id },
      transaction,
    });

    if (!targetClass) {
      res.status(404).json({
        status: 'fail',
        code: 404,
        message: 'Class not found.',
      });
      return;
    }

    if (name && name !== targetClass.name) {
      const existingClass = await Class.findOne({
        where: { name },
        transaction,
      });

      if (existingClass) {
        res.status(409).json({
          status: 'fail',
          code: 409,
          message: 'Duplicate class name found.',
        });
        return;
      }
    }

    await targetClass.update(
      {
        name: name || targetClass.name,
        description: description || targetClass.description,
        visibility: visibility || targetClass.visibility,
        main_image: mainImageUrl || targetClass.main_image,
      },
      { transaction },
    );

    await transaction.commit();

    res.status(200).json({
      status: 'success',
      message: 'Class updated successfully.',
      class: {
        id: targetClass.id,
        name: targetClass.name,
        visibility: targetClass.visibility,
        description: targetClass.description,
        main_image: targetClass.main_image,
        updated_at: targetClass.updated_at,
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error updating class:', error);
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Internal server error occurred.',
      error: (error as Error).message,
    });
  }
};

export const deleteClass = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = Number(req.params.classId);

    const targetClass = await Class.findOne({ where: { id } });

    if (!targetClass) {
      res.status(404).json({
        status: 'fail',
        code: 404,
        message: 'Class not found.',
      });
      return;
    }

    await targetClass.destroy();

    res.status(200).json({
      status: 'success',
      message: 'Class deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting class:', error);
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Internal server error occurred.',
      error: (error as Error).message,
    });
  }
};
