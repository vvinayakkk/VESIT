import React from 'react';

const DeliveryStatus = ({ delivery, currentLocation, routeInfo, remainingInfo }) => {
    const formatTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins} minutes`;
    };

    return (
        <div className="delivery-status">
            <h3>Delivery Status</h3>
            <div className="status-details">
                <p>Status: <span className={`status ${delivery?.status?.toLowerCase()}`}>
                    {delivery?.status}
                </span></p>
                
                {routeInfo && (
                    <div className="route-info">
                        <div className="progress-section">
                            <div className="progress-bar">
                                <div 
                                    className="progress-fill" 
                                    style={{ width: `${remainingInfo?.progress || 0}%` }}
                                />
                            </div>
                            <p className="progress-text">
                                {remainingInfo?.progress || 0}% Complete
                                {remainingInfo?.lastUpdate && (
                                    <span className="update-time">
                                        Last updated: {new Date(remainingInfo.lastUpdate).toLocaleTimeString()}
                                    </span>
                                )}
                            </p>
                        </div>

                        <div className="info-grid">
                            <div className="info-item">
                                <h4>Total Distance</h4>
                                <p>{remainingInfo?.total?.distance || routeInfo.distance} km</p>
                            </div>
                            <div className="info-item">
                                <h4>Remaining</h4>
                                <p>{remainingInfo?.distance || routeInfo.distance} km</p>
                            </div>
                            <div className="info-item">
                                <h4>Total Time</h4>
                                <p>{formatTime(remainingInfo?.total?.duration || routeInfo.duration)}</p>
                            </div>
                            <div className="info-item">
                                <h4>Time Left</h4>
                                <p>{formatTime(remainingInfo?.time || routeInfo.duration)}</p>
                            </div>
                        </div>

                        <div className="location-details">
                            <div className="location-item">
                                <span className="location-icon pickup">P</span>
                                <p>{delivery?.pickup_location?.address}</p>
                            </div>
                            <div className="location-item">
                                <span className="location-icon delivery">D</span>
                                <p>{delivery?.delivery_location?.address}</p>
                            </div>
                        </div>

                        {currentLocation && (
                            <div className="current-location">
                                <p className="update-time">
                                    Last Updated: {new Date(currentLocation.timestamp).toLocaleTimeString()}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeliveryStatus;
