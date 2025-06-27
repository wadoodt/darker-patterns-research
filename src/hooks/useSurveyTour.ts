import { driver, type DriveStep } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useEffect, useState } from 'react';

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

  useEffect(() => {
    const driverInstance = driver({
      showProgress: true,
      nextBtnText: 'Next',
      prevBtnText: 'Previous',
      doneBtnText: 'Got it!',
      progressText: 'Step {{current}} of {{total}}',
      steps: createTourSteps(),
    });

    setTourInstance(driverInstance);

    return () => {
      driverInstance.destroy();
    };
  }, []);

  const startTour = () => {
    if (tourInstance) {
      tourInstance.drive();
    }
  };

  const skipTour = () => {
    if (tourInstance) {
      tourInstance.destroy();
    }
  };

  return { startTour, skipTour };
};
