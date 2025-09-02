"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sun, Cloud, CloudRain, CloudDrizzle, Wind } from "lucide-react";
import Link from "next/link";

// AQI data types
interface AqiData {
  location: string;
  aqi: number;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  so2: number;
  co: number;
  lastUpdated: string;
}

interface Forecast {
  day: string;
  temp: number;
  condition: string;
  aqi: number;
}

const Home = () => {
  const [aqiData, setAqiData] = useState<AqiData | null>(null);
  const [forecast, setForecast] = useState<Forecast[]>([]);
  const [location, setLocation] = useState("New York");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate API data fetch
  useEffect(() => {
    const fetchAqiData = async () => {
      try {
        // Replace with your real backend API endpoint
        const res = await fetch("http://localhost:8000/api/aqi?location=" + encodeURIComponent(location));
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        setAqiData({
          location: data.location,
          aqi: data.aqi,
          pm25: data.pm25,
          pm10: data.pm10,
          o3: data.o3,
          no2: data.no2,
          so2: data.so2,
          co: data.co,
          lastUpdated: data.lastUpdated || new Date().toLocaleTimeString(),
        });
        setForecast(data.forecast || []);
      } catch (err) {
        // fallback to mock data if API fails
        const mockAqiData: AqiData = {
          location: "New York",
          aqi: 42,
          pm25: 12.3,
          pm10: 23.1,
          o3: 32,
          no2: 18,
          so2: 4,
          co: 0.7,
          lastUpdated: new Date().toLocaleTimeString(),
        };
        const mockForecast: Forecast[] = [
          { day: "Today", temp: 72, condition: "sunny", aqi: 42 },
          { day: "Tue", temp: 68, condition: "partly-cloudy", aqi: 55 },
          { day: "Wed", temp: 70, condition: "rain", aqi: 38 },
          { day: "Thu", temp: 75, condition: "cloudy", aqi: 62 },
          { day: "Fri", temp: 78, condition: "sunny", aqi: 45 },
        ];
        setAqiData(mockAqiData);
        setForecast(mockForecast);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAqiData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  // Get AQI category and color
  const getAqiCategory = (aqi: number) => {
    if (aqi <= 50) return { label: "Good", color: "bg-green-500" };
    if (aqi <= 100) return { label: "Moderate", color: "bg-yellow-500" };
    if (aqi <= 150) return { label: "Unhealthy for Sensitive Groups", color: "bg-orange-500" };
    if (aqi <= 200) return { label: "Unhealthy", color: "bg-red-500" };
    if (aqi <= 300) return { label: "Very Unhealthy", color: "bg-purple-500" };
    return { label: "Hazardous", color: "bg-maroon-500" };
  };

  // Get weather icon
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <Sun className="w-8 h-8 text-yellow-500" />;
      case "partly-cloudy":
        return <Cloud className="w-8 h-8 text-gray-400" />;
      case "cloudy":
        return <CloudDrizzle className="w-8 h-8 text-gray-500" />;
      case "rain":
        return <CloudRain className="w-8 h-8 text-blue-500" />;
      default:
        return <Wind className="w-8 h-8 text-gray-400" />;
    }
  };

  // Get health recommendation based on AQI
  const getHealthRecommendation = (aqi: number) => {
    if (aqi <= 50) return "Air quality is good. Enjoy outdoor activities!";
    if (aqi <= 100) return "Air quality is acceptable. Unusually sensitive people should consider reducing prolonged outdoor exertion.";
    if (aqi <= 150) return "Sensitive groups should reduce prolonged outdoor exertion.";
    if (aqi <= 200) return "Everyone may begin to experience health effects. Sensitive groups should avoid prolonged outdoor exertion.";
    return "Health warnings of emergency conditions. Everyone should avoid all outdoor exertion.";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-700">Loading air quality data...</p>
        </div>
      </div>
    );
  }

  if (!aqiData) return <div>Error loading data</div>;

  const aqiCategory = getAqiCategory(aqiData.aqi);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center">
              <Wind className="text-white" />
            </div>
            <Link href="/" className="text-2xl font-bold text-gray-800 hover:text-blue-600">AirAware</Link>
          </div>
          <nav className="flex space-x-6">
            <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium">Dashboard</Link>
            <Link href="/forecast" className="text-gray-600 hover:text-blue-600 font-medium">Forecast</Link>
            <Link href="/health-tips" className="text-gray-600 hover:text-blue-600 font-medium">Health Tips</Link>
            <Link href="/settings" className="text-gray-600 hover:text-blue-600 font-medium">Settings</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="relative z-10"
        >
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-5xl font-extrabold mb-4 text-blue-700 drop-shadow-lg"
          >
            Welcome to <span className="text-cyan-600">AirAware</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-lg md:text-xl text-gray-700 mb-8"
          >
            Your one-stop dashboard for <span className="font-semibold text-blue-600">real-time air quality</span>, <span className="font-semibold text-cyan-600">weather</span>, and <span className="font-semibold text-green-600">health recommendations</span>.
          </motion.p>
          <div className="flex flex-col md:flex-row justify-center gap-6 mb-8">
            <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:-translate-y-1 hover:scale-105 focus:ring-4 focus:ring-blue-300">Go to Dashboard</Link>
            <Link href="/forecast" className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:-translate-y-1 hover:scale-105 focus:ring-4 focus:ring-cyan-300">View Forecast</Link>
            <Link href="/health-tips" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:-translate-y-1 hover:scale-105 focus:ring-4 focus:ring-green-300">Health Tips</Link>
            <Link href="/settings" className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:-translate-y-1 hover:scale-105 focus:ring-4 focus:ring-gray-300">Settings</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <motion.div whileHover={{ scale: 1.05 }} className="bg-white/90 rounded-xl shadow-xl p-6 border-t-4 border-blue-500 transition-all">
              <h3 className="text-xl font-bold mb-2 text-blue-700 flex items-center justify-center gap-2"><Wind className="inline w-6 h-6 text-blue-400" /> Live Air Quality</h3>
              <p className="text-gray-700">Get up-to-date AQI and pollutant levels for your city.</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="bg-white/90 rounded-xl shadow-xl p-6 border-t-4 border-cyan-500 transition-all">
              <h3 className="text-xl font-bold mb-2 text-cyan-700 flex items-center justify-center gap-2"><Cloud className="inline w-6 h-6 text-cyan-400" /> Weather & Forecast</h3>
              <p className="text-gray-700">See current weather and a 5-day forecast with AQI trends.</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="bg-white/90 rounded-xl shadow-xl p-6 border-t-4 border-green-500 transition-all">
              <h3 className="text-xl font-bold mb-2 text-green-700 flex items-center justify-center gap-2"><Sun className="inline w-6 h-6 text-green-400" /> Health Recommendations</h3>
              <p className="text-gray-700">Personalized tips to stay safe and healthy outdoors.</p>
            </motion.div>
          </div>
          {/* Animated stats */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }} className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl p-6 shadow flex flex-col items-center">
              <span className="text-3xl font-bold text-blue-700 mb-2">100+</span>
              <span className="text-gray-700">Cities Monitored</span>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }} className="bg-gradient-to-r from-cyan-100 to-cyan-200 rounded-xl p-6 shadow flex flex-col items-center">
              <span className="text-3xl font-bold text-cyan-700 mb-2">24/7</span>
              <span className="text-gray-700">Live Data Updates</span>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7 }} className="bg-gradient-to-r from-green-100 to-green-200 rounded-xl p-6 shadow flex flex-col items-center">
              <span className="text-3xl font-bold text-green-700 mb-2">99.9%</span>
              <span className="text-gray-700">Uptime Guarantee</span>
            </motion.div>
          </div>
        </motion.div>
        {/* Animated background shapes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 1 }}
          className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-200 rounded-full blur-3xl z-0"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.12 }}
          transition={{ duration: 1 }}
          className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-cyan-200 rounded-full blur-3xl z-0"
        />
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Location Search */}
        <div className="mb-8 flex">
          <Input 
            type="text" 
            placeholder="Search location..." 
            value={location}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
            className="flex-grow mr-4 py-6 text-lg"
          />
          <Button className="py-6 px-8 text-lg" onClick={() => setLocation(location)}>
            Search
          </Button>
        </div>

        {/* Current AQI */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Card className="bg-white/90 backdrop-blur-md">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl">Current Air Quality</CardTitle>
                <span className="text-gray-500">Updated: {aqiData.lastUpdated}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-4xl font-bold mb-2">{aqiData.location}</h2>
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full ${aqiCategory.color} mr-2`}></div>
                    <span className="text-xl font-semibold">{aqiCategory.label}</span>
                  </div>
                </div>
                <motion.div 
                  className="text-6xl font-bold"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  {aqiData.aqi}
                </motion.div>
              </div>

              <div className="mt-6">
                <div className="bg-gray-200 h-4 rounded-full overflow-hidden">
                  <motion.div 
                    className={`h-full ${aqiCategory.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(aqiData.aqi / 300) * 100}%` }}
                    transition={{ duration: 1 }}
                  ></motion.div>
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                  <span>150</span>
                  <span>200</span>
                  <span>300+</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-600">PM2.5</p>
                  <p className="text-xl font-bold">{aqiData.pm25} μg/m³</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-600">PM10</p>
                  <p className="text-xl font-bold">{aqiData.pm10} μg/m³</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-600">O₃</p>
                  <p className="text-xl font-bold">{aqiData.o3} ppb</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-600">NO₂</p>
                  <p className="text-xl font-bold">{aqiData.no2} ppb</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Health Recommendation */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-8"
        >
          <Card className="bg-white/90 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-xl">Health Recommendation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">{getHealthRecommendation(aqiData.aqi)}</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Forecast */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="bg-white/90 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-xl">5-Day Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {forecast.map((day, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="bg-blue-50 p-4 rounded-lg text-center"
                  >
                    <h3 className="font-bold mb-2">{day.day}</h3>
                    <div className="flex justify-center mb-2">
                      {getWeatherIcon(day.condition)}
                    </div>
                    <p className="text-xl font-bold">{day.temp}°F</p>
                    <div className="mt-2 flex items-center justify-center">
                      <div className={`w-3 h-3 rounded-full ${getAqiCategory(day.aqi).color} mr-2`}></div>
                      <span className="text-sm">{day.aqi}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>Data provided by OpenAQ and OpenWeatherMap APIs</p>
          <p className="mt-2">© {new Date().getFullYear()} AirAware. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
