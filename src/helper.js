// @flow
import jwt from 'jsonwebtoken';

import { jwtSecret } from './config';
import db from './models';

/**
 * Return user and seller given a JWT token
 * @param token - jwt token with userId
 * @returns {*}
 */
export const getUser = async (token: string) => {
  if (!token) {
    return { user: null };
  }

  try {
    const decodedToken = jwt.verify(token.replace('JWT', '').trim(), jwtSecret);
    const user = await db.User.findById(decodedToken.id);

    if (!user) {
      return { user: null };
    }

    return { user };
  } catch (err) {
    return { user: null };
  }
};

// $FlowFixMe
// export const getDataloaders = (loaders: Loaders): GraphQLDataloaders => Object.keys(loaders).reduce(
//   (prev, loaderKey: string) => ({
//     ...prev,
//     [loaderKey]: loaders[loaderKey].getLoader ? loaders[loaderKey].getLoader() : undefined,
//   }),
//   {},
// );

export function generateToken(user) {
  return `JWT ${jwt.sign({ id: user.id }, jwtSecret)}`;
}
