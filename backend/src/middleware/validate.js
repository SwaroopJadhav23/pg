import { AppError } from '../utils/AppError.js';

export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query
    });

    if (!result.success) {
      const message = result.error.issues.map((issue) => issue.message).join(', ');
      return next(new AppError(message || 'Validation failed', 422));
    }

    if (result.data.body !== undefined) {
      req.body = result.data.body;
    }
    if (result.data.params !== undefined) {
      Object.assign(req.params, result.data.params);
    }
    if (result.data.query !== undefined) {
      Object.assign(req.query, result.data.query);
    }
    next();
  };
}
