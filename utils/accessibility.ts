/**
 * Converts a hex color to RGB values
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  // Remove the # if present
  hex = hex.replace(/^#/, "")

  // Parse the hex values
  let r, g, b
  if (hex.length === 3) {
    r = Number.parseInt(hex[0] + hex[0], 16)
    g = Number.parseInt(hex[1] + hex[1], 16)
    b = Number.parseInt(hex[2] + hex[2], 16)
  } else {
    r = Number.parseInt(hex.substring(0, 2), 16)
    g = Number.parseInt(hex.substring(2, 4), 16)
    b = Number.parseInt(hex.substring(4, 6), 16)
  }

  return { r, g, b }
}

/**
 * Calculates the relative luminance of a color
 * Formula: https://www.w3.org/TR/WCAG20/#relativeluminancedef
 */
export function getLuminance(color: { r: number; g: number; b: number }): number {
  const { r, g, b } = color

  // Convert RGB to sRGB
  const sR = r / 255
  const sG = g / 255
  const sB = b / 255

  // Calculate luminance
  const R = sR <= 0.03928 ? sR / 12.92 : Math.pow((sR + 0.055) / 1.055, 2.4)
  const G = sG <= 0.03928 ? sG / 12.92 : Math.pow((sG + 0.055) / 1.055, 2.4)
  const B = sB <= 0.03928 ? sB / 12.92 : Math.pow((sB + 0.055) / 1.055, 2.4)

  return 0.2126 * R + 0.7152 * G + 0.0722 * B
}

/**
 * Calculates the contrast ratio between two colors
 * Formula: https://www.w3.org/TR/WCAG20/#contrast-ratiodef
 */
export function getContrastRatio(color1: string, color2: string): number {
  const luminance1 = getLuminance(hexToRgb(color1))
  const luminance2 = getLuminance(hexToRgb(color2))

  // Ensure the lighter color is always the first one
  const lighter = Math.max(luminance1, luminance2)
  const darker = Math.min(luminance1, luminance2)

  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Checks if a color combination meets WCAG contrast requirements
 * @param foreground The text color
 * @param background The background color
 * @param level 'AA' or 'AAA'
 * @param isLargeText Whether the text is large (>=18pt or >=14pt bold)
 * @returns Whether the contrast meets the requirements
 */
export function meetsContrastRequirements(
  foreground: string,
  background: string,
  level: "AA" | "AAA" = "AA",
  isLargeText = false,
): boolean {
  const ratio = getContrastRatio(foreground, background)

  if (level === "AA") {
    return isLargeText ? ratio >= 3 : ratio >= 4.5
  } else {
    return isLargeText ? ratio >= 4.5 : ratio >= 7
  }
}
