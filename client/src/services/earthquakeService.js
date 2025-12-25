const API_BASE_URL = '/api';

export const getEarthquakes = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/earthquakes`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data.earthquakes || [];
    } catch (error) {
        console.error('Error fetching earthquakes:', error);
        return [];
    }
};
