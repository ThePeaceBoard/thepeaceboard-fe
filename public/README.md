# MapLibre Weather Map Examples

This directory contains several examples demonstrating the use of MapLibre GL with feature property transforms to display weather data on a world map.

## Examples

### 1. Original Example (`weather-original.html`)
An exact replica of the original example from the documentation, adapted to use our local MapLibre files.

### 2. Simple Weather Map (`weather-simple.html`)
Similar to the original example but with proper fallback handling to ensure it always works.

### 3. Basic Weather Map (`weather.html`)
A standard implementation that attempts to fetch temperature data from an external API and displays it on country labels.

### 4. Weather Map with Fallback (`weather-fallback.html`)
Similar to the basic map but generates random temperature data locally when the API can't be reached.

### 5. Advanced Weather Map (`weather-advanced.html`)
A more sophisticated implementation with:
- Color-coded countries based on temperature
- A temperature legend
- Multiple fallback mechanisms for ensuring data is always displayed
- Category-based styling

## How It Works

These examples use MapLibre's feature property transform capability, which allows for modifying vector tile data at runtime. The key files are:

- `weather-original.js`: The original transform script from the documentation
- `weather-simple.js`: Simple transform with basic fallback handling
- `weather-transform.js`: Basic transform that tries to fetch data from an API with a simple fallback
- `weather-transform-fallback.js`: Transform that generates random temperature data
- `weather-advanced-transform.js`: Advanced transform with multiple fallback mechanisms and additional styling properties

## Running the Examples

Open any of the HTML files in your browser after starting a local server:

```
python -m http.server 8000
```

Then navigate to:
- http://localhost:8000/weather-original.html
- http://localhost:8000/weather-simple.html
- http://localhost:8000/weather.html
- http://localhost:8000/weather-fallback.html
- http://localhost:8000/weather-advanced.html

## Notes

The examples assume that a MapLibre GL distribution is available at `./lib/maplibre-gl/dist/`. This has been confirmed to be working correctly.

The external API used in some examples likely won't work due to CORS restrictions, but the fallback mechanisms ensure the examples still function properly. 