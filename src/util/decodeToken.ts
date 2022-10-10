import jwt from 'jsonwebtoken';

export const decodeToken = async (token: string) => {
  return jwt.decode(token);
};
