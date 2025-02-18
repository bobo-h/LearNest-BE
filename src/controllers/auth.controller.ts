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
        message: 'Please fill in all fields.',
      });
      return;
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(409).json({
        status: 'fail',
        code: 400,
        message: 'This email already exists.',
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
      message: 'Signup successful.',
      user: { name: newUser.name },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Internal server error occurred.',
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
        message: 'Please enter your email and password.',
      });
      return;
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(400).json({
        status: 'fail',
        code: 400,
        message: 'No user found with the given email.',
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({
        status: 'fail',
        code: 400,
        message: 'Incorrect password.',
      });
      return;
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: '1d',
    });

    res.setHeader('Authorization', `Bearer ${token}`);
    res.status(200).json({
      status: 'success',
      message: 'Login successful.',
      user: { name: user.name },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Internal server error occurred.',
      error: (error as Error).message,
    });
  }
};
