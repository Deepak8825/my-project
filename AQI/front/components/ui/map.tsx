"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Type for air quality data point
interface AirQualityPoint {
  location: string;
  lat: number;
  lng: number;
  aqi: number;
  pm25: number;
  lastUpdated: string;
}

const IndiaMap = () => {
  const [aqiData, setAqiData] = useState<AirQualityPoint[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch air quality data for India
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, replace with your backend API endpoint
        const res = await fetch("http://localhost:8000/api/aqi/india");
        const data = await res.json();
        setAqiData(data);
      } catch (err) {
        // Fallback to mock data if API fails
        const mockData: AirQualityPoint[] = [
          {
            location: "Delhi",
            lat: 28.6139,
            lng: 77.2090,
            aqi: 156,
            pm25: 95,
            lastUpdated: new Date().toLocaleTimeString()
          },
          {
            location: "Mumbai",
            lat: 19.0760,
            lng: 72.8777,
            aqi: 89,
            pm25: 42,
            lastUpdated: new Date().toLocaleTimeString()
          },
          {
            location: "Bangalore",
            lat: 12.9716,
            lng: 77.5946,
            aqi: 65,
            pm25: 32,
            lastUpdated: new Date().toLocaleTimeString()
          },
          {
            location: "Kolkata",
            lat: 22.5726,
            lng: 88.3639,
            aqi: 142,
            pm25: 78,
            lastUpdated: new Date().toLocaleTimeString()
          },
          {
            location: "Chennai",
            lat: 13.0827,
            lng: 80.2707,
            aqi: 92,
            pm25: 45,
            lastUpdated: new Date().toLocaleTimeString()
          }
        ];
        setAqiData(mockData);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Get color based on AQI value
  const getMarkerColor = (aqi: number) => {
    if (aqi <= 50) return "bg-green-500";
    if (aqi <= 100) return "bg-yellow-500";
    if (aqi <= 150) return "bg-orange-500";
    if (aqi <= 200) return "bg-red-500";
    if (aqi <= 300) return "bg-purple-500";
    return "bg-maroon-500";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <MapContainer 
      center={[20.5937, 78.9629]} 
      zoom={5} 
      style={{ height: "500px", width: "100%" }}
      className="rounded-lg z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {aqiData.map((point, index) => (
        <Marker key={index} position={[point.lat, point.lng]}>
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-lg">{point.location}</h3>
              <div className="flex items-center mt-2">
                <div className={`w-4 h-4 rounded-full ${getMarkerColor(point.aqi)} mr-2`}></div>
                <span>AQI: {point.aqi}</span>
              </div>
              <p>PM2.5: {point.pm25} μg/m³</p>
              <p className="text-sm text-gray-500 mt-1">Updated: {point.lastUpdated}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default IndiaMap;
