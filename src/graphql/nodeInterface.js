import { createNodeInterface } from 'graphql-sequelize';

import { createSequelize } from '../database';
import db from '../models';

export const { nodeInterface, nodeTypeMapper, nodeField } = createNodeInterface(createSequelize);

nodeTypeMapper.mapTypes({
  [db.User.name]: 'User',
  // [db.Category.name]: 'Category',
  // [db.Product.name]: 'Product',
});
