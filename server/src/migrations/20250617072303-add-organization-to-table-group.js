'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('table_groups', 'organization_id', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'organizations',
        key: 'organization_id',
      },
      onDelete: 'CASCADE',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('table_groups', 'organization_id');
  }
};
