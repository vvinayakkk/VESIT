const WebSocket = require('ws');
const Delivery = require('../models/delivery');

const setupDeliveryWebSocket = (server) => {
    const wss = new WebSocket.Server({ server });
    
    const clients = new Map(); // Store connected clients

    wss.on('connection', (ws, req) => {
        const deliveryId = req.url.split('/').pop();
        clients.set(deliveryId, ws);

        ws.on('close', () => {
            clients.delete(deliveryId);
        });
    });

    // Function to broadcast location updates
    const broadcastLocationUpdate = (deliveryId, location) => {
        const client = clients.get(deliveryId);
        if (client && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ 
                type: 'location_update',
                data: location 
            }));
        }
    };

    return { broadcastLocationUpdate };
};

module.exports = setupDeliveryWebSocket;
