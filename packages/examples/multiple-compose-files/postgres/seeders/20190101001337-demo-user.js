const seedUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'demo@demo.com',
};

const demoUserSeeder = {
  up: (queryInterface) => queryInterface.bulkInsert('Users', [seedUser], {}),
  down: (queryInterface) => queryInterface.bulkDelete('Users', {}, {}),
};

module.exports = demoUserSeeder;
