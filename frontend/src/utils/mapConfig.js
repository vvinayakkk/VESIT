export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
export const MAP_STYLE = 'mapbox://styles/mapbox/streets-v11';

export const defaultMapSettings = {
    longitude: 72.8777, // Mumbai coordinates
    latitude: 19.0760,
    zoom: 12
};

export const createMarker = (coordinates, type = 'pickup') => ({
    type: 'Feature',
    geometry: {
        type: 'Point',
        coordinates: coordinates
    },
    properties: {
        type: type,
        icon: type === 'pickup' ? 'marker-15' : 'marker-delivery'
    }
});
