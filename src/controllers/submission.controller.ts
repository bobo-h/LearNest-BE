import { Request, Response } from 'express';
import Submission from '../models/Submission';

export const createSubmission = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { assignmentId } = req.params;
    const { content, attachment } = req.body;

    if (!userId || !assignmentId || !content) {
      res
        .status(400)
        .json({ status: 'fail', message: 'Missing required fields.' });
      return;
    }

    const submission = await Submission.create({
      assignment_id: Number(assignmentId),
      user_id: userId,
      content,
      attachment: attachment || null,
      status: 'IN_PROGRESS',
    });

    res.status(201).json({ status: 'success', data: submission });
  } catch (error) {
    console.error('Error creating submission:', error);
    res
      .status(500)
      .json({ status: 'error', message: 'An internal server error occurred.' });
  }
};

export const updateSubmission = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { content, attachment } = req.body;

    const submission = await Submission.findByPk(id);
    if (!submission) {
      res
        .status(404)
        .json({ status: 'fail', message: 'Submission not found.' });
      return;
    }

    if (submission.user_id !== userId) {
      res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to modify this submission.',
      });
      return;
    }

    await submission.update({
      content: content || submission.content,
      attachment: attachment !== undefined ? attachment : submission.attachment,
      status: 'IN_PROGRESS',
    });

    res.status(200).json({ status: 'success', data: submission });
  } catch (error) {
    console.error('Error updating submission:', error);
    res
      .status(500)
      .json({ status: 'error', message: 'An internal server error occurred.' });
  }
};

export const deleteSubmission = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const submission = await Submission.findByPk(id);
    if (!submission) {
      res
        .status(404)
        .json({ status: 'fail', message: 'Submission not found.' });
      return;
    }

    if (submission.user_id !== userId) {
      res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to delete this submission.',
      });
      return;
    }

    await submission.destroy();

    res.status(200).json({
      status: 'success',
      message: 'Submission has been deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting submission:', error);
    res
      .status(500)
      .json({ status: 'error', message: 'An internal server error occurred.' });
  }
};

export const provideFeedback = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { feedback, status } = req.body;

    if (!status) {
      res.status(400).json({ status: 'fail', message: 'Status is required.' });
      return;
    }

    const submission = await Submission.findByPk(id);
    if (!submission) {
      res
        .status(404)
        .json({ status: 'fail', message: 'Submission not found.' });
      return;
    }

    await submission.update({
      feedback: feedback !== undefined ? feedback : null,
      status,
      reviewed_at: new Date(),
    });

    res.status(200).json({ status: 'success', data: submission });
  } catch (error) {
    console.error('Error providing feedback:', error);
    res
      .status(500)
      .json({ status: 'error', message: 'An internal server error occurred.' });
  }
};

export const getSubmission = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id: userId } = req.user!;
    const { assignmentId } = req.params;

    const submission = await Submission.findOne({
      where: {
        assignment_id: assignmentId,
        user_id: userId,
      },
    });

    if (!submission) {
      res
        .status(404)
        .json({ status: 'fail', message: 'Submission not found.' });
      return;
    }

    res.status(200).json({ status: 'success', data: submission });
  } catch (error) {
    console.error('Error fetching submission:', error);
    res
      .status(500)
      .json({ status: 'error', message: 'An internal server error occurred.' });
  }
};
