const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
)

mongoose.connect(process.env.LOCAL)
// mongoose.connect(DB)
.then(() => console.log('connect success'))
.catch((err) => console.log(err.reason))