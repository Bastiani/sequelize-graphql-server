// @flow
import Sequelize from 'sequelize';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';

export default connection => {
  const User = connection.define(
    'User',
    {
      name: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
    },
    {
      tableName: 'users',
      hooks: {
        beforeCreate: (user, options): void => {
          const salt = genSaltSync();
          user.password = hashSync(user.password, salt);
        },
        beforeUpdate: (user, options): void => {
          if (user.changed('password')) {
            const salt = genSaltSync();
            user.password = hashSync(user.password, salt);
          }
        },
      },
    },
  );

  User.prototype.isPassword = (encodedPassword, password) => compareSync(password, encodedPassword);

  return User;
};
