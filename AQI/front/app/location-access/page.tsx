"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function LocationAccess() {
  useEffect(() => {
    // Optionally, auto-request location on mount
  }, []);

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          alert(`Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`);
          // You can redirect or save location here
        },
        (error) => {
          alert("Location access denied or unavailable.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100/60 to-cyan-200/60">
      <div className="w-full max-w-md bg-white/30 backdrop-blur-lg rounded-2xl shadow-xl p-8 flex flex-col gap-6 border border-white/40 text-center">
        <h2 className="text-3xl font-bold text-blue-700 mb-2">Location Access</h2>
        <p className="text-gray-700 mb-4">To provide accurate air quality data, we need your location.</p>
        <Button className="w-full py-3 text-lg" onClick={handleLocation}>Allow Location Access</Button>
      </div>
    </div>
  );
}
