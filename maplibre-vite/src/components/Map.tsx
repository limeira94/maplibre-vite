import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import MaplibreGeocoder from '@maplibre/maplibre-gl-geocoder';
import '@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css';
import { Box, Button, Drawer, Typography } from '@mui/material';
import Logo from '../assets/Maplibre-logo.png';

const MAPTILER_KEY = 'get_your_own_OpIi9ZULNHzrESv6T2vL';

const Map: React.FC = () => {
    const mapRef = useRef<maplibregl.Map | null>(null);

    useEffect(() => {
        const map = new maplibregl.Map({
            container: 'map',
            style: `https://api.maptiler.com/maps/basic-v2/style.json?key=${MAPTILER_KEY}`,
            center: [-46.62529, -23.53377], // [lng, lat]
            zoom: 13.5,
            pitch: 45,
            bearing: -17.6,
            antialias: true
        });

        map.addControl(new maplibregl.NavigationControl(), 'top-right');
        map.addControl(new maplibregl.ScaleControl(), 'bottom-right');
        map.addControl(new maplibregl.LogoControl({ compact: false }));

        const geocoderApi = {
            forwardGeocode: async (config: { query: any; }) => {
                const features = [];
                try {
                    const request = `https://nominatim.openstreetmap.org/search?q=${config.query}&format=geojson&polygon_geojson=1&addressdetails=1`;
                    const response = await fetch(request);
                    const geojson = await response.json();
                    for (const feature of geojson.features) {
                        const center = [
                            feature.bbox[0] + (feature.bbox[2] - feature.bbox[0]) / 2,
                            feature.bbox[1] + (feature.bbox[3] - feature.bbox[1]) / 2
                        ];
                        const point = {
                            type: 'Feature',
                            geometry: {
                                type: 'Point',
                                coordinates: center
                            },
                            place_name: feature.properties.display_name,
                            properties: feature.properties,
                            text: feature.properties.display_name,
                            place_type: ['place'],
                            center
                        };
                        features.push(point);
                    }
                } catch (e) {
                    console.error(`Failed to forwardGeocode with error: ${e}`);
                }

                return {
                    features
                };
            }
        };


        const geocoder = new MaplibreGeocoder({
            forwardGeocode: geocoderApi.forwardGeocode,
            maplibregl: maplibregl as any
        });


        map.addControl(geocoder as any, 'top-right');

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

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const data = JSON.parse(reader.result as string);
                if (mapRef.current) {
                    mapRef.current.addSource('uploaded-geojson', {
                        type: 'geojson',
                        data: data
                    });
                    mapRef.current.addLayer({
                        id: 'uploaded-geojson-layer',
                        type: 'line',
                        source: 'uploaded-geojson',
                        paint: {
                            'line-color': '#ff0000',
                            'line-width': 2
                        }
                    });
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <>
            <Drawer
                variant="permanent"
                anchor="left"
                sx={{
                    width: 0,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 350,
                        boxSizing: 'border-box',
                        backgroundColor: 'white',
                    },
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        height: 60,
                        backgroundColor: 'silver',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'left',

                        color: 'black',
                        fontSize: 25,
                    }}
                >
                    <img src={Logo} alt="Logo" style={{ height: '30px', padding: '10px' }} />
                    MapLibre
                </Box>
                <Box sx={{ p: 2 }}>
                    
                    <input
                        accept=".geojson"
                        style={{ display: 'none' }}
                        id="geojson-upload"
                        type="file"
                        onChange={handleFileUpload}
                    />
                    <label htmlFor="geojson-upload">
                        <Button variant="contained" component="span" sx={{backgroundColor: 'black'}}>
                            Upload geojson
                        </Button>
                    </label>
                </Box>
            </Drawer>
            <div style={{ width: '100%', height: '100%', position: 'absolute' }}>
                <div id="map" style={{ width: '100%', height: '100%' }}></div>
            </div>
        </>
    );
};

export default Map;
