const { seedUser } = require('../data.json')

const demoUserSeeder = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Users', [seedUser], {}),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Users', {}, {}),
}

module.exports = demoUserSeeder
