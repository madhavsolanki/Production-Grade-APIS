// Standard API Response Format

export const sendsResponse = (statusCode, success, message, data = null) => {
  return {
    statusCode,
    success,
    message,
    data
  };
};