'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("tables", {
      table_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
      },
      table_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      pax: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      table_group_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "table_groups",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      operational_status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: "1 = Available, 2 = Seated, 3 = Order Placed, 4 = Reserved",
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      effective_status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: "Derived from table_group or outlet status",
      },
      archived: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue:  Sequelize.fn('now'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue:  Sequelize.fn('now'),
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("tables");
  }
};
