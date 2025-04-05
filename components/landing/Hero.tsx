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
  Lightbulb
} from "lucide-react";
import Link from "next/link";

const dashboardCards = [
  {
    type: "trends",
    title: "Customer Support",
    icon: TrendingUp,
    stats: [
      { label: "Billing", value: "19 tickets", change: "+27%", positive: false },
      { label: "Order Details", value: "14", change: "+2.3%", positive: true },
      { label: "Support Volume", value: "1,842", change: "-5.2%", positive: false },
    ],
  },
  {
    type: "recommendation",
    title: "Implement Chatbot for Billing FAQ",
    impactLevel: "High impact",
    effortLevel: "Medium effort",
    description: "Deploy an AI chatbot to handle common billing questions that currently account for 35% of all billing tickets.",
    expectedOutcome: "40-50% reduction in basic billing inquiries",
    icon: Lightbulb,
  },
  {
    type: "improvement",
    title: "Response Time Improvement",
    improvementPercent: "15% improvement",
    description: "Average first response time has decreased to 1.2 hours, an improvement of 15% from last month.",
    metric: { label: "Avg. Response Time", value: "1.2 hrs" },
    date: "April 2023",
    icon: Clock,
  }
];

export function Hero() {
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900 pt-[120px] pb-16 sm:pb-64">
      {/* Gradient Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-20 right-20 w-60 h-60 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-1/2 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="flex items-center justify-center mb-6 gap-2">
            <Zap className="w-6 h-6 text-cyan-400" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-medium">
              Powered by Advanced AI
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-4">
            Transform Support Data into{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              Actionable Insights
            </span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Klaralyze uses AI to analyze your customer support tickets,
            helping you identify trends, improve response times, and make
            data-driven decisions.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white shadow-lg shadow-cyan-500/25"
              >
                Get Started
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="text-gray-300 border-gray-700 hover:bg-gray-800"
            >
              See Demo
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-24 relative"
        >
          <div className="mx-auto max-w-6xl flex justify-center flex-wrap gap-6">
            {dashboardCards.map((card, cardIndex) => (
              <motion.div
                key={cardIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.3 + cardIndex * 0.2,
                }}
                className="backdrop-blur-xl bg-slate-900/80 border border-slate-700/50 rounded-xl p-6 shadow-lg"
                style={{
                  width: card.type === "trends" ? '400px' : '370px',
                  height: card.type === "trends" ? 'auto' : card.type === "recommendation" ? 'auto' : 'auto',
                }}
              >
                {card.type === "trends" && card.stats && (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20">
                          <card.icon className="h-5 w-5 text-cyan-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">{card.title}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">Last 7<br/>days</span>
                        <RefreshCcw className="h-4 w-4 text-gray-400 animate-spin-slow" />
                      </div>
                    </div>
                    <div className="space-y-6">
                      {card.stats.map((stat, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className="flex items-center justify-between"
                        >
                          <div className="space-y-1">
                            <span className="text-base text-gray-300">{stat.label}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-semibold text-white">{stat.value}</span>
                              <div className={`flex items-center px-2 py-0.5 rounded-full ${
                                stat.change.startsWith("+") 
                                  ? "bg-gradient-to-r from-blue-500/10 to-blue-500/5" 
                                  : stat.change.startsWith("-") 
                                    ? stat.positive 
                                      ? "bg-gradient-to-r from-blue-500/10 to-blue-500/5"
                                      : "bg-gradient-to-r from-red-500/10 to-red-500/5"
                                    : "bg-gradient-to-r from-blue-500/10 to-blue-500/5"
                              }`}>
                                {stat.change.startsWith("+") || (stat.change.startsWith("-") && stat.positive) ? (
                                  <ArrowUpRight className={`h-3 w-3 mr-1 ${
                                    stat.change.startsWith("+") || (stat.change.startsWith("-") && stat.positive)
                                      ? "text-blue-400"
                                      : "text-red-400"
                                  }`} />
                                ) : (
                                  <ArrowDownRight className="h-3 w-3 mr-1 text-red-400" />
                                )}
                                <span className={`text-xs ${
                                  stat.change.startsWith("+") || (stat.change.startsWith("-") && stat.positive)
                                    ? "text-blue-400"
                                    : stat.change.startsWith("-")
                                      ? "text-red-400"
                                      : "text-blue-400"
                                }`}>{stat.change}</span>
                              </div>
                            </div>
                          </div>
                          <div className="h-14 w-40">
                            <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
                              <path
                                d={
                                  index === 0 
                                    ? "M0,30 C20,30 30,15 50,15 S80,10 100,10" 
                                    : index === 1
                                    ? "M0,20 C25,20 40,15 60,10 S85,5 100,5" 
                                    : "M0,15 C30,15 40,20 60,20 S80,15 100,15"  
                                }
                                fill="none"
                                stroke={
                                  index === 0 
                                    ? "#3b82f6"
                                    : index === 1
                                    ? "#06b6d4"
                                    : "#2563eb"
                                }
                                strokeWidth="2"
                                className="drop-shadow-[0_0_3px_rgba(34,211,238,0.8)]"
                              />
                              <path
                                d={
                                  index === 0 
                                    ? "M0,30 C20,30 30,15 50,15 S80,10 100,10" 
                                    : index === 1
                                    ? "M0,20 C25,20 40,15 60,10 S85,5 100,5" 
                                    : "M0,15 C30,15 40,20 60,20 S80,15 100,15"  
                                }
                                fill={`url(#gradient-${cardIndex}-${index})`}
                                fillOpacity="0.2"
                                stroke="none"
                              />
                              <defs>
                                <linearGradient id={`gradient-${cardIndex}-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                  <stop offset="0%" stopColor={
                                    index === 0 
                                      ? "#3b82f6"
                                      : index === 1
                                      ? "#06b6d4"
                                      : "#2563eb"
                                  } stopOpacity="0.5" />
                                  <stop offset="100%" stopColor={
                                    index === 0 
                                      ? "#3b82f6"
                                      : index === 1
                                      ? "#06b6d4"
                                      : "#2563eb"
                                  } stopOpacity="0" />
                                </linearGradient>
                              </defs>
                            </svg>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </>
                )}
                
                {card.type === "recommendation" && (
                  <>
                    <div className="flex space-x-2 mb-3">
                      <span className="text-sm text-blue-400 bg-blue-500/20 px-3 py-1 rounded-full">
                        {card.impactLevel}
                      </span>
                      <span className="text-sm text-orange-400 bg-orange-500/20 px-3 py-1 rounded-full">
                        {card.effortLevel}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{card.title}</h3>
                    <p className="text-gray-300 mb-6">
                      {card.description}
                    </p>
                    <div className="mb-2">
                      <div className="font-medium text-gray-200">Expected Outcome:</div>
                      <div className="text-gray-300">{card.expectedOutcome}</div>
                    </div>
                    <div className="flex justify-end mt-2">
                      <div className="bg-amber-500/20 p-2 rounded-full">
                        <Lightbulb className="h-5 w-5 text-amber-400" />
                      </div>
                    </div>
                  </>
                )}
                
                {card.type === "improvement" && card.metric && (
                  <>
                    <div className="flex items-center mb-4">
                      <div className="bg-green-500/20 text-green-400 text-sm px-3 py-1 rounded-full flex items-center">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        {card.improvementPercent}
                      </div>
                      <div className="ml-auto">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{card.title}</h3>
                    <p className="text-gray-300 mb-4">
                      {card.description}
                    </p>
                    <div className="text-xl font-semibold text-white">{card.metric.value}</div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
        
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
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer"
          onClick={scrollToFeatures}
        >
          <span className="text-gray-400 text-sm mb-2">Discover our AI features</span>
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-lg border border-gray-700 shadow-lg">
            <ChevronDown className="h-5 w-5 text-cyan-400" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}