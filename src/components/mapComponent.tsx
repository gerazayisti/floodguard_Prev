'use client'; 
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Polyline, useMap } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const MapPage = () => {
  const [mapData, setMapData] = useState({ buildings: [], highways: [], waterways: [] });
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([3.870, 11.497]);
  const [loading, setLoading] = useState(true);
  const [zoneName, setZoneName] = useState('');
  const [currentZone, setCurrentZone] = useState('');

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setMapCenter([latitude, longitude]);
          fetchMapData(latitude, longitude);
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error);
          fetchMapData(3.870, 11.497);
        }
      );
    } else {
      console.error("La géolocalisation n'est pas supportée par ce navigateur.");
      fetchMapData(3.870, 11.497);
    }
  };

  const fetchMapData = async (lat, lon) => {
    try {
      const response = await axios.get(`https://overpass-api.de/api/interpreter?data=[out:json];(way[building](around:300,${3.870},${11.497});way[highway](around:300,${3.870},${11.497});way[waterway](around:300,${3.870},${11.497}););out geom;`);
      
      const buildings = [];
      const highways = [];
      const waterways = [];

      response.data.elements.forEach(element => {
        const coordinates = element.geometry.map(point => [point.lat, point.lon]);
        if (element.tags.building) {
          buildings.push(coordinates);
        } else if (element.tags.highway) {
          highways.push(coordinates);
        } else if (element.tags.waterway) {
          waterways.push(coordinates);
        }
      });

      setMapData({buildings, highways, waterways });
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentZone(zoneName);
    setZoneName('');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Chargement de la carte...</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-blue-500 p-4">
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            type="text"
            value={zoneName}
            onChange={(e) => setZoneName(e.target.value)}
            placeholder="Nom de la zone"
            className="mr-2 p-2 rounded"
          />
          <button type="submit" className="bg-white text-blue-500 p-2 rounded">
            Définir la zone
          </button>
        </form>
      </header>
      {currentZone && (
        <div className="bg-green-100 p-2 text-center">
          Zone actuelle : {currentZone}
        </div>
      )}
      <div className="flex-grow">
        <MapContainer center={mapCenter} zoom={17} style={{ height: '100%', width: '100%' }}>
          <ChangeView center={mapCenter} zoom={17} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
          {mapData.buildings.map((building, index) => (
            <Polygon key={`building-${index}`} positions={building} color="red" />
          ))}
          
          {mapData.highways.map((highway, index) => (
            <Polyline key={`highway-${index}`} positions={highway} color="blue" />
          ))}
          
          {mapData.waterways.map((waterway, index) => (
            <Polyline key={`waterway-${index}`} positions={waterway} color="cyan" />
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapPage;