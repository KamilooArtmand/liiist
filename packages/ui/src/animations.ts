import { Variants } from 'framer-motion';

/**
 * ==============================================================
 * LIIIST SPRING PHYSICS (Zero-Latency Fluidity)
 * ==============================================================
 * We NEVER use linear or standard ease-in-out easing curves.
 * ONLY precision-tuned Spring physics for 120hz hardware acceleration.
 */

// Snappy, highly responsive spring for micro-interactions (hover, tap)
export const microSpring = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
  mass: 1,
  restDelta: 0.001,
};

// Fluid, slightly more relaxed spring for layout transitions (modal expansions)
export const layoutSpring = {
  type: 'spring',
  stiffness: 300,
  damping: 35,
  mass: 1.2,
  restDelta: 0.001,
};

// Bouncy spring for playful but professional elements (toasts, badges)
export const bounceSpring = {
  type: 'spring',
  stiffness: 500,
  damping: 25,
  mass: 0.8,
};

/**
 * ==============================================================
 * STAGGERED ENTRANCE ANIMATIONS (Infinite Cascades)
 * ==============================================================
 */

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // Cascading delay
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { 
    opacity: 0, 
    y: 40,
    scale: 0.98
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: layoutSpring,
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: microSpring,
  }
};
