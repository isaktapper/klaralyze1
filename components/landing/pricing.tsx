"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronRight, Sparkles, Zap, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

type Plan = {
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  period: string;
  features: string[];
  cta: string;
  popular: boolean;
  freeTrial?: boolean;
  color: string;
  icon: any;
};

const pricingPlans: Plan[] = [
  {
    name: "Starter",
    description: "Perfect for small teams getting started with support analytics",
    monthlyPrice: 29,
    yearlyPrice: 25,
    period: "/month",
    color: "from-blue-500 to-blue-600",
    icon: Sparkles,
    features: [
      "Up to 100 tickets/month",
      "Template dashboards",
      "Smart tagging"
    ],
    cta: "Start Free Trial",
    popular: false,
    freeTrial: true
  },
  {
    name: "Growth",
    description: "For growing teams that need more power and flexibility",
    monthlyPrice: 59,
    yearlyPrice: 50,
    period: "/month",
    color: "from-blue-600 to-blue-700",
    icon: Zap,
    features: [
      "Up to 500 tickets/month",
      "AI-powered insights",
      "Daily data refresh"
    ],
    cta: "Start Free Trial",
    popular: true,
    freeTrial: true
  },
  {
    name: "Professional",
    description: "Advanced features for professional support teams",
    monthlyPrice: 119,
    yearlyPrice: 101,
    period: "/month",
    color: "from-blue-700 to-blue-800",
    icon: Rocket,
    features: [
      "Up to 2000 tickets/month",
      "Recommendations",
      "Anomaly alerts"
    ],
    cta: "Start Free Trial",
    popular: false,
    freeTrial: true
  },
  {
    name: "Enterprise",
    description: "Custom solutions for large organizations",
    monthlyPrice: 0,
    yearlyPrice: 0,
    period: "",
    color: "from-indigo-600 to-indigo-700",
    icon: Rocket,
    features: [
      "Unlimited tickets",
      "Unlimited data sources",
      "Everyting in Professional"
    ],
    cta: "Contact Sales",
    popular: false,
    freeTrial: false
  }
];

export function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

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
              <Sparkles className="w-4 h-4 mr-2" />
              Pricing
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Simple, transparent pricing
            </h2>
          <p className="mt-4 text-lg text-gray-600">
            Choose the plan that's right for your team. All plans include our core features.
            </p>
          </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 flex justify-center"
        >
          <div className="inline-flex items-center rounded-full bg-blue-50 p-1">
            <button
              onClick={() => setIsYearly(false)}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                !isYearly 
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                isYearly 
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Yearly
              <span className="ml-1 text-xs text-blue-600">Save 15%</span>
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-y-6 sm:gap-y-8 lg:mt-20 lg:max-w-none lg:grid-cols-4 lg:gap-x-8"
        >
          {pricingPlans.map((plan) => (
            <motion.div
              key={plan.name}
              whileHover={{ y: -5 }}
              className="group relative flex flex-col rounded-2xl bg-white p-8 shadow-sm ring-1 ring-blue-200 hover:shadow-xl transition-all duration-300"
            >
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${plan.color} opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none`}
              />
              <div className="flex items-center gap-x-4">
                <div
                  className={`h-10 w-10 rounded-lg bg-gradient-to-r ${plan.color} flex items-center justify-center shadow-lg`}
                >
                  <plan.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold leading-7 text-gray-900">
                  {plan.name}
                </h3>
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-600">
                {plan.description}
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                {plan.monthlyPrice === 0 ? (
                  <span className="text-4xl font-bold tracking-tight text-gray-900">Custom</span>
                ) : (
                  <>
                    <span className="text-4xl font-bold tracking-tight text-gray-900">
                      ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                    <span className="text-sm font-semibold leading-6 text-gray-600">
                      /month
                  </span>
                  </>
                )}
              </p>
              <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex gap-x-3">
                    <div className={`h-6 w-6 rounded-lg bg-gradient-to-r ${plan.color} flex items-center justify-center`}>
                      <Check className="h-4 w-4 text-white" />
              </div>
                    {feature}
                    </li>
                  ))}
              </ul>
              {plan.freeTrial ? (
                <Link
                  href="/signup"
                  className="block w-full"
                >
                  <Button variant="default" className="w-full">
                    Get started
                  </Button>
                </Link>
              ) : (
                <Link
                  href="/contact"
                  className={`relative z-10 mt-8 block w-full rounded-md bg-gradient-to-r ${plan.color} py-3 text-center font-semibold text-white hover:opacity-90`}
                >
                {plan.cta}
                </Link>
              )}
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
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