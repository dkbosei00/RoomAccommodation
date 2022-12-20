'use strict';

const { uuid } = require('uuidv4');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Requests extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Requests.belongsTo(models.Accommodation, {
        foreignKey: "accommodation_id",
        as: "accommodation"
      }),
      Requests.belongsTo(models.Users, {
        foreignKey: "guest_id",
        as: "guest"
      })
    }
  }
  Requests.init({
    request_type: DataTypes.STRING,
    check_in: DataTypes.DATEONLY,
    check_out: DataTypes.DATEONLY,
    comments: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Requests',
    underscored: true,
    freezeTableName: true
  });

  Requests.beforeCreate(async (data, options) =>{
    data.id = uuid()
  })
  return Requests;
};