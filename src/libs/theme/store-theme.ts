import type { CSSProperties } from "react";

type StoreThemeStyle = CSSProperties & Record<`--${string}`, string>;

function getRelativeLuminance(color: string) {
  const channels = color
    .slice(1)
    .match(/.{2}/g)
    ?.map((channel) => {
      const value = Number.parseInt(channel, 16) / 255;
      return value <= 0.04045
        ? value / 12.92
        : ((value + 0.055) / 1.055) ** 2.4;
    });

  if (!channels) return 0;

  const [red = 0, green = 0, blue = 0] = channels;
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function getContrastingForeground(color: string) {
  const luminance = getRelativeLuminance(color);
  const whiteContrast = 1.05 / (luminance + 0.05);
  const darkContrast = (luminance + 0.05) / 0.05;

  return whiteContrast >= darkContrast ? "#ffffff" : "#111111";
}

function getHueAndSaturation(color: string) {
  const channels = color
    .slice(1)
    .match(/.{2}/g)
    ?.map((channel) => Number.parseInt(channel, 16) / 255);

  if (!channels || channels.length !== 3) return { hue: 0, saturation: 60 };

  const [red = 0, green = 0, blue = 0] = channels;
  const maximum = Math.max(red, green, blue);
  const minimum = Math.min(red, green, blue);
  const difference = maximum - minimum;

  let hue = 0;
  if (difference !== 0) {
    if (maximum === red) hue = ((green - blue) / difference) % 6;
    else if (maximum === green) hue = (blue - red) / difference + 2;
    else hue = (red - green) / difference + 4;
  }

  hue = (hue * 60 + 360) % 360;

  const lightness = (maximum + minimum) / 2;
  const saturation =
    difference === 0
      ? 60
      : (difference / (1 - Math.abs(2 * lightness - 1))) * 100;

  return { hue, saturation: Math.max(45, Math.min(80, saturation)) };
}

export function getStoreThemeStyle(
  baseColor: string,
): StoreThemeStyle | undefined {
  if (!/^#[0-9A-Fa-f]{6}$/.test(baseColor)) return undefined;

  const { hue, saturation } = getHueAndSaturation(baseColor);
  const foreground = getContrastingForeground(baseColor);
  const style: StoreThemeStyle = {
    "--store-primary": baseColor,
    "--store-primary-foreground": foreground,
    "--store-ring": baseColor,
    "--store-sidebar-primary": baseColor,
    "--store-sidebar-primary-foreground": foreground,
  };

  for (let index = 0; index < 5; index++) {
    const chartHue = (hue + index * 72) % 360;
    style[`--store-chart-${index + 1}`] = `hsl(${chartHue} ${saturation}% 52%)`;
  }

  return style;
}
