'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('sales_type_outlet', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true,
      },
      sales_type_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'sales_types',
          key: 'sales_type_id',
        },
        onDelete: 'CASCADE',
      },
      outlet_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'outlets',
          key: 'outlet_id',
        },
        onDelete: 'CASCADE',
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('sales_type_outlet');
  }
};
