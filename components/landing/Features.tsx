"use client";

import { motion } from "framer-motion";
import { 
  Brain, 
  Gauge, 
  MessageSquare, 
  TrendingUp, 
  Sparkles, 
  Bot, 
  Network, 
  LineChart,
  Zap
} from "lucide-react";

const features = [
  {
    name: "Neural Network Analysis",
    description: "Our advanced deep learning models analyze thousands of support tickets in seconds, discovering patterns and insights no human could detect.",
    icon: Brain,
  },
  {
    name: "Real-time AI Predictions",
    description: "Predictive algorithms forecast support volume, identify potential escalations, and recommend staffing levels before issues arise.",
    icon: Network,
  },
  {
    name: "Sentiment Intelligence",
    description: "NLP-powered sentiment analysis detects customer emotions beyond simple positive/negative, including frustration, urgency, and satisfaction signals.",
    icon: MessageSquare,
  },
  {
    name: "Anomaly Detection",
    description: "Machine learning algorithms automatically identify unusual patterns and outliers in your support data, alerting you to emerging issues.",
    icon: Sparkles,
  },
  {
    name: "Conversational Analytics",
    description: "Transform customer conversations into actionable data with AI that extracts key topics, feature requests, and product feedback automatically.",
    icon: Bot,
  },
  {
    name: "Automated Insights",
    description: "Stop digging through data - our AI surfaces the most important trends and opportunities without requiring manual analysis or reporting.",
    icon: Zap,
  },
  {
    name: "Intelligent Dashboards",
    description: "Self-organizing dashboards that prioritize the metrics that matter most to your specific business needs using machine learning.",
    icon: Gauge,
  },
  {
    name: "Predictive Trends",
    description: "Identify emerging support trends weeks before they become apparent, with AI that recognizes subtle patterns across ticket categories.",
    icon: LineChart,
  },
];

export function Features() {
  return (
    <div id="features" className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center justify-center px-4 py-1.5 mb-3 rounded-full bg-cyan-50 border border-cyan-100">
              <span className="text-sm font-medium text-cyan-600 flex items-center">
                <Brain className="w-4 h-4 mr-2" />
                AI-Powered Features
              </span>
            </div>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Next-Generation ML & AI Technology
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Klaralyze uses cutting-edge artificial intelligence to transform raw support data into 
              strategic intelligence, delivering insights no traditional analytics tool can match.
            </p>
          </motion.div>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <motion.div 
            className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group h-full"
              >
                <div className="relative h-full">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 opacity-10 transform group-hover:opacity-20 transition-opacity" />
                  <div className="relative p-6 backdrop-blur-sm rounded-xl border border-gray-200 h-full flex flex-col">
                    <div className="mb-4 w-12 h-12 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg">
                      <feature.icon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.name}</h3>
                    <p className="text-base text-gray-600 leading-relaxed flex-grow">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        <motion.div 
          className="relative mt-16 overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-cyan-50 to-blue-50 p-8 lg:p-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative z-10 max-w-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Powered by Advanced Machine Learning</h3>
            <p className="text-gray-700 mb-5">
              Our AI technologies include transformer neural networks, natural language processing, and predictive analytics
              algorithms trained specifically for customer support contexts.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1 rounded-full bg-white/60 text-sm font-medium text-gray-800 shadow-sm">Neural Networks</span>
              <span className="px-3 py-1 rounded-full bg-white/60 text-sm font-medium text-gray-800 shadow-sm">NLP Processing</span>
              <span className="px-3 py-1 rounded-full bg-white/60 text-sm font-medium text-gray-800 shadow-sm">Sentiment Analysis</span>
              <span className="px-3 py-1 rounded-full bg-white/60 text-sm font-medium text-gray-800 shadow-sm">Anomaly Detection</span>
              <span className="px-3 py-1 rounded-full bg-white/60 text-sm font-medium text-gray-800 shadow-sm">Predictive Modeling</span>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 opacity-20">
            <Brain className="w-40 h-40 text-cyan-600" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}