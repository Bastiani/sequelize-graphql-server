import * as fs from 'fs';
import * as path from 'path';

import { createSequelize } from '../database';

const basename = path.basename(module.filename);

const db = {};

if (Object.keys(db).length === 0) {
  const sequelize = createSequelize();
  fs.readdirSync(__dirname)
    .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
    .forEach(file => {
      const model = sequelize.import(path.join(__dirname, file));
      db[model.name] = model;
    });

  const associate = Object.keys(db);
  associate.forEach(modelName => {
    if (db[modelName].associate) db[modelName].associate(db);
  });

  db.sequelize = sequelize;
}

export default db;
