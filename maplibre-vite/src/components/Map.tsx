import React, { useEffect } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const Map: React.FC = () => {
    useEffect(() => {
        const map = new maplibregl.Map({
            container: 'map', // container id
            style: {
                version: 8,
                sources: {
                    osm: {
                        type: 'raster',
                        tiles: [
                            'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
                            'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
                            'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
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
            },
            center: [-46.62529, -23.53377], // starting position [lng, lat]
            zoom: 5 // starting zoom
        });

        map.addControl(new maplibregl.NavigationControl(), 'top-right'); //controls zoom and rotation map
        map.addControl(new maplibregl.ScaleControl(), 'bottom-right')
        map.addControl(new maplibregl.LogoControl({compact: false}));

        const marker = new maplibregl.Marker()
            .setLngLat([-46.62529, -23.53377])
            .addTo(map)

        const popup = new maplibregl.Popup({ offset: 25 }).setText(
            'São Paulo'
        );

        marker.setPopup(popup);

        return () => map.remove();

    }, []);

    const changeStyle = () => {
        if (map) {
            map.setStyle({
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
        <div style={{ width: '100%', height: '100vh' }}>
            <div id="map" style={{ width: '100%', height: '100%' }}></div>
            <button onClick={changeStyle} style={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}>
                Change Style
            </button>
        </div>
    );
};

export default Map;