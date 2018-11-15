import { GraphQLString, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { generateToken } from '../../../helper';
import db from '../../../models';

export default mutationWithClientMutationId({
  name: 'UserLogin',
  inputFields: {
    email: {
      type: GraphQLNonNull(GraphQLString),
    },
    password: {
      type: GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async ({ email, password }) => {
    if (!email || !password) {
      return {
        token: null,
        error: 'Email ou senha inválidos',
      };
    }

    const user = await db.User.findOne({ where: { email: email.toLowerCase() } });

    if (!user) {
      return {
        token: null,
        error: 'Email ou senha inválidos',
      };
    }

    if (!user.password) {
      return {
        token: null,
        error: 'Email ou senha inválidos',
      };
    }

    let correctPassword = null;
    try {
      correctPassword = await user.isPassword(user.get('password'), password);
    } catch (err) {
      return {
        token: null,
        error: 'Email ou senha inválidos',
      };
    }

    if (!correctPassword) {
      return {
        token: null,
        error: 'Email ou senha inválidos',
      };
    }

    const token = generateToken(user);

    return {
      token,
      error: null,
    };
  },
  outputFields: {
    token: {
      type: GraphQLString,
      resolve: ({ token }) => token,
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
