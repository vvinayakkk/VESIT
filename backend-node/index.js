require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const deliveryRoutes = require('./routes/deliveryRoutes');
const connectDB = require('./config/dbConn');
const verifyJWT = require('./middleware/verifyJwt');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

const port = process.env.PORT || 4000;

connectDB();

app.use(express.json());

app.use(cors({
    origin: "*",
    methods: ['GET', 'POST', 'PATCH' , 'PUT', 'DELETE'],
    credentials: true 
}));

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join-delivery-track', (deliveryId) => {
        socket.join(`delivery-${deliveryId}`);
        console.log(`Socket ${socket.id} joined delivery-${deliveryId}`);
    });

    socket.on('leave-delivery-track', (deliveryId) => {
        socket.leave(`delivery-${deliveryId}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Make io accessible to routes
app.set('io', io);

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/api/deliveries', deliveryRoutes);

app.use(verifyJWT);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

server.listen(port,'0.0.0.0',()=>console.log(`Server running on Port ${port}`));