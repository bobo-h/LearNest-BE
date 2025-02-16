import { Request, Response, NextFunction } from 'express';

/**
 * 빈 문자열을 `null`로 변환하는 미들웨어
 */
export function normalizeEmptyValues(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  function normalize(obj: any) {
    if (!obj || typeof obj !== 'object') return obj;

    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        typeof value === 'string' && value.trim() === '' ? null : value,
      ]),
    );
  }

  req.body = normalize(req.body);
  req.query = normalize(req.query);
  req.params = normalize(req.params);

  next();
}
