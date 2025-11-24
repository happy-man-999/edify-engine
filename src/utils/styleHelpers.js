// Style helpers to match design colors exactly
export const getBackgroundStyle = () => ({
  backgroundColor: 'oklch(0.12 0.02 280)'
});

export const getCardStyle = (opacity = 0.5) => ({
  backgroundColor: `oklch(0.18 0.05 285 / ${opacity})`
});

export const getPrimaryGradient = () => ({
  background: 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))'
});

export const getPrimaryGradientHover = () => ({
  background: 'linear-gradient(to right, oklch(0.45 0.15 290 / 0.9), oklch(0.50 0.18 260 / 0.9))'
});

export const getBorderStyle = (opacity = 0.5) => ({
  borderColor: `oklch(0.25 0.05 285 / ${opacity})`
});

export const getAccentStyle = (opacity = 1) => ({
  color: `oklch(0.85 0.18 130 / ${opacity})`
});

export const getAccentBgStyle = (opacity = 0.2) => ({
  backgroundColor: `oklch(0.85 0.18 130 / ${opacity})`
});

export const getAccentBorderStyle = (opacity = 0.5) => ({
  borderColor: `oklch(0.85 0.18 130 / ${opacity})`
});

