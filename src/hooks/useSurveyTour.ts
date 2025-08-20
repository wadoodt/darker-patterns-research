import { driver, type DriveStep } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useEffect, useState } from 'react';

// Simple device-based tour completion tracking
// No user ID needed - just track if tour has been completed on this device/browser
const TOUR_COMPLETED_KEY = 'survey_tour_completed';

// Check if tour has been completed on this device
const hasTourBeenCompleted = (): boolean => {
  try {
    return localStorage.getItem(TOUR_COMPLETED_KEY) === 'true';
  } catch {
    // If localStorage is not available, assume tour hasn't been completed
    if (process.env.NODE_ENV === 'development') {
      console.warn('localStorage not available, assuming tour not completed');
    }
    return false;
  }
};

// Mark tour as completed on this device
const markTourCompleted = (): void => {
  try {
    localStorage.setItem(TOUR_COMPLETED_KEY, 'true');
  } catch {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Could not save tour completion status to localStorage');
    }
  }
};

// Reset tour completion status (useful for testing)
const resetTourCompletion = (): void => {
  try {
    localStorage.removeItem(TOUR_COMPLETED_KEY);
  } catch {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Could not reset tour completion status in localStorage');
    }
  }
};

const createTourSteps = (): DriveStep[] => [
  {
    element: '.survey-page-container',
    popover: {
      title: 'Welcome to the Survey',
      description:
        'Explore the different sections of the screen. This will help you understand where to focus your attention during the task.',
    },
  },
  {
    element: '.entry-instruction-card',
    popover: {
      title: 'Task Instruction',
      description:
        'Read the instruction carefully. This tells you what task the AI responses are trying to accomplish.',
    },
  },
  {
    element: '.option-selection-container',
    popover: {
      title: 'Choose the Less Harmful Option',
      description:
        'Between the two options, choose the one that is less harmful. Read carefully and select the response you believe causes the least potential harm.',
    },
  },
  {
    element: '[data-tour="categories"]',
    popover: {
      title: 'Select Categories',
      description:
        'You can select one or more categories. These categories help us classify the type of content or issue the question relates to.',
    },
  },
  {
    element: '[data-tour="flag-button"]',
    popover: {
      title: 'Flag Problems',
      description:
        'If something feels off, click the Flag Entry button to report a problem. Use this to let us know if the question seems inappropriate, biased, or incorrect.',
    },
  },
  {
    element: '[data-tour="reveal-button"]',
    popover: {
      title: 'Compare with Researchers',
      description:
        'After making your choice and selecting categories, click this button to see how researchers evaluated the same content.',
    },
  },
  {
    element: '[data-tour="rating"]',
    popover: {
      title: 'Rate Your Confidence',
      description:
        'Next, indicate how confident you are in your choice. This helps us understand how sure you feel about your judgment.',
    },
  },
  {
    element: '[data-tour="comments"]',
    popover: {
      title: 'Optional Comments',
      description: 'You may also leave an optional comment. Feel free to share any thoughts, concerns, or feedback.',
    },
  },
  {
    element: '[data-tour="submit-button"]',
    popover: {
      title: 'Submit Your Evaluation',
      description:
        'After submitting your answers, you will see which response researchers believe is less harmful. This is only for comparison. If you disagree, that is totally fine - it may mean we made a mistake, and your input is helping us improve.',
    },
  },
  {
    popover: {
      title: 'Continue to Next Step',
      description: 'You can now proceed to the next step. Continue when you are ready. Thank you for participating!',
    },
  },
];

export const useSurveyTour = () => {
  const [tourInstance, setTourInstance] = useState<ReturnType<typeof driver> | null>(null);
  const [tourCompleted, setTourCompleted] = useState<boolean>(true); // Default to true to avoid flash

  // Initialize tour completion status
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTourCompleted(hasTourBeenCompleted());
    }
  }, []);

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return;

    const driverInstance = driver({
      showProgress: true,
      nextBtnText: 'Next',
      prevBtnText: 'Previous',
      doneBtnText: 'Got it!',
      progressText: 'Step {{current}} of {{total}}',
      steps: createTourSteps(),
      onDestroyed: () => {
        // Mark tour as completed when user finishes or skips it
        markTourCompleted();
        setTourCompleted(true);
      },
    });

    setTourInstance(driverInstance);

    return () => {
      driverInstance.destroy();
    };
  }, []);

  const shouldShowTour = !tourCompleted;

  const startTour = () => {
    if (!tourInstance) return;

    if (shouldShowTour) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Starting survey tour');
      }
      tourInstance.drive();
    } else {
      // Show confirmation if tour was already completed
      const confirmed = window.confirm('You have already completed the tour. Would you like to see it again?');
      if (confirmed) {
        tourInstance.drive();
      }
    }
  };

  const skipTour = () => {
    if (tourInstance) {
      tourInstance.destroy();
      markTourCompleted();
      setTourCompleted(true);
    }
  };

  const resetTourForCurrentDevice = () => {
    resetTourCompletion();
    setTourCompleted(false);
    if (process.env.NODE_ENV === 'development') {
      console.warn('Tour has been reset for this device');
    }
  };

  return {
    startTour,
    skipTour,
    shouldShowTour,
    resetTourForCurrentDevice,
  };
};
