# Hospital Resource Dashboard
## Backend

The dashboard connects to a Node.js backend. To run it:

```bash
cd backend
npm install
npm start
```

Backend runs at `http://localhost:4000`. Default login: **HOSP001** / **hospital123**


An interactive dashboard for displaying hospital resource availability, including beds, ICU capacity, oxygen, ambulance status, distance, road conditions, and weather.

## Features

- **Hospital Bed Availability** — Available vs total beds with occupancy bar
- **ICU Capacity** — ICU beds and ventilators with visual progress
- **Oxygen Availability** — Cylinder count and central supply status with interactive slider
- **Ambulance Status** — Available, en route, and total fleet
- **Distance to Hospital** — Placeholder for Google Maps API with distance & travel time
- **Road Conditions** — Clear / Moderate / Congested indicators
- **Current Weather** — Temperature, conditions, humidity, wind, visibility

## Quick Start

1. Open `index.html` in a browser or serve the folder locally:
   ```bash
   npx serve .
   ```
2. The dashboard loads with mock data by default.

## API Integration

Replace mock data in `config.js` with real API calls. The `API` object provides stub methods:

| Method | Returns | Use Case |
|--------|---------|----------|
| `getBeds()` | `{ available, total }` | Hospital bed counts |
| `getIcu()` | `{ bedsAvailable, bedsTotal, ventilatorsAvailable }` | ICU metrics |
| `getOxygen()` | `{ cylindersAvailable, centralSupplyStatus }` | Oxygen supply |
| `getAmbulance()` | `{ available, enRoute, total }` | Ambulance fleet |
| `getDistance()` | `{ km, miles, travelTimeMinutes }` | Distance & ETA |
| `getRoadConditions()` | `{ status, description }` | Traffic (flowing/moderate/congested) |
| `getWeather()` | `{ temp, description, humidity, windSpeed, visibility }` | Weather data |

### Google Maps API

1. Get an API key from [Google Cloud Console](https://console.cloud.google.com/).
2. Enable Maps JavaScript API and Directions API.
3. Add your key and coordinates in `config.js`:
   ```javascript
   apis: {
     googleMaps: {
       key: 'YOUR_API_KEY',
       hospitalCoords: { lat: 28.6139, lng: 77.209 },
       userCoords: { lat: 28.7041, lng: 77.1025 },
     },
   }
   ```
4. Add this script before `app.js` in `index.html`:
   ```html
   <script async src="https://maps.googleapis.com/maps/api/js?key=YOUR_KEY&libraries=places"></script>
   ```
5. Replace the map placeholder div with a `<div id="map">` and initialize the map in `app.js`.

### Weather API (OpenWeatherMap)

1. Get an API key at [OpenWeatherMap](https://openweathermap.org/api).
2. Implement `API.getWeather()` with a fetch to their weather endpoint.
3. Map their response fields to the structure expected by `renderWeather()`.

## Configuration

- `CONFIG.refreshInterval` — Auto-refresh interval in ms (default: 30000).
- Adjust `MOCK_DATA` in `config.js` to test different scenarios.

## Browser Support

Works in modern browsers (Chrome, Firefox, Safari, Edge). Responsive for mobile, tablet, and desktop.

## License

MIT
