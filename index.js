const express = require('express')
const app = express()
const port = 3200
require('./db')
const cors = require('cors');
app.use(cors());
app.use(express.json());
require('dotenv').config()

app.use('/api/auth',require('./routes/auth'))

app.use('/api/tenants',require('./routes/tenants'))

app.use('/api/notes',require('./routes/notes'))

app.get('/health', (req, res) => res.json({ status: "ok" }));


app.listen(port,()=>{
  console.log(`server is listening at port ${port}`);
});