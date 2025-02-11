export const simulateDeliveryRoute = (start, end, steps = 50) => {
    const route = [];
    const latDiff = (end[1] - start[1]) / steps;
    const lngDiff = (end[0] - start[0]) / steps;
    
    for (let i = 0; i <= steps; i++) {
        // Add some randomness to make movement more realistic
        const jitter = 0.0001 * (Math.random() - 0.5);
        route.push([
            start[0] + (lngDiff * i) + jitter,
            start[1] + (latDiff * i) + jitter
        ]);
    }
    
    return route;
};
