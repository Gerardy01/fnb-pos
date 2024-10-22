'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [
      {
        role_name: 'Super Admin',
        is_default: true,
        organization_id : null
      },
      {
        role_name: 'Admin',
        is_default: true,
        organization_id : null
      },
    ]);
    await queryInterface.bulkInsert('role_permission', [
      {
        role_id: 1,
        permission_id: 1,
        read: true,
        write: true
      },
      {
        role_id: 1,
        permission_id: 2,
        read: true,
        write: true
      },
      {
        role_id: 1,
        permission_id: 3,
        read: true,
        write: true
      },
      {
        role_id: 1,
        permission_id: 4,
        read: true,
        write: true
      },
      {
        role_id: 2,
        permission_id: 2,
        read: true,
        write: true
      },
      {
        role_id: 2,
        permission_id: 3,
        read: true,
        write: true
      },
      {
        role_id: 2,
        permission_id: 4,
        read: true,
        write: true
      },
    ]);
    await queryInterface.bulkInsert('role_page_access_permission', [
      {
        role_id: 1,
        permission_id: 1
      },
      {
        role_id: 1,
        permission_id: 2
      },
      {
        role_id: 1,
        permission_id: 3
      },
      {
        role_id: 1,
        permission_id: 4
      },
      {
        role_id: 2,
        permission_id: 1
      },
      {
        role_id: 2,
        permission_id: 2
      },
      {
        role_id: 2,
        permission_id: 3
      },
      {
        role_id: 2,
        permission_id: 4
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', {
      is_default: true
    }, {});
    await queryInterface.bulkDelete('role_permission', null, {});
    await queryInterface.bulkDelete('role_page_access_permission', null, {});
  }
};
