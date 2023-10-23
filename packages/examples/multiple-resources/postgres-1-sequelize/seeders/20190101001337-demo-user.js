const { seedUser } = require('../data.json'); // eslint-disable-line @typescript-eslint/no-var-requires

const demoUserSeeder = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Users', [seedUser], {}), // eslint-disable-line @typescript-eslint/no-unused-vars
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Users', {}, {}), // eslint-disable-line @typescript-eslint/no-unused-vars
};

module.exports = demoUserSeeder;
