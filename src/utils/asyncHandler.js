//Wrapper for async route handlers to avoid try/catch everywhere

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};