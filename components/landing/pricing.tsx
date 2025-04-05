"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Minus, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";

// Define types for better type checking
type FeatureId = string;
type Plan = {
  name: string;
  description: string;
  monthlyPrice: string;
  yearlyPrice: string;
  period: string;
  // Card features - displayed in the pricing cards
  cardFeatures: Record<FeatureId, string>;
  // Table features - displayed in the comparison table
  tableFeatures: Record<FeatureId, string>;
  featureIncluded?: Record<FeatureId, boolean>;
  cta: string;
  popular: boolean;
  freeTrial?: boolean;
};

const featureNames = [
  { id: "tickets", name: "Tickets/month", important: true },
  { id: "insights", name: "Insights", important: true },
  { id: "dashboards", name: "Dashboards", important: true },
  { id: "datasources", name: "Data sources", important: true },
  { id: "analytics", name: "Support analytics" },
  { id: "integration", name: "Integration" },
  { id: "refresh", name: "Refresh rate" },
  { id: "retention", name: "Data retention" },
  { id: "team", name: "Additional users" },
  { id: "api", name: "API access" },
  { id: "custom", name: "Custom integrations" },
  { id: "advanced", name: "Advanced analytics" },
  { id: "sso", name: "SSO & advanced security" }
];

const pricingPlans: Plan[] = [
  {
    name: "Growth",
    description: "Built for lean teams scaling fast",
    monthlyPrice: "$49",
    yearlyPrice: "$39",
    period: "/month",
    // These features are displayed in the pricing cards
    cardFeatures: {
      tickets: "500 tickets/month",
      insights: "Standard insights",
      dashboards: "Template dashboards",
      datasources: "1 data source"
    },
    // These features are displayed in the detailed comparison table
    tableFeatures: {
      tickets: "500",
      insights: "Standard",
      dashboards: "Template dashboards",
      datasources: "1 data source",
      analytics: "Yes",
      integration: "3 integrations",
      refresh: "Daily",
      retention: "30 days",
      team: "$15/user/month",
      api: "Yes",
      custom: "—",
      advanced: "—",
      sso: "—"
    },
    featureIncluded: {
      custom: false,
      advanced: false,
      sso: false
    },
    cta: "Start 14-Day Free Trial",
    popular: false,
    freeTrial: true,
  },
  {
    name: "Professional",
    description: "Power and flexibility for growing businesses",
    monthlyPrice: "$99",
    yearlyPrice: "$79",
    period: "/month",
    // These features are displayed in the pricing cards
    cardFeatures: {
      tickets: "2000 tickets/month",
      insights: "Advanced insights",
      dashboards: "Custom dashboards",
      datasources: "Up to 5 data sources"
    },
    // These features are displayed in the detailed comparison table
    tableFeatures: {
      tickets: "2,000",
      insights: "Advanced insights",
      dashboards: "Custom dashboards",
      datasources: "Up to 5 data sources",
      analytics: "Yes",
      integration: "10 integrations",
      refresh: "Hourly",
      retention: "90 days",
      team: "$10/user/month",
      api: "Yes",
      custom: "—",
      advanced: "Yes",
      sso: "—"
    },
    featureIncluded: {
      custom: false,
      sso: false
    },
    cta: "Start 14-Day Free Trial",
    popular: true,
    freeTrial: true,
  },
  {
    name: "Enterprise",
    description: "Tailored for complex, high-volume support ops",
    monthlyPrice: "Custom",
    yearlyPrice: "Custom",
    period: "",
    // These features are displayed in the pricing cards
    cardFeatures: {
      tickets: "Unlimited tickets/month",
      insights: "Advanced insights",
      dashboards: "Custom dashboards",
      datasources: "Unlimited data sources"
    },
    // These features are displayed in the detailed comparison table
    tableFeatures: {
      tickets: "Unlimited",
      insights: "Advanced insights",
      dashboards: "Custom dashboards",
      datasources: "Unlimited data sources",
      analytics: "Yes",
      integration: "Unlimited",
      refresh: "Instant",
      retention: "Unlimited",
      team: "Volume discount",
      api: "Yes",
      custom: "Yes",
      advanced: "Yes",
      sso: "Yes"
    },
    featureIncluded: {},
    cta: "Contact Sales",
    popular: false,
    freeTrial: false,
  },
];

export function Pricing() {
  const [isYearly, setIsYearly] = useState(false);
  const [showFullComparison, setShowFullComparison] = useState(false);

  const renderFeatureValue = (plan: Plan, featureId: FeatureId) => {
    // For the card display
    if (plan.featureIncluded && plan.featureIncluded[featureId] === false) {
      return (
        <Minus className={`h-4 w-4 mr-2 mt-0.5 flex-shrink-0 ${plan.popular ? 'text-blue-200' : 'text-slate-400'}`} />
      );
    }
    return (
      <Check className={`h-4 w-4 mr-2 mt-0.5 flex-shrink-0 ${plan.popular ? 'text-blue-200' : 'text-emerald-500'}`} />
    );
  };

  const renderTableValue = (plan: Plan, featureId: FeatureId) => {
    // For the table display
    if (plan.featureIncluded && plan.featureIncluded[featureId] === false) {
      return <Minus className="h-4 w-4 mx-auto text-slate-400" />;
    } 
    
    if (plan.tableFeatures[featureId] === "Yes") {
      return <Check className="h-5 w-5 mx-auto text-emerald-500" />;
    } 
    
    return <span>{plan.tableFeatures[featureId]}</span>;
  };

  return (
    <section className="py-20 bg-slate-50">
      <div className="container px-4 mx-auto">
        <div className="max-w-2xl mx-auto mb-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-2 text-lg text-slate-600">
              Choose the plan that's right for your business
            </p>
          </motion.div>
        </div>

        <div className="flex justify-center mb-8">
          <div className="bg-slate-900 p-1 rounded-full inline-flex items-center">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2 text-sm font-medium rounded-full transition-all ${
                !isYearly 
                  ? 'bg-white text-slate-900 shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              MONTHLY
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2 text-sm font-medium rounded-full transition-all ${
                isYearly 
                  ? 'bg-white text-slate-900 shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              YEARLY (SAVE 20%)
            </button>
          </div>
        </div>

        <div className="grid max-w-screen-lg gap-8 mx-auto md:grid-cols-3">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`flex flex-col p-6 rounded-2xl shadow-lg ${
                plan.popular
                  ? 'bg-gradient-to-tr from-blue-500 to-cyan-500 text-white relative border-2 border-blue-500 scale-105 z-10'
                  : 'bg-white border border-slate-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-medium px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <div className="mb-4">
                <h3 className={`text-2xl font-bold ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                  {plan.name}
                </h3>
                <p className={`mt-1 text-sm ${plan.popular ? 'text-blue-100' : 'text-slate-600'}`}>
                  {plan.description}
                </p>
              </div>
              <div className="flex flex-col mb-5 h-24">
                <div className="flex items-end">
                  <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                    {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  <span className={`text-sm ml-1 mb-1 ${plan.popular ? 'text-blue-100' : 'text-slate-600'}`}>
                    {plan.period}
                  </span>
                </div>
                {plan.freeTrial && (
                  <div className={`mt-2 text-sm ${plan.popular ? 'text-blue-100' : 'text-emerald-600'}`}>
                    Includes 14-day free trial, no credit card required
                  </div>
                )}
              </div>

              <ul className="mb-6 space-y-3 flex-1">
                {featureNames
                  .filter(feature => feature.important)
                  .map((feature) => (
                    <li key={feature.id} className="flex items-start">
                      {renderFeatureValue(plan, feature.id)}
                      <span className={`text-sm ${plan.popular ? 'text-blue-100' : 'text-slate-700'}`}>
                        {plan.cardFeatures[feature.id]}
                      </span>
                    </li>
                  ))}
              </ul>

              <Button 
                className={`mt-auto ${
                  plan.popular 
                    ? 'bg-white text-blue-600 hover:bg-blue-50 shadow-lg shadow-blue-500/30' 
                    : plan.name === 'Enterprise' 
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
                size={plan.popular ? "lg" : "default"}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <button 
            onClick={() => setShowFullComparison(!showFullComparison)}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            {showFullComparison ? "Hide full comparison" : "Show full comparison"}
            {showFullComparison ? (
              <ChevronUp className="ml-1 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-1 h-4 w-4" />
            )}
          </button>
        </div>

        {showFullComparison && (
          <div className="mt-8 max-w-screen-lg mx-auto">
            <div className="bg-white rounded-xl shadow-md border border-slate-200">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="p-4 text-left text-slate-700 font-medium">Feature</th>
                      {pricingPlans.map(plan => (
                        <th key={plan.name} className="p-4 text-center text-slate-700 font-medium">
                          {plan.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {featureNames.map(feature => (
                      <tr key={feature.id} className="border-b border-slate-200 hover:bg-slate-50">
                        <td className="p-4 text-left text-slate-700 font-medium">
                          {feature.name}
                        </td>
                        {pricingPlans.map(plan => (
                          <td key={`${plan.name}-${feature.id}`} className="p-4 text-center text-slate-600">
                            {renderTableValue(plan, feature.id)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            All prices shown are in USD. Need a custom plan?{' '}
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
              Contact our sales team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}