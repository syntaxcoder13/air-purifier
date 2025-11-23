# Smart Air Purifier - React Version

This is a React.js conversion of the Smart Air Purifier dashboard application.

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Application

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in the terminal).

## Building for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Features

- User authentication (Login/Sign Up)
- Real-time air quality monitoring
- Device control (turn purifier on/off)
- Air quality charts with multiple time ranges
- Dark/Light theme toggle
- Notifications system
- Responsive design

## Project Structure

```
src/
  components/
    AuthScreen.jsx    - Login/Sign Up component
    Dashboard.jsx     - Main dashboard component
    Header.jsx        - Header with user info and controls
    AQICard.jsx       - Air Quality Index display card
    DeviceControl.jsx - Device power control
    ChartSection.jsx  - Chart with range picker
  utils/
    helpers.js        - Helper functions
    storage.js        - localStorage utilities
    chartData.js      - Chart data generation
  App.jsx            - Main app component
  main.jsx           - React entry point
  index.css          - CSS imports
```

## Technologies Used

- React 18
- Vite
- Chart.js with react-chartjs-2
- Tailwind CSS (via CDN)
- LocalStorage for persistence

