// @flow
import { GraphQLObjectType, GraphQLNonNull, GraphQLInt } from 'graphql';
import { resolver, createNodeInterface } from 'graphql-sequelize';

import db from '../models';

import UserType, { UserConnectionType } from './types/UserType';

const { nodeField } = createNodeInterface(db.sequelize);

export default new GraphQLObjectType({
  name: 'Query',
  description: 'The root of all... queries',
  node: nodeField,
  fields: () => ({
    me: {
      type: UserType,
      description: 'Me is the logged user',
      args: {
        id: {
          type: GraphQLNonNull(GraphQLInt),
        },
      },
      resolve: resolver((obj, args, context) => context.db.User, {}),
    },
    users: {
      type: UserConnectionType.connectionType,
      args: UserConnectionType.connectionArgs,
      resolve: (source, args, context, info) => {
        const { user } = context;
        if (!user) throw new Error('Unauthorized user');

        return UserConnectionType.resolve(source, args, context, info);
      },
    },
  }),
});
