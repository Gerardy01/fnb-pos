'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('sales_type_gratuity', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
      },
      gratuity_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'gratuities',
          key: 'gratuity_id',
        },
        onDelete: 'CASCADE',
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
        allowNull: true,
        references: {
          model: 'outlets',
          key: 'outlet_id',
        },
        onDelete: 'CASCADE',
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('sales_type_gratuity');
  }
};
