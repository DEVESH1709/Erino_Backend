const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const dotenv = require('dotenv');
dotenv.config();

const Lead  = require('../models/Lead');

const seedLeads = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });
       console.log("MongoDB connected for seeding"); 


        await Lead.deleteMany({});

        const sources = ['website','facebook_ads','google_ads','referral','events','other'];
        const statuses = ['new','contacted','qualified','lost','won'];
        const leads = [];

        for(let i=0;i<100;i++){
            const firstName = faker.person.firstName();
            const lastName = faker.person.lastName();
            const email = faker.internet.email({ firstName, lastName });
            const phone = faker.phone.number();
            const company = faker.company.name();
            const city = faker.location.city();
            const state = faker.location.state();
            const source = faker.helpers.arrayElement(sources);
            const status = faker.helpers.arrayElement(statuses);
            const score = faker.number.int({ min: 0, max: 100 });
            const lead_value = faker.number.int({ min: 1000, max: 10000 });
            const last_activity_at = faker.date.past({ years: 1 });
            const is_qualified = faker.datatype.boolean();

            leads.push({
                first_name: firstName,
                last_name: lastName,
                email,
                phone,
                company,
                city,
                state,
                source,
                status,
                score,
                lead_value,
                last_activity_at,
                is_qualified
            });
        }

        await Lead.insertMany(leads);
        console.log('seeded 100');
        process.exit(0);
            }
            catch(error){
                console.log('seeding error:',error);
                process.exit(1);
            }

};

seedLeads();