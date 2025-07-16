import createHttpError from 'http-errors';
import { Session } from '../db/models/session.js';
import { User } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  if (typeof authorization !== 'string') {
    return next(new createHttpError(401, 'Authorization header not found'));
  }

  const [bearer, accessToken] = authorization.split(' ', 2);
  if (bearer !== 'Bearer' || typeof accessToken !== 'string') {
    return next(new createHttpError(401, 'Access token not found'));
  }

  const session = await Session.findOne({ accessToken });
  if (session === null) {
    return next(new createHttpError(401, 'Session not found'));
  }

  if (session.accessTokenValidUntil < new Date()) {
    return next(new createHttpError(401, 'Access token is expired'));
  }

  const user = await User.findById(session.userId);
  if (user === null) {
    return next(new createHttpError(401, 'User not found'));
  }

  req.user = user;

  next();
};
