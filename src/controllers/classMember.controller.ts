import { Request, Response } from 'express';
import {
  Assignment,
  Subunit,
  Unit,
  User,
  ClassMember,
  Submission,
} from '../models';
import { Op } from 'sequelize';

export const removeMember = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { classId, memberId } = req.params;

    const member = await ClassMember.findOne({
      where: { user_id: memberId, class_id: classId },
    });

    if (!member) {
      res.status(404).json({
        status: 'fail',
        message: 'The member is not found in this class.',
      });
      return;
    }

    await member.destroy();

    res.status(200).json({
      status: 'success',
      message: 'The member has been removed from the class.',
    });
  } catch (error) {
    console.error('Error removing member:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error occurred.',
      error: (error as Error).message,
    });
  }
};

export const getClassMembers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { classId } = req.params;

    const members = await ClassMember.findAll({
      where: { class_id: classId, role: { [Op.ne]: 'instructor' } },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
      attributes: ['id', 'user_id', 'class_id', 'role', 'joined_at'],
      order: [['joined_at', 'ASC']],
    });

    res.status(200).json({
      status: 'success',
      message: members.length
        ? 'Class members retrieved successfully.'
        : 'No members found for this class.',
      members,
    });
  } catch (error) {
    console.error('Error fetching class members:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error occurred.',
      error: (error as Error).message,
    });
  }
};

export const getSubmissionsByMember = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { classId, userId } = req.params;

    const assignmentIds = await Assignment.findAll({
      include: [
        {
          model: Subunit,
          as: 'subunit',
          include: [
            {
              model: Unit,
              as: 'unit',
              where: { class_id: classId },
            },
          ],
        },
      ],
      attributes: ['id'],
    }).then((assignments) => assignments.map((a) => a.id));

    const submissions = await Submission.findAll({
      where: {
        user_id: userId,
        assignment_id: assignmentIds,
      },
      attributes: [
        'id',
        'assignment_id',
        'content',
        'attachment',
        'status',
        'feedback',
        'reviewed_at',
        'updated_at',
      ],
      order: [['updated_at', 'DESC']],
    });

    res.status(200).json({
      status: 'success',
      message: 'Submissions retrieved successfully.',
      submissions,
    });
  } catch (error) {
    console.error('Error fetching student submissions:', error);
    res.status(500).json({
      status: 'error',
      message: 'An internal server error occurred.',
      error: (error as Error).message,
    });
  }
};
