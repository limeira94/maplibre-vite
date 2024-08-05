declare module '@maplibre/maplibre-gl-geocoder' {
    import { Map } from 'maplibre-gl';
    import { IControl } from 'maplibre-gl';
  
    export interface MaplibreGeocoderOptions {
      maplibregl: typeof Map;
      accessToken?: string;
      placeholder?: string;
      proximity?: {
        longitude: number;
        latitude: number;
      };
      bbox?: [number, number, number, number];
      types?: string;
      flyTo?: boolean;
      minLength?: number;
      limit?: number;
      render?: (item: any) => string;
      language?: string;
      zoom?: number;
      filter?: (item: any) => boolean;
      localGeocoder?: (query: string) => any[];
      reverseMode?: string;
      reverseGeocode?: boolean;
      enableEventLogging?: boolean;
      marker?: boolean;
      geocoderOptions?: object;
      trackProximity?: boolean;
      collapsed?: boolean;
      clearAndBlurOnEsc?: boolean;
      clearOnBlur?: boolean;
      enableUserLocation?: boolean;
      showUserLocation?: boolean;
      userLocation?: {
        longitude: number;
        latitude: number;
      };
    }
  
    export default class MaplibreGeocoder implements IControl {
      constructor(options?: MaplibreGeocoderOptions);
      onAdd(map: Map): HTMLElement;
      onRemove(): void;
      getDefaultPosition(): string;
      setProximity(proximity: { longitude: number, latitude: number }): void;
      getProximity(): { longitude: number, latitude: number } | null;
      setRenderFunction(renderFunction: (item: any) => string): void;
      setFlyTo(flyTo: boolean): void;
      setZoom(zoom: number): void;
      setPlaceholder(placeholder: string): void;
      setLanguage(language: string): void;
      setZoomOnSelect(zoom: number): void;
      setTypes(types: string): void;
      setFilter(filter: (item: any) => boolean): void;
      setLocalGeocoder(localGeocoder: (query: string) => any[]): void;
      setClearAndBlurOnEsc(clearAndBlurOnEsc: boolean): void;
      setClearOnBlur(clearOnBlur: boolean): void;
      setTrackProximity(trackProximity: boolean): void;
      setCollapsed(collapsed: boolean): void;
      setEnableUserLocation(enableUserLocation: boolean): void;
      setShowUserLocation(showUserLocation: boolean): void;
      setUserLocation(userLocation: { longitude: number, latitude: number }): void;
      query(query: string): void;
      queryURL(query: string): string;
    }
  }
  