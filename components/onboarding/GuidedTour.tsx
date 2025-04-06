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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[90vw] max-w-4xl h-[90vh] max-h-[800px] overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold">Welcome to Klaralyze</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            {/* ... existing content ... */}
          </div>
          <div className="p-4 border-t">
            {/* ... existing buttons ... */}
          </div>
        </div>
      </div>
    </div>
  );
} 