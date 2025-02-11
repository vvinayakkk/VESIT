import React, { useEffect, useState } from 'react';
import ReactMapGL, { Marker, Source, Layer } from 'react-map-gl';
import { io } from 'socket.io-client';
import { MAPBOX_TOKEN, MAP_STYLE, defaultMapSettings, createMarker } from '../utils/mapConfig';

const DeliveryTracker = ({ deliveryId }) => {
    const [viewport, setViewport] = useState(defaultMapSettings);
    const [deliveryData, setDeliveryData] = useState(null);

    useEffect(() => {
        const socket = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000');

        // Function to fetch initial delivery data
        const fetchDeliveryData = async () => {
            try {
                const response = await fetch(`/api/deliveries/${deliveryId}`);
                const data = await response.json();
                setDeliveryData(data);
                
                // Center map on delivery route
                if (data.pickup_location.coordinates) {
                    setViewport(prev => ({
                        ...prev,
                        longitude: data.pickup_location.coordinates[0],
                        latitude: data.pickup_location.coordinates[1]
                    }));
                }
            } catch (error) {
                console.error('Error fetching delivery:', error);
            }
        };

        fetchDeliveryData();

        // Socket.IO setup
        socket.emit('join-delivery-track', deliveryId);

        socket.on('location-update', (data) => {
            if (data.deliveryId === deliveryId) {
                setDeliveryData(prev => ({
                    ...prev,
                    current_location: data.location
                }));
            }
        });

        return () => {
            socket.emit('leave-delivery-track', deliveryId);
            socket.disconnect();
        };
    }, [deliveryId]);

    return (
        <div style={{ height: '500px', width: '100%' }}>
            <ReactMapGL
                {...viewport}
                width="100%"
                height="100%"
                mapStyle={MAP_STYLE}
                mapboxApiAccessToken={MAPBOX_TOKEN}
                onViewportChange={setViewport}
            >
                {deliveryData && (
                    <>
                        {/* Pickup Location Marker */}
                        <Marker 
                            longitude={deliveryData.pickup_location.coordinates[0]}
                            latitude={deliveryData.pickup_location.coordinates[1]}
                        >
                            <div className="marker pickup">P</div>
                        </Marker>

                        {/* Delivery Location Marker */}
                        <Marker 
                            longitude={deliveryData.delivery_location.coordinates[0]}
                            latitude={deliveryData.delivery_location.coordinates[1]}
                        >
                            <div className="marker delivery">D</div>
                        </Marker>

                        {/* Current Location Marker */}
                        {deliveryData.current_location && (
                            <Marker 
                                longitude={deliveryData.current_location.coordinates[0]}
                                latitude={deliveryData.current_location.coordinates[1]}
                            >
                                <div className="marker current">🚚</div>
                            </Marker>
                        )}
                    </>
                )}
            </ReactMapGL>
        </div>
    );
};

export default DeliveryTracker;
