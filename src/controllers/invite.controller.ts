import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dayjs from 'dayjs';
import Invite from '../models/Invite';
import ClassMember from '../models/ClassMember';

const JWT_SECRET = process.env.JWT_SECRET_KEY || 'defaultsecret';
const FRONT_URL = process.env.FRONT_DEPLOY_URL;

export const createInvite = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.user?.id) {
    res
      .status(401)
      .json({ status: 'fail', message: 'User authentication is required.' });
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

    const inviteLink = `${FRONT_URL}/invite/${class_id}/accept/${token}`;

    res.status(201).json({
      status: 'success',
      inviteLink,
      expires_at,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error occurred.',
      error: (error as Error).message,
    });
  }
};

export const joinClass = async (req: Request, res: Response): Promise<void> => {
  if (!req.user?.id) {
    res
      .status(400)
      .json({ status: 'fail', message: 'User authentication is required.' });
    return;
  }
  const { classId, token } = req.params;
  const user_id = req.user?.id;

  if (!token) {
    res.status(400).json({
      status: 'fail',
      message: 'Token is required.',
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
        message: 'Invalid invitation link.',
      });
      return;
    }

    const now = new Date();
    if (new Date(invite.expires_at) < now) {
      res.status(400).json({
        status: 'fail',
        message: 'The invitation link has expired.',
      });
      return;
    }

    if (Number(classId) !== invite.class_id) {
      res.status(400).json({
        status: 'fail',
        message: 'The invitation link is invalid.',
      });
      return;
    }

    const existingMember = await ClassMember.findOne({
      where: { class_id: Number(classId), user_id },
    });

    if (existingMember) {
      res.status(400).json({
        status: 'fail',
        message: 'You are already a member of this class.',
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
      message: 'Successfully joined the class.',
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(400).json({
        status: 'fail',
        message: 'Invalid token.',
      });
      return;
    }

    res.status(500).json({
      status: 'error',
      message: 'Internal server error occurred.',
      error: (error as Error).message,
    });
  }
};
