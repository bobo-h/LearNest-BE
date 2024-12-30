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
        message: '클래스 생성 권한이 없습니다.',
      });
      return;
    }

    if (!name) {
      res.status(400).json({
        status: 'fail',
        code: 400,
        message: 'Class Name은 필수 입력 값입니다.',
      });
      return;
    }

    const existingClass = await Class.findOne({ where: { name }, transaction });
    if (existingClass) {
      res.status(409).json({
        status: 'fail',
        code: 409,
        message: '중복된 클래스 이름입니다.',
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
      message: '클래스 생성 성공',
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
      message: '서버 내부 오류가 발생했습니다.',
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
        message: '사용자 인증이 필요합니다.',
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
      message: '클래스 조회 중 오류가 발생했습니다.',
      error: (error as Error).message,
    });
  }
};
