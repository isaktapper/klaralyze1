"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Zap, 
  ArrowLeft,
  Check,
  Minus,
  Sparkles,
  Tag,
  Brain,
  BarChart,
  Clock,
  Users,
  Shield,
  Settings,
  Database,
  Rocket
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

type PlanValue = string | boolean;
type PlanName = "starter" | "growth" | "professional" | "enterprise";

interface Feature {
  name: string;
  description: string;
  icon: any;
  plans: Record<PlanName, PlanValue>;
}

interface Plan {
  name: string;
  price: number;
  yearlyPrice: number;
  color: string;
  icon: any;
  description: string;
  popular?: boolean;
}

const features: Feature[] = [
  {
    name: "Tickets",
    description: "Monthly ticket processing capacity",
    icon: Tag,
    plans: {
      starter: "100",
      growth: "500",
      professional: "2000",
      enterprise: "Unlimited"
    }
  },
  {
    name: "Template Dashboards",
    description: "Pre-built analytics dashboards",
    icon: BarChart,
    plans: {
      starter: true,
      growth: true,
      professional: true,
      enterprise: true
    }
  },
  {
    name: "Custom Dashboards",
    description: "Create and customize your own dashboards",
    icon: Settings,
    plans: {
      starter: false,
      growth: false,
      professional: true,
      enterprise: true
    }
  },
  {
    name: "Smart Tagging",
    description: "AI-powered ticket categorization",
    icon: Tag,
    plans: {
      starter: true,
      growth: true,
      professional: true,
      enterprise: true
    }
  },
  {
    name: "AI Insights",
    description: "Advanced analytics and predictions",
    icon: Brain,
    plans: {
      starter: false,
      growth: true,
      professional: true,
      enterprise: true
    }
  },
  {
    name: "Recommendations",
    description: "AI-powered suggestions for improvement",
    icon: Sparkles,
    plans: {
      starter: false,
      growth: false,
      professional: true,
      enterprise: true
    }
  },
  {
    name: "Team Members",
    description: "Number of user seats included",
    icon: Users,
    plans: {
      starter: "1",
      growth: "2",
      professional: "5",
      enterprise: "Unlimited"
    }
  },
  {
    name: "Data Refresh Rate",
    description: "How often data is updated",
    icon: Clock,
    plans: {
      starter: "Manual",
      growth: "Daily",
      professional: "Hourly",
      enterprise: "Instant"
    }
  },
  {
    name: "Anomaly Alerts",
    description: "Automated issue detection",
    icon: Shield,
    plans: {
      starter: false,
      growth: false,
      professional: true,
      enterprise: true
    }
  },
  {
    name: "Data Sources",
    description: "Number of integrations allowed",
    icon: Database,
    plans: {
      starter: "1",
      growth: "2",
      professional: "5",
      enterprise: "Unlimited"
    }
  },
  {
    name: "Custom Reports",
    description: "Create and schedule custom reports",
    icon: BarChart,
    plans: {
      starter: false,
      growth: true,
      professional: true,
      enterprise: true
    }
  },
  {
    name: "API Access",
    description: "Programmatic access to your data",
    icon: Settings,
    plans: {
      starter: false,
      growth: true,
      professional: true,
      enterprise: true
    }
  },
  {
    name: "Data Retention",
    description: "How long historical data is stored",
    icon: Database,
    plans: {
      starter: "30 days",
      growth: "90 days",
      professional: "1 year",
      enterprise: "Custom"
    }
  },
  {
    name: "Priority Support",
    description: "Enhanced support response times",
    icon: Users,
    plans: {
      starter: false,
      growth: false,
      professional: true,
      enterprise: true
    }
  },
  {
    name: "White Labeling",
    description: "Custom branding options",
    icon: Settings,
    plans: {
      starter: false,
      growth: false,
      professional: true,
      enterprise: true
    }
  }
];

const plans: Plan[] = [
  {
    name: "Starter",
    price: 29,
    yearlyPrice: 25,
    color: "from-blue-500 to-blue-600",
    icon: Sparkles,
    description: "Perfect for small teams getting started"
  },
  {
    name: "Growth",
    price: 59,
    yearlyPrice: 50,
    color: "from-blue-600 to-blue-700",
    icon: Zap,
    popular: true,
    description: "For growing teams that need more power"
  },
  {
    name: "Professional",
    price: 119,
    yearlyPrice: 101,
    color: "from-blue-700 to-blue-800",
    icon: Rocket,
    description: "Advanced features for professional teams"
  },
  {
    name: "Enterprise",
    price: 0,
    yearlyPrice: 0,
    color: "from-indigo-600 to-indigo-700",
    icon: Rocket,
    description: "Custom solutions for large organizations"
  }
];

export default function FeaturesPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  const renderValue = (value: PlanValue) => {
    if (typeof value === "boolean") {
      return value ? (
        <div className="flex justify-center">
          <div className="h-6 w-6 rounded-full bg-blue-500/10 flex items-center justify-center">
            <Check className="h-4 w-4 text-blue-500" />
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
            <Minus className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      );
    }
    return <div className="text-sm font-medium text-gray-900">{value}</div>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
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
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center pt-16 pb-8"
        >
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-3 rounded-full bg-blue-50 border border-blue-100">
            <span className="text-sm font-medium text-blue-700 flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              Feature Comparison
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Compare All Features
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            See how our plans stack up against each other
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
          className="mt-8 mb-16"
        >
          <div className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-blue-100 bg-blue-50/50">
                    <th className="py-4 px-8 text-left min-w-[300px]">
                      <div className="text-base font-semibold text-gray-900">Features & Details</div>
                    </th>
                    {plans.map((plan) => (
                      <th key={plan.name} className="py-4 px-6 text-center min-w-[200px]">
                        <div className={cn(
                          "rounded-lg bg-gradient-to-r p-4 text-white",
                          plan.color,
                          plan.popular && 'ring-2 ring-blue-500 ring-offset-2'
                        )}>
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <plan.icon className="h-5 w-5" />
                            <div className="text-sm font-medium">{plan.name}</div>
                          </div>
                          <div className="text-2xl font-bold">
                            {plan.price === 0 ? (
                              "Custom"
                            ) : (
                              <>
                                ${isYearly ? plan.yearlyPrice : plan.price}
                                <span className="text-sm font-normal">/mo</span>
                              </>
                            )}
                          </div>
                          <div className="mt-1 text-xs opacity-90">{plan.description}</div>
                          <Link
                            href={plan.name === "Enterprise" ? "/contact" : "/register"}
                            className="mt-4 block rounded-lg bg-white/10 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-white/20"
                          >
                            {plan.price === 0 ? "Contact Sales" : "Start Free Trial"}
                          </Link>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {features.map((feature) => (
                    <tr key={feature.name} className="hover:bg-blue-50/50 transition-colors">
                      <td className="py-4 px-8">
                        <div>
                          <div className="font-medium text-gray-900">{feature.name}</div>
                          <div className="text-sm text-gray-500">{feature.description}</div>
                        </div>
                      </td>
                      {plans.map((plan) => (
                        <td key={`${plan.name}-${feature.name}`} className="py-4 px-6 text-center">
                          {renderValue(feature.plans[plan.name.toLowerCase() as PlanName])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Contact Sales Module */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center py-16"
        >
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Have questions about our features?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Our sales team is here to help you find the perfect plan for your needs.
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Contact Sales
              <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
            </Link>
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white">
          <div className="py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-900">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-900">
                  Terms of Service
                </Link>
              </div>
              <div className="text-sm text-gray-500">
                © {new Date().getFullYear()} Klaralyze. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
} 