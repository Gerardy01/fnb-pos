'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('page_access_permissions', [
      {
        permission_name: 'Organization Settings Page',
        description: ''
      },
      {
        permission_name: 'Account Management Page',
        description: ''
      },
      {
        permission_name: 'Role Management Page',
        description: ''
      },
      {
        permission_name: 'POS Page',
        description: ''
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('page_access_permissions', null, {});
  }
};
