import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET_KEY || 'defaultsecret';

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, birth_date, role } = req.body;

    if (!email || !password || !name || !birth_date) {
      res.status(400).json({
        status: 'fail',
        code: 400,
        message: '모든 필드를 입력해주세요.',
      });
      return;
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(409).json({
        status: 'fail',
        code: 400,
        message: '이미 존재하는 이메일입니다.',
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
      birth_date,
      role: role || 'user',
    });

    const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, {
      expiresIn: '1d',
    });

    res.setHeader('Authorization', `Bearer ${token}`);
    res.status(201).json({
      status: 'success',
      message: '회원가입 성공',
      user: { name: newUser.name, role: newUser.role },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      code: 500,
      message: '서버 내부 오류가 발생했습니다.',
      error: (error as Error).message,
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        status: 'fail',
        code: 400,
        message: '이메일과 비밀번호를 입력해주세요.',
      });
      return;
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(400).json({
        status: 'fail',
        code: 400,
        message: '해당 이메일의 사용자를 찾을 수 없습니다.',
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({
        status: 'fail',
        code: 400,
        message: '비밀번호가 일치하지 않습니다.',
      });
      return;
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: '1d',
    });

    res.setHeader('Authorization', `Bearer ${token}`);
    res.status(200).json({
      status: 'success',
      message: '로그인 성공',
      user: { name: user.name, role: user.role },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      code: 500,
      message: '서버 내부 오류가 발생했습니다.',
      error: (error as Error).message,
    });
  }
};
