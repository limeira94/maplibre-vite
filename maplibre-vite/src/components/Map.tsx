import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

const MAPTILER_KEY = 'get_your_own_OpIi9ZULNHzrESv6T2vL';

const Map: React.FC = () => {
    const mapRef = useRef<maplibregl.Map | null>(null);

    useEffect(() => {
        const map = new maplibregl.Map({
            container: 'map', // container id
            style: `https://api.maptiler.com/maps/basic-v2/style.json?key=${MAPTILER_KEY}`,
            center: [-74.0066, 40.7135], // starting position [lng, lat]
            zoom: 15.5, // starting zoom
            pitch: 45,
            bearing: -17.6,
            antialias: true
        });

        map.addControl(new maplibregl.NavigationControl(), 'top-right');
        map.addControl(new maplibregl.ScaleControl(), 'bottom-right');
        map.addControl(new maplibregl.LogoControl({ compact: false }));

        const geocoder = new MapboxGeocoder({
            accessToken: 'pk.eyJ1IjoibGltZWlyYWZlbGlwZSIsImEiOiJjbHplbnMyZW4weHk0MmpvZXFkZGplc2RyIn0.qL2A7ZuWiBiV0jjPCnVRAg', // Substitua pelo seu token de acesso Mapbox
            mapboxgl: maplibregl,
            placeholder: 'Search for places',
        });

        // Adiciona o geocoder em um elemento específico fora do mapa
        document.getElementById('geocoder').appendChild(geocoder.onAdd(map));
        

        map.on('load', () => {
            const layers = map.getStyle().layers;
            let labelLayerId;
            for (let i = 0; i < layers.length; i++) {
                if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
                    labelLayerId = layers[i].id;
                    break;
                }
            }

            map.addSource('openmaptiles', {
                url: `https://api.maptiler.com/tiles/v3/tiles.json?key=${MAPTILER_KEY}`,
                type: 'vector',
            });

            map.addLayer(
                {
                    'id': '3d-buildings',
                    'source': 'openmaptiles',
                    'source-layer': 'building',
                    'type': 'fill-extrusion',
                    'minzoom': 15,
                    'filter': ['!=', ['get', 'hide_3d'], true],
                    'paint': {
                        'fill-extrusion-color': [
                            'interpolate',
                            ['linear'],
                            ['get', 'render_height'], 0, 'lightgray', 200, 'royalblue', 400, 'lightblue'
                        ],
                        'fill-extrusion-height': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            15,
                            0,
                            16,
                            ['get', 'render_height']
                        ],
                        'fill-extrusion-base': ['case',
                            ['>=', ['get', 'zoom'], 16],
                            ['get', 'render_min_height'], 0
                        ]
                    }
                },
                labelLayerId
            );
        });

        mapRef.current = map;

        return () => map.remove();
    }, []);

    const changeStyle = () => {
        if (mapRef.current) {
            mapRef.current.setStyle({
                version: 8,
                sources: {
                    osm: {
                        type: 'raster',
                        tiles: [
                            'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
                        ],
                        tileSize: 256
                    }
                },
                layers: [
                    {
                        id: 'osm',
                        type: 'raster',
                        source: 'osm',
                        minzoom: 0,
                        maxzoom: 19
                    }
                ]
            });
        }
    };

    return (
        <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
            <div id="map" style={{ width: '100%', height: '100%' }}></div>
            <div id="geocoder" style={{ position: 'absolute', top: 10, left: 20, zIndex: 1 }}></div>
            {/* <button onClick={changeStyle} style={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}>
                Change Style
            </button> */}
        </div>
    );
};

export default Map;
