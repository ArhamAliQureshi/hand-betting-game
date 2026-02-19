import React, { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

export const CountUp: React.FC<{ value: number; duration?: number; testId?: string }> = ({ value, duration = 0.5, testId }) => {
  const spring = useSpring(value, { duration: duration * 1000, bounce: 0 });
  const display = useTransform(spring, (current) => Math.round(current));

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span data-testid={testId}>{display}</motion.span>;
};
