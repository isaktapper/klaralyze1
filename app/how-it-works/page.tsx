"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  Plug, 
  BarChart3, 
  Sparkles, 
  MessageSquare, 
  Zap, 
  TrendingUp,
  Bot,
  Check,
  Clock,
  Users,
  Star,
  TrendingDown,
  Lightbulb,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    title: "Connect Your Support Platform",
    description: "Seamlessly integrate with your existing customer support tools. We support major platforms like Zendesk, Intercom, and more.",
    icon: Plug,
    color: "from-blue-500 to-blue-600",
    features: [
      "One-click integration setup",
      "Secure data synchronization",
      "Real-time data updates",
      "No code required"
    ]
  },
  {
    title: "AI-Powered Insights",
    description: "Our AI analyzes your support tickets to provide actionable insights and identify patterns automatically.",
    icon: Sparkles,
    color: "from-purple-500 to-purple-600",
    features: [
      "Automated ticket categorization",
      "Trend identification",
      "Sentiment analysis",
      "Priority detection"
    ]
  },
  {
    title: "Access Powerful Analytics",
    description: "Get instant access to comprehensive dashboards showing your support performance metrics and trends.",
    icon: BarChart3,
    color: "from-indigo-500 to-indigo-600",
    features: [
      "Custom dashboard creation",
      "Real-time metrics tracking",
      "Historical data analysis",
      "Export capabilities"
    ]
  },
  {
    title: "Optimize Support Operations",
    description: "Make data-driven decisions to improve your customer support efficiency and quality.",
    icon: TrendingUp,
    color: "from-cyan-500 to-cyan-600",
    features: [
      "Performance tracking",
      "Resource optimization",
      "Response time improvement",
      "Quality monitoring"
    ]
  }
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Header */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-center justify-between py-8">
          <Image
            src="/klaralyze_logo.svg"
            alt="Klaralyze"
            width={140}
            height={32}
            priority
          />
          <Link
            href="/"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Back to Home
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative isolate pt-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-2xl text-center"
          >
            <div className="inline-flex items-center justify-center px-4 py-1.5 mb-3 rounded-full bg-blue-50 border border-blue-100">
              <span className="text-sm font-medium text-blue-700 flex items-center">
                <Zap className="w-4 h-4 mr-2" />
                Simple Process
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              How Klaralyze Works
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Transform your customer support with our powerful AI analytics platform in just a few simple steps.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24">
        <div className="space-y-24">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className={index % 2 === 0 ? "lg:order-1" : "lg:order-2"}>
                  <div className="relative">
                    <div className={`h-14 w-14 rounded-xl bg-gradient-to-r ${step.color} flex items-center justify-center shadow-lg mb-6`}>
                      <step.icon className="h-7 w-7 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      {step.title}
                    </h2>
                    <p className="text-lg text-gray-600 mb-6">
                      {step.description}
                    </p>
                    <ul className="space-y-3">
                      {step.features.map((feature, featureIndex) => (
                        <motion.li
                          key={featureIndex}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: 0.1 * featureIndex }}
                          className="flex items-center space-x-3"
                        >
                          <div className={`h-6 w-6 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center`}>
                            <Check className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-gray-600">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className={index % 2 === 0 ? "lg:order-2" : "lg:order-1"}>
                  {/* Interactive Widgets */}
                  {index === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      className="bg-white rounded-2xl border border-gray-200 shadow-xl p-6"
                    >
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Integration Steps</h3>
                          <div className="space-y-3">
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              className="relative flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-white border border-blue-100"
                            >
                              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-sm font-semibold text-blue-600">1</span>
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium text-blue-900">Choose Platform</div>
                                <div className="text-sm text-blue-600">Select your support tool</div>
                              </div>
                              <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                <MessageSquare className="h-4 w-4 text-blue-600" />
                              </div>
                            </motion.div>

                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              className="relative flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-white border border-indigo-100"
                            >
                              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                <span className="text-sm font-semibold text-indigo-600">2</span>
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium text-indigo-900">Authenticate</div>
                                <div className="text-sm text-indigo-600">Secure OAuth connection</div>
                              </div>
                              <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                                <Plug className="h-4 w-4 text-indigo-600" />
                              </div>
                            </motion.div>

                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              className="relative flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-green-50 to-white border border-green-100"
                            >
                              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                <span className="text-sm font-semibold text-green-600">3</span>
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium text-green-900">Sync Data</div>
                                <div className="text-sm text-green-600">Auto-import history</div>
                              </div>
                              <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                                <TrendingUp className="h-4 w-4 text-green-600" />
                              </div>
                            </motion.div>
                          </div>
                        </div>

                        <div className="pt-2">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-900">Integration Progress</span>
                            <span className="text-sm font-medium text-blue-600">Step 2 of 3</span>
                          </div>
                          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: "66%" }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, delay: 0.2 }}
                              className="h-full bg-blue-600 rounded-full"
                            />
                          </div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          Start Integration
                        </motion.button>
                      </div>
                    </motion.div>
                  ) : index === 1 ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      className="bg-white rounded-2xl border border-gray-200 shadow-xl p-6 space-y-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">AI Analysis</h3>
                        <Sparkles className="h-5 w-5 text-purple-600" />
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-4 rounded-xl bg-red-50 border border-red-100"
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <AlertCircle className="h-5 w-5 text-red-600" />
                          <span className="text-sm font-medium text-red-900">Trending Issue</span>
                        </div>
                        <p className="text-sm text-red-800">Spike in payment-related tickets</p>
                        <div className="mt-2 text-sm text-red-600">+127% in last 24h</div>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-4 rounded-xl bg-purple-50 border border-purple-100"
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <Lightbulb className="h-5 w-5 text-purple-600" />
                          <span className="text-sm font-medium text-purple-900">Smart Suggestion</span>
                        </div>
                        <p className="text-sm text-purple-800">Update FAQ with common solutions</p>
                        <div className="mt-2 text-sm text-purple-600">Estimated impact: -35% tickets</div>
                      </motion.div>
                    </motion.div>
                  ) : index === 2 ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      className="bg-white rounded-2xl border border-gray-200 shadow-xl p-6"
                    >
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="bg-gradient-to-br from-indigo-50 to-white p-4 rounded-xl border border-indigo-100"
                        >
                          <div className="flex items-center space-x-2 mb-2">
                            <Clock className="h-5 w-5 text-indigo-600" />
                            <span className="text-sm font-medium text-gray-700">Response Time</span>
                          </div>
                          <div className="text-2xl font-bold text-indigo-600">1.2h</div>
                          <div className="text-sm text-green-600 flex items-center mt-1">
                            <TrendingDown className="h-4 w-4 mr-1" />
                            15% faster
                          </div>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="bg-gradient-to-br from-green-50 to-white p-4 rounded-xl border border-green-100"
                        >
                          <div className="flex items-center space-x-2 mb-2">
                            <Star className="h-5 w-5 text-green-600" />
                            <span className="text-sm font-medium text-gray-700">Sentiment Score</span>
                          </div>
                          <div className="text-2xl font-bold text-green-600">4.8</div>
                          <div className="text-sm text-green-600 flex items-center mt-1">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            5% increase
                          </div>
                        </motion.div>
                      </div>
                      <div className="mt-6 rounded-lg border border-blue-100 overflow-hidden">
                        <div className="bg-gradient-to-b from-blue-50 to-white px-4 py-3 border-b border-blue-100">
                          <h4 className="text-sm font-medium text-gray-700">Ticket Volume Trend</h4>
                        </div>
                        <div className="p-4">
                          <div className="grid grid-cols-7 gap-2 h-[80px] items-end">
                            {[40, 65, 45, 75, 55, 85, 60].map((height, i) => (
                              <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                whileInView={{ height: `${height}%` }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-blue-500/10 hover:bg-blue-500/20 transition-colors rounded-t w-full"
                              />
                            ))}
                          </div>
                          <div className="grid grid-cols-7 gap-2 mt-2">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                              <div key={i} className="text-xs text-gray-500 text-center">{day}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      className="bg-white rounded-2xl border border-gray-200 shadow-xl p-6"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Performance Score</h3>
                        <motion.div
                          animate={{
                            scale: [1, 1.1, 1],
                            transition: { duration: 2, repeat: Infinity }
                          }}
                          className="text-2xl font-bold text-cyan-600"
                        >
                          87
                        </motion.div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">Response Time</span>
                            <span className="text-sm font-medium text-cyan-600">85%</span>
                          </div>
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: "85%" }}
                            viewport={{ once: true }}
                            className="h-2 bg-cyan-500 rounded-full"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">Resolution Rate</span>
                            <span className="text-sm font-medium text-cyan-600">92%</span>
                          </div>
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: "92%" }}
                            viewport={{ once: true }}
                            className="h-2 bg-cyan-500 rounded-full"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">Customer Satisfaction</span>
                            <span className="text-sm font-medium text-cyan-600">88%</span>
                          </div>
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: "88%" }}
                            viewport={{ once: true }}
                            className="h-2 bg-cyan-500 rounded-full"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-12">
                  <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ArrowRight className="h-6 w-6 text-blue-500 rotate-90" />
                  </motion.div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-16 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Ready to Transform Your Customer Support?
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Get started with Klaralyze today and see the difference AI-powered analytics can make.
          </p>
          <div className="mt-8 flex justify-center gap-x-6">
            <Link href="/signup-steps">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white/10"
              >
                Contact Sales
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 