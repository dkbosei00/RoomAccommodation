'use strict';

const { uuid } = require('uuidv4');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Accommodation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Accommodation.belongsTo(models.Users, {
        foreignKey: "host_id",
        as: "host"
      })
    }
  }
  Accommodation.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    location: DataTypes.STRING,
    feedback: DataTypes.ARRAY(DataTypes.STRING),
    no_of_rooms: DataTypes.INTEGER,
    has_wifi: DataTypes.BOOLEAN,
    price: DataTypes.FLOAT,
    rating: DataTypes.INTEGER,
    image_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Accommodation',
    underscored: true,
    freezeTableName: true
  });

  Accommodation.beforeCreate(async (data, options) =>{
    data.id = uuid()
  })

  return Accommodation;
};