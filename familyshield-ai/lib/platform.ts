import type { DevicePlatform } from "./types";

/** Platform capability messages shown on badges and AI output */
export const PLATFORM_SUPPORT: Record<
  DevicePlatform,
  { label: string; message: string; tone: "success" | "warning" | "info" | "muted" }
> = {
  android: {
    label: "Android",
    message: "Can support app blocking with permissions",
    tone: "success",
  },
  ios: {
    label: "iOS / iPad",
    message: "Limited; requires Apple-approved parental control APIs",
    tone: "warning",
  },
  windows: {
    label: "Windows",
    message: "Can support website/app blocking with desktop agent",
    tone: "success",
  },
  router: {
    label: "Router / Wi‑Fi",
    message: "Future optional support",
    tone: "muted",
  },
};

export function platformFromDeviceType(deviceType: string): DevicePlatform {
  const map: Record<string, DevicePlatform> = {
    Android: "android",
    "Android Phone": "android",
    "iPhone/iPad": "ios",
    iPad: "ios",
    iPhone: "ios",
    "Windows PC": "windows",
    "Windows Laptop": "windows",
    "Router/Wi-Fi": "router",
    Router: "router",
  };
  return map[deviceType] ?? "android";
}
