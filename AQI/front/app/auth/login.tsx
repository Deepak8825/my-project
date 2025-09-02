"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ta", label: "Tamil" },
  { code: "hi", label: "Hindi" },
];

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "", language: "en" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Login failed");
      }
      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      window.location.href = "/location-access";
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100/60 to-cyan-200/60 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-[600px] h-[600px] bg-blue-200/40 rounded-full blur-3xl -top-40 -left-40 animate-pulse" />
        <div className="absolute w-[500px] h-[500px] bg-cyan-200/40 rounded-full blur-3xl -bottom-32 -right-32 animate-pulse" />
      </div>
      <form onSubmit={handleSubmit} className="relative z-10 w-full max-w-md bg-white/30 backdrop-blur-lg rounded-2xl shadow-xl p-8 flex flex-col gap-6 border border-white/40">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-2">Login</h2>
        <div className="flex flex-col gap-3">
          <Input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="bg-white/60" />
          <Input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required className="bg-white/60" />
          <select name="language" value={form.language} onChange={handleChange} className="bg-white/60 rounded-md px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400">
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.label}</option>
            ))}
          </select>
        </div>
        {error && <div className="text-red-600 text-center text-sm">{error}</div>}
        <Button type="submit" className="w-full py-3 text-lg" disabled={loading}>{loading ? "Logging in..." : "Login"}</Button>
        <div className="text-center text-gray-700 text-sm mt-2">
          Don't have an account? <Link href="/auth/register" className="text-blue-600 hover:underline">Register</Link>
        </div>
      </form>
    </div>
  );
}
