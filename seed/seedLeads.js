const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');
const dotenv = require('dotenv');
const User = require('../models/User');
const Lead = require('../models/Lead');
const connectDB = require('../config/db');

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Lead.deleteMany();

    const hashedPassword = await bcrypt.hash('Test@1234', 10);
    const testUser = await User.create({
      email: 'testuser@example.com',
      password: hashedPassword,
    });

    console.log('Test User Created:', testUser.email);

    const leads = [];
    const sources = ['website', 'facebook_ads', 'google_ads', 'referral', 'events', 'other'];
    const statuses = ['new', 'contacted', 'qualified', 'lost', 'won'];

    for (let i = 0; i < 120; i++) {
      leads.push({
        user: testUser._id,
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        company: faker.company.name(),
        city: faker.location.city(),
        state: faker.location.state(),
        source: faker.helpers.arrayElement(sources),
        status: faker.helpers.arrayElement(statuses),
        score: faker.number.int({ min: 0, max: 100 }),
        lead_value: faker.number.int({ min: 1000, max: 100000 }),
        last_activity_at: faker.datatype.boolean() ? faker.date.recent({ days: 30 }) : null,
        is_qualified: faker.datatype.boolean(),
      });
    }

    await Lead.insertMany(leads);
    console.log('120 Leads Seeded for test user');

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();
