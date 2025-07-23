'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('modifier_options', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
      },
      modifier_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'modifiers',
          key: 'modifier_id',
        },
        onDelete: 'CASCADE',
      },
      option_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('modifier_options');
  }
};
