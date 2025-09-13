const mongoose = require('mongoose')

require('dotenv').config();

mongoose.connect(process.env.DATABASE_URL)
.then(()=>console.log('mongodb is connected'))
.catch(()=>console.log('mongodb is not connected'))