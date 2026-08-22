export const Fonts = {
  display: 'Fraunces_400Regular_Italic',
  displayMedium: 'Fraunces_500Medium',
  body: 'Outfit_400Regular',
  bodyMedium: 'Outfit_500Medium',
  bodySemiBold: 'Outfit_600SemiBold',
  bodyBold: 'Outfit_700Bold',
  chinese: undefined, // System fallback: PingFang SC on iOS, Noto Sans SC on Android
} as const;

export const FontSize = {
  xs: 11,
  sm: 12,
  base: 14,
  md: 15,
  lg: 16,
  xl: 18,
  '2xl': 22,
  '3xl': 28,
  '4xl': 36,
} as const;

/** Returns the correct font size for Chinese text (75–82% of EN counterpart) */
export function cnSize(enSize: number): number {
  return Math.round(enSize * 0.78);
}
