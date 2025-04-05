"use client";

import { motion } from "framer-motion";
import { StarIcon, Lightbulb, Brain, BadgeCheck, ChartBar, Bot } from "lucide-react";

const testimonials = [
  {
    content: "The AI insights were mind-blowing. We discovered a critical product issue affecting 12% of our customers that was completely invisible in our traditional reports. Fixed it in days and saw our NPS score jump by 18 points.",
    author: "Sarah Chen",
    role: "Head of Customer Success",
    company: "TechFlow",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=256",
    stars: 5,
    stats: {
      label: "Response Time",
      value: "↓45%",
      description: "decrease in avg. response time"
    },
    icon: ChartBar,
  },
  {
    content: "The sentiment analysis changed everything. Instead of guessing how customers felt, we knew exactly which features were causing frustration and which ones delighted users. Our product roadmap is now driven by actual customer emotions.",
    author: "Marcus Rodriguez",
    role: "Support Operations Manager",
    company: "CloudScale",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256",
    stars: 5,
    stats: {
      label: "Pain Points",
      value: "38",
      description: "issues identified by AI"
    },
    icon: Lightbulb,
  },
  {
    content: "The predictive analytics gave us superpowers. We can now anticipate support volume spikes 2 weeks in advance with 94% accuracy, allowing us to staff appropriately and maintain our response times even during peak periods.",
    author: "Emily Watson",
    role: "Customer Experience Director",
    company: "GrowthMate",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=256",
    stars: 5,
    stats: {
      label: "Forecast Accuracy",
      value: "94%",
      description: "for support volume prediction"
    },
    icon: Brain,
  },
  {
    content: "The neural network identified patterns across thousands of support tickets that revealed a major opportunity to improve our onboarding flow. After implementing changes, our activation rate increased by 23% and support tickets dropped by 35%.",
    author: "Alex Nguyen",
    role: "VP of Product",
    company: "InnovateIQ",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256",
    stars: 5,
    stats: {
      label: "Support Tickets",
      value: "↓35%",
      description: "reduction after AI insights"
    },
    icon: Bot,
  },
];

export function Testimonials() {
  return (
    <div className="py-24 sm:py-32 bg-gradient-to-b from-white to-slate-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div 
          className="mx-auto max-w-xl text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-3 rounded-full bg-purple-50 border border-purple-100">
            <span className="text-sm font-medium text-purple-700 flex items-center">
              <BadgeCheck className="w-4 h-4 mr-2" />
              AI Success Stories
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Teams achieving exceptional results
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            See how leading companies are transforming support operations with our AI-powered analytics
          </p>
        </motion.div>
        
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative overflow-hidden group rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200 hover:shadow-md transition-shadow duration-300"
            >
              <div className="absolute top-0 right-0 h-24 w-24 -translate-y-1/3 translate-x-1/3 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/30 blur-2xl"></div>
              
              <div className="flex mb-6 items-center gap-x-2">
                {[...Array(testimonial.stars)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              
              <blockquote className="text-lg leading-7 text-gray-800 mb-8">
                "{testimonial.content}"
              </blockquote>
              
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-x-4">
                  <img
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-white"
                    src={testimonial.image}
                    alt={testimonial.author}
                  />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.author}
                    </div>
                    <div className="text-sm leading-6 text-gray-600">
                      {testimonial.role} · {testimonial.company}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center p-3 rounded-lg bg-gradient-to-br from-purple-50 to-cyan-50 border border-purple-100/50">
                  <div className="mr-3 p-2 rounded-md bg-gradient-to-r from-purple-500 to-cyan-500">
                    <testimonial.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-900">{testimonial.stats.value}</div>
                    <div className="text-xs text-gray-600">{testimonial.stats.description}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          className="mt-16 flex flex-col gap-3 items-center justify-center text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-sm text-gray-600 max-w-xl">
            Join 500+ forward-thinking companies using AI to transform their support operations
          </p>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 mt-6 grayscale opacity-70">
            <div className="flex-none">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/320px-Microsoft_logo_%282012%29.svg.png" alt="Microsoft" className="h-7" />
            </div>
            <div className="flex-none">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/320px-Google_2015_logo.svg.png" alt="Google" className="h-7" />
            </div>
            <div className="flex-none">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/128px-Apple_logo_black.svg.png" alt="Apple" className="h-7" />
            </div>
            <div className="flex-none">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/320px-Amazon_logo.svg.png" alt="Amazon" className="h-7" />
            </div>
            <div className="flex-none">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Slack_Technologies_Logo.svg/320px-Slack_Technologies_Logo.svg.png" alt="Slack" className="h-7" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}