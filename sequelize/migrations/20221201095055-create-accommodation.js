'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Accommodation', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.STRING
      },
      feedback: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: []
      },
      has_wifi: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      no_of_rooms: {
        defaultValue: 1,
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      // Add hasWifi relation here
      price: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      rating: {
        type: Sequelize.INTEGER
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      host_id: {
        type: Sequelize.STRING,
        references: {
          model: "Users",
          key: "id"
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Accommodation');
  }
};