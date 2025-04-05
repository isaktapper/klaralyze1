"use client";

import { motion } from "framer-motion";
import { Star, TrendingUp, Users, MessageSquare } from "lucide-react";

const testimonials = [
  {
    content: "The AI insights have transformed how we handle customer support. We've seen a significant improvement in our response times and customer satisfaction scores.",
    author: "Sarah Chen",
    role: "Customer Support Director",
    company: "TechCorp",
    image: "/testimonials/sarah.jpg",
    stars: 5,
    stats: {
      icon: TrendingUp,
      value: "↑88%",
      label: "Customer Satisfaction"
    }
  },
  {
    content: "The predictive analytics have helped us anticipate customer needs before they even reach out. It's like having a crystal ball for customer support.",
    author: "Michael Rodriguez",
    role: "Head of Support",
    company: "GrowthLabs",
    image: "/testimonials/michael.jpg",
    stars: 5,
    stats: {
      icon: Users,
      value: "↑45%",
      label: "Team Productivity"
    }
  },
  {
    content: "The automated insights save us hours of manual analysis. We can now focus on what really matters - providing excellent customer support.",
    author: "Emily Johnson",
    role: "Support Manager",
    company: "InnovateCo",
    image: "/testimonials/emily.jpg",
    stars: 5,
    stats: {
      icon: MessageSquare,
      value: "↑62%",
      label: "Response Time"
    }
  }
];

export function Testimonials() {
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
              <Star className="w-4 h-4 mr-2" />
              Customer Success Stories
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Trusted by Leading Support Teams
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            See how our platform has helped support teams improve their operations and deliver better customer experiences.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.author}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="flex flex-col justify-between rounded-2xl bg-white p-8 shadow-sm ring-1 ring-blue-200 hover:shadow-xl transition-all duration-300"
            >
              <div>
                <div className="flex items-center gap-x-4 mb-4">
                  <img
                    className="h-10 w-10 rounded-full bg-blue-50"
                    src={testimonial.image}
                    alt={testimonial.author}
                  />
                  <div>
                    <h3 className="text-lg font-semibold leading-7 tracking-tight text-gray-900">
                      {testimonial.author}
                    </h3>
                    <p className="text-sm leading-6 text-gray-600">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
                <p className="text-base leading-7 text-gray-600 mb-6">
                  {testimonial.content}
                </p>
                <div className="flex items-center gap-x-1 mb-6">
                  {[...Array(testimonial.stars)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-blue-500" />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-x-4 border-t border-blue-100 pt-6">
                <div className={`rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 p-2`}>
                  <testimonial.stats.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-gray-900">{testimonial.stats.value}</p>
                  <p className="text-sm text-gray-600">{testimonial.stats.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}