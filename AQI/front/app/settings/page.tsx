"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sun, PaintBucket, RefreshCw } from 'lucide-react';

type Settings = {
  name: string;
  email: string;
  language: string;
  units: 'metric' | 'imperial';
  notifications: boolean;
  accent: string;
  shareAnon: boolean;
};

const DEFAULT: Settings = {
  name: '',
  email: '',
  language: 'en',
  units: 'metric',
  notifications: true,
  accent: '#06b6d4', // cyan
  shareAnon: true,
};

const COLORS = ['#06b6d4', '#0ea5a4', '#ef4444', '#f97316', '#7c3aed', '#16a34a'];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = localStorage.getItem('airaware_settings');
      if (raw) setSettings(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  const update = (patch: Partial<Settings>) => setSettings(prev => ({ ...prev, ...patch }));

  const handleSave = () => {
    localStorage.setItem('airaware_settings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const handleReset = () => {
    setSettings(DEFAULT);
    localStorage.removeItem('airaware_settings');
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 py-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center gap-4"
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg">
            <Sun className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Settings — make it yours</h1>
            <p className="text-gray-700">Fun preferences to personalize your AirAware experience.</p>
          </div>
        </motion.header>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile + Preferences */}
          <section className="lg:col-span-2 bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm text-gray-900 mb-2">Full name</label>
                <Input
                  value={settings.name}
                  onChange={(e: any) => update({ name: e.target.value })}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-900 mb-2">Email</label>
                <Input
                  value={settings.email}
                  onChange={(e: any) => update({ email: e.target.value })}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">Preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-6">
              {/* Language */}
              <div>
                <label className="block text-sm text-gray-900 mb-2">Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => update({ language: e.target.value })}
                  className="w-full p-3 rounded-md border bg-white text-gray-900 shadow-sm"
                >
                  <option value="en">English</option>
                  <option value="ta">Tamil</option>
                  <option value="hi">Hindi</option>
                </select>
              </div>

              {/* Units */}
              <div>
                <label className="block text-sm text-gray-900 mb-2">Units</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => update({ units: 'metric' })}
                    className={`py-2 px-3 rounded-md ${
                      settings.units === 'metric'
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    Metric
                  </button>
                  <button
                    onClick={() => update({ units: 'imperial' })}
                    className={`py-2 px-3 rounded-md ${
                      settings.units === 'imperial'
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    Imperial
                  </button>
                </div>
              </div>

              {/* Notifications */}
              <div>
                <label className="block text-sm text-gray-900 mb-2">Notifications</label>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-6 rounded-full p-0.5 cursor-pointer ${
                      settings.notifications ? 'bg-green-400' : 'bg-gray-300'
                    }`}
                    onClick={() => update({ notifications: !settings.notifications })}
                  >
                    <div
                      className={`bg-white w-5 h-5 rounded-full shadow transform ${
                        settings.notifications ? 'translate-x-6' : 'translate-x-0'
                      } transition`}
                    />
                  </div>
                  <span className="text-sm text-gray-800">
                    {settings.notifications ? 'On' : 'Off'}
                  </span>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">Appearance</h2>
            <div className="flex items-center gap-4 mb-6">
              {/* Accent colors */}
              <div>
                <div className="text-sm text-gray-900 mb-2">Accent color</div>
                <div className="flex gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => update({ accent: c })}
                      style={{ background: c }}
                      className={`w-10 h-10 rounded-full shadow-md ring-2 ${
                        settings.accent === c
                          ? 'ring-offset-2 ring-white'
                          : 'ring-offset-0 ring-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Anonymous sharing */}
              <div className="ml-auto">
                <div className="text-sm text-gray-900 mb-2">Share anonymous usage</div>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.shareAnon}
                    onChange={(e) => update({ shareAnon: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-800">Help improve AirAware</span>
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <Button onClick={handleSave} className="bg-blue-600">
                Save changes
              </Button>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-md bg-gray-100 text-gray-900 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Reset
              </button>

              <div
                className={`ml-auto self-center text-sm font-medium ${
                  saved ? 'text-green-600' : 'text-gray-600'
                }`}
              >
                {saved ? 'Saved ✅' : 'Not saved'}
              </div>
            </div>
          </section>

          {/* Right-side preview */}
          <aside className="bg-white rounded-xl p-6 shadow-lg flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-400 to-amber-400 flex items-center justify-center text-white shadow">
                <PaintBucket className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm text-gray-900 font-semibold">Preview</div>
                <div className="text-xs text-gray-700">
                  See a quick preview of your accent color
                </div>
              </div>
            </div>

            <div
              className="rounded-md p-4 shadow-md"
              style={{ background: settings.accent, color: '#fff' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold">AirAware</div>
                  <div className="text-sm">{settings.name || 'Guest'}</div>
                </div>
                <div className="text-sm">
                  {settings.units === 'metric' ? '°C' : '°F'}
                </div>
              </div>
            </div>

            <div className="mt-2 text-sm text-gray-700">Shortcuts</div>
            <div className="flex gap-2">
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => router.push('/')} className="flex-1 py-2 rounded-md bg-white border text-gray-900 shadow-sm">
                Open dashboard
              </motion.button>
              <button className="flex-1 py-2 rounded-md bg-white border text-gray-900 shadow-sm">
                Manage account
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
