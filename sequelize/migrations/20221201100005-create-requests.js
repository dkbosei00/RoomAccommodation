'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Requests', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      request_type: {
        type: Sequelize.STRING
      },
      check_in: {
        type: Sequelize.DATEONLY
      },
      check_out: {
        type: Sequelize.DATEONLY
      },
      comments: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: "Pending"
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      accommodation_id: {
        type: Sequelize.STRING,
        references: {
          model: "Accommodation",
          key: "id"
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Requests');
  }
};