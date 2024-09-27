'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('permissions', [
      {
        permission_name: 'Super Permission',
        description: '',
      },
      {
        permission_name: 'Organization Management',
        description: '',
      },
      {
        permission_name: 'Account Management',
        description: '',
      },
      {
        permission_name: 'Role Management',
        description: '',
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('permissions', null, {});
  }
};
