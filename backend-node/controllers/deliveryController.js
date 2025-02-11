const Delivery = require('../models/delivery');

const deliveryController = {
    getDeliveryDetails: async (req, res) => {
        try {
            const delivery = await Delivery.findById(req.params.id);
            if (!delivery) {
                return res.status(404).json({ message: 'Delivery not found' });
            }
            res.json(delivery);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateLocation: async (req, res) => {
        try {
            const { coordinates } = req.body;
            const delivery = await Delivery.findById(req.params.id);
            
            if (!delivery) {
                return res.status(404).json({ message: 'Delivery not found' });
            }

            delivery.current_location = {
                coordinates,
                timestamp: new Date()
            };

            await delivery.save();

            // Emit location update via Socket.IO
            const io = req.app.get('io');
            io.to(`delivery-${req.params.id}`).emit('location-update', {
                deliveryId: req.params.id,
                location: delivery.current_location
            });

            res.json({ message: 'Location updated successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateDeliveryStatus: async (req, res) => {
        try {
            const { status } = req.body;
            const delivery = await Delivery.findByIdAndUpdate(
                req.params.id,
                { status },
                { new: true }
            );

            if (!delivery) {
                return res.status(404).json({ message: 'Delivery not found' });
            }

            res.json(delivery);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = deliveryController;
