"use client";

import { useState, useEffect } from 'react';
import Joyride, { Step, ACTIONS, EVENTS, STATUS } from 'react-joyride';
import { useAuth } from '@/lib/auth';

interface GuidedTourProps {
  onClose: () => void;
  onGuidingChange: (isGuiding: boolean) => void;
}

const tourSteps: Step[] = [
  {
    target: 'body',
    content: (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">Welcome to Klaralyze! 👋</h2>
        <p className="text-gray-600">
          Let's take a quick tour of your new analytics dashboard. We'll show you how to get the most out of Klaralyze.
        </p>
      </div>
    ),
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '[data-tour="nav"]',
    content: (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Navigation Menu</h3>
        <p className="text-gray-600">
          Access all your key features from this menu. We'll keep it expanded during the tour to show you around.
        </p>
      </div>
    ),
    placement: 'right',
  },
  {
    target: '[data-tour="overview"]',
    content: (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Overview Dashboard</h3>
        <p className="text-gray-600">
          Get a quick snapshot of your support metrics, including response times, satisfaction scores, and ticket volumes.
        </p>
      </div>
    ),
    placement: 'right',
  },
  {
    target: '[data-tour="dashboards"]',
    content: (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Custom Dashboards</h3>
        <p className="text-gray-600">
          Create and customize dashboards to track the metrics that matter most to your team.
        </p>
      </div>
    ),
    placement: 'right',
  },
  {
    target: '[data-tour="insights"]',
    content: (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">AI-Powered Insights</h3>
        <p className="text-gray-600">
          Get intelligent recommendations and trend analysis powered by our AI engine.
        </p>
      </div>
    ),
    placement: 'right',
  }
];

export function GuidedTour({ onClose, onGuidingChange }: GuidedTourProps) {
  const [run, setRun] = useState(true);
  const { user } = useAuth();

  const handleJoyrideCallback = (data: any) => {
    const { action, index, status, type } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false);
      onClose();
    } else if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      onGuidingChange(true);
    }
  };

  return (
    <Joyride
      callback={handleJoyrideCallback}
      continuous
      hideCloseButton
      run={run}
      scrollToFirstStep
      showProgress
      showSkipButton
      steps={tourSteps}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: '#4F46E5',
          backgroundColor: '#ffffff',
          textColor: '#1F2937',
          arrowColor: '#ffffff',
        },
        tooltip: {
          padding: 0,
        },
        buttonNext: {
          backgroundColor: '#4F46E5',
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: 500,
        },
        buttonBack: {
          marginRight: 10,
          color: '#4F46E5',
        },
        buttonSkip: {
          color: '#6B7280',
        },
      }}
    />
  );
} 