import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLEnumType } from 'graphql';
import { globalIdField } from 'graphql-relay';
import { sequelizeConnection } from 'graphql-sequelize';

import db from '../../models';
import { nodeInterface } from '../nodeInterface';

const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'User type definition',
  fields: () => ({
    id: globalIdField('User'),
    name: {
      type: GraphQLString,
      description: 'Name of the user',
    },
    password: {
      type: GraphQLString,
      description: 'Password of the user',
    },
    email: {
      type: GraphQLString,
      description: 'Email of the user',
    },
  }),
  interfaces: () => [nodeInterface],
});

export const UserConnectionType = sequelizeConnection({
  name: 'UserConnection',
  nodeType: UserType,
  target: db.User,
  connectionFields: {
    total: {
      type: GraphQLInt,
      resolve: ({ fullCount }) => fullCount || db.User.count(),
    },
  },
  edgeFields: {
    index: {
      type: GraphQLInt,
      resolve: edge => new Buffer(edge.cursor, 'base64')
        .toString('ascii')
        .split('$')
        .pop(),
    },
  },
  orderBy: new GraphQLEnumType({
    name: 'UserOrderBy',
    values: {
      ID: { value: ['id', 'ASC'] },
      XP: { value: ['xp', 'ASC'] },
    },
  }),
  where: (key, value, currentWhere) => {
    if (key === 'name') {
      return {
        name: { $like: `%${value}%` },
      };
    }

    return { [key]: value };
  },
});

export default UserType;
