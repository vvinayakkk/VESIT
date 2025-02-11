export const getDirections = async (start, end) => {
    const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&overview=full&access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`
    );
    const data = await response.json();
    
    if (!data.routes || !data.routes.length) {
        throw new Error('No route found');
    }

    const route = data.routes[0];
    return {
        route: route.geometry.coordinates,
        distance: (route.distance / 1000).toFixed(2), // Convert to km
        duration: Math.round(route.duration / 60), // Convert to minutes
        steps: route.legs[0].steps // Include navigation steps
    };
};

export const calculateProgress = (currentPosition, routeCoordinates) => {
    // Find the closest point on the route to current position
    let minDistance = Infinity;
    let progressIndex = 0;

    routeCoordinates.forEach((coord, index) => {
        const d = Math.sqrt(
            Math.pow(coord[0] - currentPosition[0], 2) + 
            Math.pow(coord[1] - currentPosition[1], 2)
        );
        if (d < minDistance) {
            minDistance = d;
            progressIndex = index;
        }
    });

    return progressIndex / routeCoordinates.length;
};
