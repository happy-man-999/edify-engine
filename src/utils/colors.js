// Design color palette - matching design/src/index.css exactly
export const colors = {
  background: 'oklch(0.12 0.02 280)',
  foreground: 'oklch(0.98 0.01 280)',
  card: 'oklch(0.18 0.05 285)',
  cardForeground: 'oklch(0.98 0.01 280)',
  primary: 'oklch(0.45 0.15 290)',
  primaryForeground: 'oklch(1 0 0)',
  secondary: 'oklch(0.50 0.18 260)',
  secondaryForeground: 'oklch(1 0 0)',
  muted: 'oklch(0.25 0.04 285)',
  mutedForeground: 'oklch(0.65 0.05 280)',
  accent: 'oklch(0.85 0.18 130)',
  accentForeground: 'oklch(0.12 0.02 280)',
  border: 'oklch(0.25 0.05 285)',
  ring: 'oklch(0.70 0.12 240)',
};

// Tailwind-compatible classes using arbitrary values
export const colorClasses = {
  bg: `bg-[${colors.background}]`,
  bgCard: `bg-[${colors.card}]`,
  bgPrimary: `bg-[${colors.primary}]`,
  bgSecondary: `bg-[${colors.secondary}]`,
  bgAccent: `bg-[${colors.accent}]`,
  textForeground: `text-[${colors.foreground}]`,
  textMuted: `text-[${colors.mutedForeground}]`,
  border: `border-[${colors.border}]`,
};

