'use strict';

const { uuid } = require('uuidv4');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      Users.hasMany(models.Accommodation, {
        foreignKey: "host_id",
        as: "accommodation"
      })
      // Users.hasMany(models.Requests, {
      //   foreignKey: "request_id",
      //   as: "requests"
      // })
    }
  }
  Users.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    email: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    phone_number: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Users',
    underscored: true,
    freezeTableName: true
  });

  Users.beforeCreate(async (data, options) =>{
    data.id = uuid()
  })
  return Users;
};