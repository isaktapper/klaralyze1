import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ChartBarIcon, ClockIcon, BoltIcon, SparklesIcon } from 'lucide-react';

interface OnboardingStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string; // We'll add illustrations/screenshots later
}

const steps: OnboardingStep[] = [
  {
    title: "Welcome to Klaralyze! 👋",
    description: "Let's take a quick tour to help you get the most out of your support analytics.",
    icon: <SparklesIcon className="w-6 h-6 text-blue-500" />,
    image: "/onboarding/welcome.svg"
  },
  {
    title: "Real-time Analytics",
    description: "Watch your support metrics update in real-time. Track response times, resolution rates, and team performance at a glance.",
    icon: <ChartBarIcon className="w-6 h-6 text-blue-500" />,
    image: "/onboarding/analytics.svg"
  },
  {
    title: "Smart Insights",
    description: "Our AI analyzes your support data to identify trends and provide actionable recommendations.",
    icon: <BoltIcon className="w-6 h-6 text-blue-500" />,
    image: "/onboarding/insights.svg"
  },
  {
    title: "Time-Saving Automations",
    description: "Set up automated workflows to handle routine tasks and let your team focus on what matters most.",
    icon: <ClockIcon className="w-6 h-6 text-blue-500" />,
    image: "/onboarding/automation.svg"
  }
];

export function OnboardingModal({ onClose }: { onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    // Save to localStorage that onboarding is complete
    localStorage.setItem('onboardingComplete', 'true');
    onClose();
  };

  const handleSkip = () => {
    setIsVisible(false);
    localStorage.setItem('onboardingComplete', 'true');
    onClose();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl"
          >
            <button
              onClick={handleSkip}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                {steps[currentStep].icon}
                <h2 className="text-xl font-semibold text-gray-900">
                  {steps[currentStep].title}
                </h2>
              </div>
              <p className="text-gray-600">
                {steps[currentStep].description}
              </p>
            </div>

            <div className="mt-8 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
              {/* Placeholder for step illustration/screenshot */}
              <p className="text-gray-400">Step illustration will go here</p>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <div className="flex space-x-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-8 rounded-full transition-colors ${
                      index === currentStep ? 'bg-[#026EE6]' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleSkip}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  Skip tour
                </button>
                <button
                  onClick={handleNext}
                  className="flex items-center space-x-2 rounded-lg bg-[#026EE6] px-6 py-2 text-sm font-medium text-white hover:bg-[#0256B4] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <span>{currentStep === steps.length - 1 ? 'Get started' : 'Next'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 