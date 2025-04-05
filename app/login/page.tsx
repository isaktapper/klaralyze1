"use client";

import { motion } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex justify-center py-8">
          <Logo size="small" className="white" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-md"
        >
          <div className="rounded-2xl bg-white/5 backdrop-blur-xl p-8 shadow-lg border border-white/10">
            <h2 className="text-center text-2xl font-bold text-white">
              Welcome back
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              Don't have an account?{" "}
              <a href="/register" className="font-medium text-cyan-400 hover:text-cyan-300">
                Sign up
              </a>
            </p>

            <LoginForm />
          </div>
        </motion.div>
      </div>
    </div>
  );
} 