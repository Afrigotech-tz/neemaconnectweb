import { Variants } from 'framer-motion';

// Entrance animations
export const fadeInUp: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export const fadeInDown: Variants = {
  initial: {
    opacity: 0,
    y: -20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export const fadeInLeft: Variants = {
  initial: {
    opacity: 0,
    x: -20,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export const fadeInRight: Variants = {
  initial: {
    opacity: 0,
    x: 20,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export const scaleIn: Variants = {
  initial: {
    opacity: 0,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Hover animations
export const hoverScale: Variants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  },
};

export const hoverLift: Variants = {
  hover: {
    y: -5,
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  },
};

// Tap animations
export const tapScale: Variants = {
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
      ease: 'easeInOut',
    },
  },
};

// Page transitions
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
};

// Card animations
export const cardHover: Variants = {
  initial: {
    y: 0,
  },
  hover: {
    y: -8,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

// Button animations
export const buttonHover: Variants = {
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
      ease: 'easeInOut',
    },
  },
};

// List item animations
export const listItem: Variants = {
  initial: {
    opacity: 0,
    x: -20,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

export const listContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Modal animations
export const modalBackdrop: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

export const modalContent: Variants = {
  initial: {
    opacity: 0,
    scale: 0.8,
    y: 20,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 20,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

// Loading animations
export const pulse: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const spin: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// Text animations
export const textReveal: Variants = {
  initial: {
    y: '100%',
  },
  animate: {
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export const textContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};
