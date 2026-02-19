import type { Variants, Transition } from 'framer-motion';

// --- Configuration ---

// Spring configuration for bounce/snap effects
const springTransition: Transition = { 
  type: 'spring',
  stiffness: 400,
  damping: 25,
};

// --- Variants ---

// 1. Tile Deal Animation
// Staggered entry from slightly below and faded out
export const listContainerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Delay between each tile
      delayChildren: 0.2,   // Wait before starting
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  }
};

export const tileItemVariants: Variants = {
  hidden: { y: 20, opacity: 0, scale: 0.8 },
  show: { 
    y: 0, 
    opacity: 1, 
    scale: 1,
    transition: springTransition 
  },
  exit: { opacity: 0, scale: 0.5, transition: { duration: 0.1 } }
};

// 2. Banner Slide (Outcome / Game Over)
export const bannerVariants: Variants = {
  hidden: { y: -50, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 20 }
  },
  exit: { y: -20, opacity: 0, transition: { duration: 0.2 } }
};

// 3. History Entry
// New items slide down from top (if prepended) or appear
export const historyItemVariants: Variants = {
  hidden: { width: 0, opacity: 0, x: -20 },
  visible: { 
    width: 'auto', 
    opacity: 1, 
    x: 0,
    transition: { type: 'spring', stiffness: 500, damping: 30 }
  },
  exit: { opacity: 0, scale: 0, transition: { duration: 0.2 } }
};

// 4. Value Flip (for Dragon/Wind dynamic updates)
// Rotates partially to simulate update
export const valueUpdateVariants: Variants = {
  initial: { rotateX: 0 },
  update: { 
    rotateX: [0, 90, 0], // Flip effect
    transition: { duration: 0.4 }
  }
};

// 5. Button Press (Tactile)
export const buttonTap = { scale: 0.95 };
export const buttonHover = { scale: 1.05, filter: 'brightness(1.1)' };

// --- Reduced Motion Helper ---
// In Framer Motion, we typically use the `useReducedMotion` hook in components
// and conditionally swap variants or transition props. 
// However, defining a "reduced" set here is also a valid pattern.

export const reducedMotionTransition = { duration: 0.1, ease: 'linear' };
