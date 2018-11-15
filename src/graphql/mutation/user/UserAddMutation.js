import { GraphQLBoolean, GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import db from '../../../models';

import { generateToken } from '../../../helper';
import UserType from '../../types/UserType';

const mutation = mutationWithClientMutationId({
  name: 'UserAdd',
  inputFields: {
    name: {
      type: GraphQLNonNull(GraphQLString),
    },
    password: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLNonNull(GraphQLString),
    },
    active: {
      type: GraphQLBoolean,
    },
  },
  mutateAndGetPayload: async args => {
    const { name, password, email, active } = args;

    let newUser;
    await db.sequelize.transaction(async t => {
      newUser = await db.User.create({ name, password, email, active }, { transaction: t });
    });

    const token = generateToken(newUser);

    return {
      id: newUser.id,
      token,
      error: null,
    };
  },
  outputFields: {
    user: {
      type: UserType,
      resolve: async ({ id }, args, context) => {
        const newUser = await context.db.User.findById(id);

        if (!newUser) {
          return null;
        }

        return newUser;
      },
    },
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

export default mutation;
