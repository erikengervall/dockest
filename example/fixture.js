const seedUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'demo@demo.com',
  createdAt: new Date('2019-01-01T13:37:00.000Z'),
  updatedAt: new Date('2019-01-02T13:37:00.000Z'),
}

const seedBanana = {
  size: 'medium',
  maturity: 'quite bueno',
  createdAt: new Date('2019-02-01T13:37:00.000Z'),
  updatedAt: new Date('2019-02-02T13:37:00.000Z'),
}

module.exports = {
  seedUser,
  seedBanana,
}
