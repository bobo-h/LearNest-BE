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

    const assignments = await Assignment.findAll({
      include: [
        {
          model: Submission,
          as: 'submissions',
          where: { user_id: userId },
          required: false, // 과제 제출이 없는 경우에도 과제 정보는 유지
          attributes: [
            'id',
            'content',
            'attachment',
            'status',
            'feedback',
            'reviewed_at',
          ],
        },
        {
          model: Subunit,
          as: 'subunit',
          attributes: [],
          include: [
            {
              model: Unit,
              as: 'unit',
              attributes: [],
              where: { class_id: classId },
            },
          ],
        },
      ],
      attributes: ['id', 'subunit_id'],
    });

    res.status(200).json({
      status: 'success',
      message: 'Assignments and submissions retrieved successfully.',
      data: assignments,
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

// export const getMembersProgress = async (req: Request, res: Response) => {
//   try {
//     const { classId } = req.params;

//     const members = await ClassMember.findAll({
//       where: { class_id: classId },
//       include: [{ model: User, attributes: ['id', 'name', 'role'] }],
//     });

//     if (!members.length) {
//       return res.status(404).json({ status: 'fail', message: 'No members found.' });
//     }

//     const progressData = await Promise.all(
//       members.map(async (member) => {
//         const avgProgress = await Progress.findOne({
//           where: { user_id: member.user_id, class_id: classId },
//           attributes: [[Progress.sequelize.fn('AVG', Progress.sequelize.col('progress_percent')), 'average_progress']],
//           raw: true,
//         });

//         return {
//           user_id: member.user_id,
//           name: member.User.name,
//           role: member.User.role,
//           average_progress: avgProgress?.average_progress || 0,
//         };
//       })
//     );

//     res.json(progressData);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ status: 'error', message: 'Server error occurred.' });
//   }
// };
