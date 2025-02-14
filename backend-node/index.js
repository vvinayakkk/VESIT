require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./config/dbConn')
const verifyJWT = require('./middleware/verifyJwt');


const port = process.env.PORT || 4000;

connectDB();

app.use(express.json());

app.use(cors({
    origin: "*",
    methods: ['GET', 'POST', 'PATCH' , 'PUT', 'DELETE'],
    credentials: true 
}));

app.use('/auth', require('./routes/authRoutes'));

app.use(verifyJWT);

app.use('/user', require('./routes/userRoutes'));
app.use('/delivery' , require('./routes/deliveryRoutes'));
app.use('/recipient' , require('./routes/recipientRoutes'));

app.listen(port,()=>console.log(`Server running on Port ${port}`));