"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  Brain, 
  Sparkles, 
  RefreshCcw, 
  Zap, 
  TrendingUp, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  CheckCircle, 
  MessageSquare, 
  UserCheck,
  ArrowUpRight,
  ArrowDownRight,
  TrendingDown,
  ChevronDown,
  Lightbulb,
  PlayCircle,
  Bot,
  Check
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// AI Insights cards data
const insightCards = [
  {
    title: "Trending Issues",
    description: "Payment processing errors up 15%",
    icon: TrendingUp,
    color: "from-blue-600/20 to-blue-700/20",
    textColor: "text-blue-300",
    borderColor: "border-blue-500/20"
  },
  {
    title: "Smart Suggestion",
    description: "High impact: Update payment docs (40% reduction)",
    icon: Lightbulb,
    color: "from-sky-500/20 to-sky-600/20",
    textColor: "text-sky-300",
    borderColor: "border-sky-400/20"
  },
  {
    title: "AI Analysis",
    description: "12% increase in positive sentiment detected",
    icon: Brain,
    color: "from-cyan-500/20 to-cyan-600/20",
    textColor: "text-cyan-300",
    borderColor: "border-cyan-400/20"
  }
];

// Trusted by companies
const trustedBy = [
  { name: "Company 1", logo: "/logos/company1.svg" },
  { name: "Company 2", logo: "/logos/company2.svg" },
  { name: "Company 3", logo: "/logos/company3.svg" },
  { name: "Company 4", logo: "/logos/company4.svg" },
];

export function Hero() {
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <>
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900 pt-[120px] pb-16">
      {/* Enhanced Gradient Orbs with Animation */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div 
          className="absolute top-20 right-20 w-60 h-60 bg-cyan-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div 
          className="absolute bottom-40 left-1/2 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="flex items-center justify-center mb-6 gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-6 h-6 text-cyan-400" />
            </motion.div>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-medium">
              AI-Powered Customer Support Analytics
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-4">
            Transform Customer Support with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              AI-Powered Insights
            </span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Unlock the power of your support data. Get instant insights, predict trends, 
            and deliver exceptional customer experiences with our advanced AI analytics platform.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <form action="/register" method="get">
              <button 
                type="submit"
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg"
              >
                Start Your Free Trial
              </button>
            </form>
            <Button
              variant="outline"
              size="lg"
              className="text-gray-300 border-gray-700 hover:bg-gray-800 group"
            >
              <PlayCircle className="mr-2 h-5 w-5 group-hover:text-cyan-400 transition-colors" />
              Watch Demo
            </Button>
          </div>
        </motion.div>

        {/* AI Insights Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-16 relative"
        >
          <div className="mx-auto max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {insightCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className={`relative overflow-hidden rounded-2xl border ${card.borderColor} bg-gradient-to-r ${card.color} backdrop-blur-xl p-6`}
                  style={{
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)'
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <card.icon className={`h-5 w-5 ${card.textColor}`} />
                        <h3 className={`font-medium ${card.textColor}`}>{card.title}</h3>
                      </div>
                      <p className="text-white text-sm">{card.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Scroll indicator */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: 0.2
              }}
              className="flex flex-col items-center justify-center mt-16 cursor-pointer"
              onClick={scrollToFeatures}
            >
              <span className="text-gray-400 text-sm mb-3">Discover our AI features</span>
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-lg border border-gray-700 shadow-lg">
                <ChevronDown className="h-5 w-5 text-blue-400" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>

    <div className="bg-white" id="features"></div>
    </>
  );
}