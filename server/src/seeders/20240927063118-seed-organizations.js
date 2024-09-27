'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('organizations', [
      {
        organization_id: '359ad25e-1a49-4439-a5dd-913557cb1fa0',
        organization_name: 'System',
        organization_logo: null,
        organization_no: 'system',
        archived: false,
        end_valid_datetime: new Date(new Date().setFullYear(new Date().getFullYear() + 100)), // 10 years from today
        created_at: new Date(),
        updated_at: new Date(),
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    queryInterface.bulkDelete('organizations', null, {});
  }
};
