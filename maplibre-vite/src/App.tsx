import React from 'react';
import Map from './components/Map';
import 'maplibre-gl/dist/maplibre-gl.css';
import './App.css';

const App: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Map />
    </div>
  );
};

export default App;