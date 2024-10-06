// @ts-nocheck
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Leaf } from 'lucide-react'
import ContractInteraction from './ContractInteraction'
import { encryptfloodData, submitEncryptedfloodData, performDataAnalysis } from '@/utils/litProtocol'
import { useSessionSigs } from '@/hooks/useSessionSigs'

// Custom leaf icon
const leafIcon = new L.Icon({
  iconUrl: '/leaflet/leaf-blue.png',
  shadowUrl: '/leaflet/leaf-shadow.png',
  iconSize: [38, 95],
  shadowSize: [50, 64],
  iconAnchor: [22, 94],
  shadowAnchor: [4, 62],
  popupAnchor: [-3, -76]
})

export default function Map() {
  const [encryptedfloodPoints, setEncryptedfloodPoints] = useState([]);
  const [insights, setInsights] = useState(null);
  const sessionSigs = useSessionSigs();

  useEffect(() => {
    const fetchEncryptedfloodPoints = async () => {
      // Implement fetching logic from your backend or IPFS
    };

    fetchEncryptedfloodPoints();
  }, []);

  const handlefloodReport = async (location, quantity) => {
    const floodData = { location, quantity };
    const encryptedData = await encryptfloodData(floodData);
    await submitEncryptedfloodData(encryptedData);
    // Refresh the map or add the new point
    await updateInsights();
  };

  const updateInsights = async () => {
    if (sessionSigs) {
      const newInsights = await performDataAnalysis(sessionSigs);
      setInsights(newInsights);
    }
  };

  return (
    <div className="h-screen flex">
      <div className="w-3/4">
        <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {insights && insights.hotspotLocations.map((point, index) => (
            <Marker key={index} position={[point.lat, point.lng]} icon={leafIcon}>
              <Popup>
                flood Hotspot <br />
                <Leaf className="w-6 h-6 inline-block mr-2 text-blue-600" />
                High flood generation area
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <div className="w-1/4 p-4 overflow-y-auto">
        <ContractInteraction onfloodReport={handlefloodReport} />
      </div>
    </div>
  )
}