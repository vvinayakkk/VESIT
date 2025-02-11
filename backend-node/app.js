const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

const http = require('http');
const setupDeliveryWebSocket = require('./websocket/deliveryTracker');
const deliveryRoutes = require('./routes/deliveryRoutes');

// Create HTTP server
const server = http.createServer(app);

// Setup WebSocket
const { broadcastLocationUpdate } = setupDeliveryWebSocket(server);
app.locals.broadcastLocationUpdate = broadcastLocationUpdate;

// Routes
app.use('/api/deliveries', deliveryRoutes);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Use server.listen instead of app.listen
server.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
});
