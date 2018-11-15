/* eslint-disable no-console */
// @flow
import * as path from 'path';

import Sequelize from 'sequelize';

const env = process.env.NODE_ENV || 'development';
const config = require(path.resolve(`${__dirname}/databaseConfig.json`))[env];

export function createSequelize() {
  return new Sequelize(config.database, config.username, config.password, {
    operatorsAliases: {
      $in: Sequelize.Op.in,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    ...config,
  });
}
