import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, SparklesIcon } from 'lucide-react';

interface TourStep {
  target?: string;  // CSS selector for the target element, optional for intro step
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  spotlightPadding?: number;
}

const tourSteps: TourStep[] = [
  {
    title: "Welcome to Klaralyze! 👋",
    description: "Let's take a quick tour of your new analytics dashboard.",
    position: "center",
  },
  {
    title: "Navigation",
    description: "Access key features from this menu. We'll keep it open during the tour to show you around.",
    target: "[data-tour='nav']",
    position: "right",
    spotlightPadding: 8,
  },
  {
    title: "Overview Dashboard",
    description: "Get a quick snapshot of your key metrics and performance indicators.",
    target: "[data-tour='overview']",
    position: "right",
  },
  {
    title: "Custom Dashboards",
    description: "Create and customize dashboards to track the metrics that matter most to you.",
    target: "[data-tour='dashboards']",
    position: "right",
  },
  {
    title: "AI-Powered Insights",
    description: "Get intelligent recommendations and trend analysis powered by AI.",
    target: "[data-tour='insights']",
    position: "right",
  }
];

export function GuidedTour({ onClose, onGuidingChange }: { onClose: () => void, onGuidingChange: (isGuiding: boolean) => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<DOMRect | null>(null);

  useEffect(() => {
    // Start guiding when tour starts
    onGuidingChange(true);
    return () => {
      // Stop guiding when tour ends
      onGuidingChange(false);
    };
  }, []);

  useEffect(() => {
    updateTargetElement();
    window.addEventListener('resize', updateTargetElement);
    window.addEventListener('scroll', updateTargetElement);
    return () => {
      window.removeEventListener('resize', updateTargetElement);
      window.removeEventListener('scroll', updateTargetElement);
    };
  }, [currentStep]);

  const updateTargetElement = () => {
    const step = tourSteps[currentStep];
    if (!step.target) {
      setTargetElement(null);
      return;
    }

    const element = document.querySelector(step.target);
    if (element) {
      const rect = element.getBoundingClientRect();
      setTargetElement(rect);
      
      // Scroll element into view if needed
      if (rect.top < 0 || rect.bottom > window.innerHeight) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem('onboardingComplete', 'true');
    onClose();
  };

  const handleSkip = () => {
    localStorage.setItem('onboardingComplete', 'true');
    onClose();
  };

  const getTooltipPosition = () => {
    const step = tourSteps[currentStep];
    
    if (step.position === 'center' || !targetElement) {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      };
    }

    const padding = 12; // Space between target and tooltip
    const windowPadding = 20; // Minimum space from window edge

    let position = {
      top: 0,
      left: 0
    };

    switch (step.position) {
      case 'top':
        position = {
          top: Math.max(windowPadding, targetElement.top - padding - 120),
          left: targetElement.left + (targetElement.width / 2) - 150
        };
        break;
      case 'bottom':
        position = {
          top: Math.min(window.innerHeight - 200, targetElement.bottom + padding),
          left: targetElement.left + (targetElement.width / 2) - 150
        };
        break;
      case 'left':
        position = {
          top: targetElement.top + (targetElement.height / 2) - 60,
          left: Math.max(windowPadding, targetElement.left - padding - 300)
        };
        break;
      case 'right':
        position = {
          top: targetElement.top + (targetElement.height / 2) - 60,
          left: Math.min(window.innerWidth - 320, targetElement.right + padding)
        };
        break;
    }

    // Ensure tooltip stays within viewport
    position.left = Math.max(windowPadding, Math.min(window.innerWidth - 320, position.left));
    position.top = Math.max(windowPadding, Math.min(window.innerHeight - 200, position.top));

    return position;
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Semi-transparent overlay with spotlight */}
      <div 
        className="absolute inset-0 bg-black/60 transition-opacity duration-300"
        onClick={handleSkip}
      >
        {targetElement && (
          <div
            className="absolute bg-transparent"
            style={{
              top: targetElement.top - 8,
              left: targetElement.left - 8,
              width: targetElement.width + 16,
              height: targetElement.height + 16,
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.75), 0 0 15px rgba(2, 110, 230, 0.5)',
              borderRadius: '8px',
              border: '2px solid #026EE6'
            }}
          />
        )}
      </div>

      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="absolute w-[300px] rounded-xl bg-white p-4 shadow-xl"
        style={getTooltipPosition()}
      >
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            {currentStep === 0 && <SparklesIcon className="w-5 h-5 text-[#026EE6]" />}
            {tourSteps[currentStep].title}
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            {tourSteps[currentStep].description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 w-6 rounded-full transition-colors ${
                  index === currentStep ? 'bg-[#026EE6]' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleSkip}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Skip
            </button>
            <button
              onClick={handleNext}
              className="flex items-center space-x-2 rounded-lg bg-[#026EE6] px-4 py-1.5 text-sm font-medium text-white hover:bg-[#0256B4]"
            >
              <span>{currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 