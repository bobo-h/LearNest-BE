import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dayjs from 'dayjs';
import Invite from '../models/Invite';
import ClassMember from '../models/ClassMember';

const JWT_SECRET = process.env.JWT_SECRET_KEY || 'defaultsecret';
const BASE_URL = process.env.BASE_URL;

export const createInvite = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.user?.id) {
    res
      .status(401)
      .json({ status: 'fail', message: '사용자 인증이 필요합니다.' });
    return;
  }
  const class_id = Number(req.params.classId);
  const user_id = req.user?.id;

  try {
    const expires_at = new Date(dayjs().add(7, 'day').toISOString());
    const invite = await Invite.create({
      class_id,
      created_by: user_id,
      expires_at,
    });

    const token = jwt.sign(
      {
        invite_id: invite.id,
        expires_at,
      },
      JWT_SECRET,
      { expiresIn: '7d' },
    );

    const inviteLink = `${BASE_URL}/invite/${class_id}/accept/${token}`;

    res.status(201).json({
      status: 'success',
      inviteLink,
      expires_at,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: '초대 링크 생성 실패',
      error: (error as Error).message,
    });
  }
};

export const joinClass = async (req: Request, res: Response): Promise<void> => {
  if (!req.user?.id) {
    res
      .status(400)
      .json({ status: 'fail', message: '사용자 인증이 필요합니다.' });
    return;
  }
  const { classId, token } = req.params;
  const user_id = req.user?.id;

  if (!token) {
    res.status(400).json({
      status: 'fail',
      message: '토큰이 필요합니다.',
    });
    return;
  }

  try {
    const decoded = jwt.verify(token as string, JWT_SECRET) as {
      invite_id: number;
      expires_at: string;
    };

    const invite = await Invite.findByPk(decoded.invite_id);

    if (!invite) {
      res.status(400).json({
        status: 'fail',
        message: '유효하지 않은 초대 링크입니다.',
      });
      return;
    }

    const now = new Date();
    if (new Date(invite.expires_at) < now) {
      res.status(400).json({
        status: 'fail',
        message: '초대 링크가 만료되었습니다.',
      });
      return;
    }

    if (Number(classId) !== invite.class_id) {
      res.status(400).json({
        status: 'fail',
        message: '초대 링크가 잘못되었습니다.',
      });
      return;
    }

    const existingMember = await ClassMember.findOne({
      where: { class_id: Number(classId), user_id },
    });

    if (existingMember) {
      res.status(400).json({
        status: 'fail',
        message: '이미 클래스에 참여하고 있습니다.',
      });
      return;
    }

    await ClassMember.create({
      class_id: Number(classId),
      user_id,
      role: 'student',
    });

    res.status(200).json({
      status: 'success',
      message: '클래스에 성공적으로 참여했습니다.',
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(400).json({
        status: 'fail',
        message: '유효하지 않은 토큰입니다.',
      });
      return;
    }

    res.status(500).json({
      status: 'error',
      message: '클래스 참여 실패',
      error: (error as Error).message,
    });
  }
};
