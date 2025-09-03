"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Wind } from "lucide-react";

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };
  const buttonVariants = {
    hover: { scale: 1.03, transition: { duration: 0.2 } },
    tap: { scale: 0.98, transition: { duration: 0.1 } }
  };
  const errorVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
  };
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#24243e] relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 z-0">
          <motion.div 
            className="absolute w-[600px] h-[600px] bg-cyan-400/30 rounded-full blur-3xl -top-40 -left-40"
            animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute w-[500px] h-[500px] bg-blue-400/30 rounded-full blur-3xl -bottom-32 -right-32"
            animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <motion.form
          onSubmit={handleSubmit}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 w-full max-w-md bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef] backdrop-blur-lg rounded-2xl shadow-2xl p-10 flex flex-col gap-7 border border-[#d1d5db]"
        >
          <motion.div variants={itemVariants} className="flex flex-col items-center mb-2">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-400 w-16 h-16 rounded-full flex items-center justify-center mb-2 shadow-lg">
              <Wind className="text-white w-8 h-8" />
            </div>
            <h2 className="text-3xl font-extrabold text-center text-[#22223b] tracking-tight">AirAware Login</h2>
            <p className="text-center text-[#22223b] text-base mt-1">Sign in to access your personalized air quality dashboard and predictions.</p>
          </motion.div>
          <div className="flex flex-col gap-3">
            <motion.div variants={itemVariants}>
              <Input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="bg-[#f1f5f9] border border-[#cbd5e1] text-black placeholder-gray-500" />
            </motion.div>
            <motion.div variants={itemVariants}>
              <Input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required className="bg-[#f1f5f9] border border-[#cbd5e1] text-black placeholder-gray-500" />
            </motion.div>
            <motion.div variants={itemVariants}>
              <select name="language" value={form.language} onChange={handleChange} className="bg-[#f1f5f9] border border-[#cbd5e1] text-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full">
                {LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.label}</option>
                ))}
              </select>
            </motion.div>
          </div>
          {error && (
            <motion.div 
              variants={errorVariants}
              initial="hidden"
              animate="visible"
              className="text-red-600 text-center text-sm"
            >
              {error}
            </motion.div>
          )}
          <motion.div variants={itemVariants}>
            <motion.button
              type="submit"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="w-full py-3 text-lg bg-gradient-to-r from-blue-700 to-cyan-500 text-white rounded-md font-semibold shadow-lg hover:from-blue-800 hover:to-cyan-600 transition-colors duration-200 disabled:opacity-70"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </motion.button>
          </motion.div>
          <motion.div 
            variants={itemVariants}
            className="text-center text-[#22223b] text-sm mt-2"
          >
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-cyan-700 hover:underline font-semibold">Register</Link>
          </motion.div>
        </motion.form>
      </div>
    );
}
