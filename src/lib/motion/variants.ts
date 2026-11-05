export const TRANSITION_EASE = [0.22, 1, 0.36, 1] as const;

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: TRANSITION_EASE,
    },
  },
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: TRANSITION_EASE,
    },
  },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

export const headlineLine = {
  hidden: { y: "100%", opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.9,
      ease: TRANSITION_EASE,
    },
  },
};

export const svgDraw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.4, ease: TRANSITION_EASE },
      opacity: { duration: 0.4 },
    },
  },
};

export const cardHover = {
  rest: { y: 0, borderColor: "var(--line)" },
  hover: {
    y: -2,
    borderColor: "var(--line-strong)",
    transition: { duration: 0.2, ease: TRANSITION_EASE },
  },
};

