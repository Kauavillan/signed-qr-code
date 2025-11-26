// Utility to apply opacity to a color string.
// Supports: #RGB, #RRGGBB, #RRGGBBAA, rgb(), rgba(), and basic named colors.
// Returns an rgba() string.

const NAMED_COLORS: Record<string, string> = {
  black: "#000000",
  white: "#ffffff",
  red: "#ff0000",
  green: "#00ff00",
  blue: "#0000ff",
  transparent: "#00000000",
};

function clampOpacity(value: number): number {
  if (Number.isNaN(value)) return 1;
  return Math.min(1, Math.max(0, value));
}

function hexToRgb(
  hex: string
): { r: number; g: number; b: number; a?: number } | null {
  const clean = hex.replace(/^#/, "");
  if (![3, 4, 6, 8].includes(clean.length)) return null;

  // Expand shorthand (#RGB or #RGBA)
  const isShort = clean.length === 3 || clean.length === 4;
  const full = isShort
    ? clean
        .split("")
        .map((c) => c + c)
        .join("")
    : clean;

  const hasAlpha = full.length === 8;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  const a = hasAlpha ? parseInt(full.slice(6, 8), 16) / 255 : undefined;
  return { r, g, b, a };
}

function parseRgbLike(
  color: string
): { r: number; g: number; b: number; a?: number } | null {
  const rgbRegex = /^rgba?\(([^)]+)\)$/i;
  const match = color.trim().match(rgbRegex);
  if (!match) return null;
  const parts = match[1]
    .split(/\s*,\s*/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length < 3) return null;
  const r = parseInt(parts[0], 10);
  const g = parseInt(parts[1], 10);
  const b = parseInt(parts[2], 10);
  if ([r, g, b].some((n) => Number.isNaN(n))) return null;
  let a: number | undefined;
  if (parts.length >= 4) {
    const alpha = parseFloat(parts[3]);
    if (!Number.isNaN(alpha)) a = alpha;
  }
  return { r, g, b, a };
}

export function applyOpacity(color: string, opacity: number): string {
  const targetOpacity = clampOpacity(opacity);
  if (!color) return `rgba(0,0,0,${targetOpacity})`;

  // Named colors
  const lower = color.toLowerCase();
  if (NAMED_COLORS[lower]) {
    const rgb = hexToRgb(NAMED_COLORS[lower]);
    if (rgb) return `rgba(${rgb.r},${rgb.g},${rgb.b},${targetOpacity})`;
  }

  // Hex forms
  if (/^#?[0-9a-f]{3,8}$/i.test(color.trim())) {
    const rgb = hexToRgb(color.trim());
    if (rgb) return `rgba(${rgb.r},${rgb.g},${rgb.b},${targetOpacity})`;
  }

  // rgb()/rgba()
  const rgbParsed = parseRgbLike(color);
  if (rgbParsed) {
    return `rgba(${rgbParsed.r},${rgbParsed.g},${rgbParsed.b},${targetOpacity})`;
  }

  // Fallback: attempt to use as-is via a temporary element? For simplicity, default.
  return `rgba(0,0,0,${targetOpacity})`;
}

// Convenience helpers
export const withOpacity = applyOpacity;
export function opacify(color: string, opacity: number) {
  return applyOpacity(color, opacity);
}
