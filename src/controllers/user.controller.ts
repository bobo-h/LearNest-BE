import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';

export const createUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email, password, name, birth_date, role } = req.body;
    if (!email || !password || !name || !birth_date) {
      res.status(400).json({ message: '모든 필드를 입력해주세요.' });
    }
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(409).json({ message: '이미 존재하는 이메일입니다.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
      birth_date,
      role: role || 'user',
    });
    res.status(201).json({ message: '회원가입 성공', userId: newUser.id });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
