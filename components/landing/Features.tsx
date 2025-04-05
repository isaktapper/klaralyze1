"use client";

import { motion } from "framer-motion";
import { Zap, TrendingUp, Tag, ChevronRight } from "lucide-react";
import Link from "next/link";

const features = [
  {
    name: "Automated Insights",
    description: "Get instant, AI-powered insights from your support data. Our system automatically analyzes tickets to surface key patterns and opportunities.",
    icon: Zap,
    gradient: "from-blue-500 to-blue-600"
  },
  {
    name: "Predictive Trends",
    description: "Stay ahead of support trends with predictive analytics. Identify emerging issues before they become problems and optimize your resources.",
    icon: TrendingUp,
    gradient: "from-blue-500 to-blue-600"
  },
  {
    name: "Ticket Tagging",
    description: "Automatically categorize and tag tickets for better organization. Save time on manual classification and get consistent insights across your support data.",
    icon: Tag,
    gradient: "from-blue-500 to-blue-600"
  }
];

export function Features() {
  return (
    <div className="py-24 sm:py-32 bg-gradient-to-b from-white to-blue-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-3 rounded-full bg-blue-50 border border-blue-100">
            <span className="text-sm font-medium text-blue-700 flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              Core Features
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            AI-Powered Support Analytics
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Transform your support operations with our core AI features. Get deeper insights, predict trends, and organize your tickets automatically.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none"
        >
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <motion.div
                key={feature.name}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group relative flex flex-col rounded-2xl bg-white p-8 shadow-sm ring-1 ring-blue-200 hover:shadow-xl transition-all duration-300"
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <div className={`mb-6 w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <dt className="text-lg font-semibold leading-7 text-gray-900">
                  {feature.name}
                </dt>
                <dd className="mt-2 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <Link
            href="/features"
            className="inline-flex items-center justify-center rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 hover:bg-blue-100 transition-colors"
          >
            View All Features
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}