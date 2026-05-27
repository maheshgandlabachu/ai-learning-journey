/** Shared TypeScript types — used across dashboard and future API routes */

export type DevicePlatform = "android" | "ios" | "windows" | "router";

export type RuleType =
  | "block"
  | "limit_time"
  | "bedtime"
  | "homework"
  | "weekend";

export type RuleStatus = "active" | "pending_sync" | "not_supported";

export type RiskLevel = "low" | "medium" | "high";

export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  deviceType: string;
  riskLevel: RiskLevel;
  screenTimeGoal: string;
}

export interface Device {
  id: string;
  childId: string;
  name: string;
  platform: DevicePlatform;
  status: "online" | "offline";
  syncStatus: "synced" | "pending" | "error";
  protectionLevel: "high" | "medium" | "low";
}

export interface Rule {
  id: string;
  childId: string;
  deviceId: string;
  title: string;
  type: RuleType;
  target: string;
  status: RuleStatus;
  schedule?: string;
}

export interface AIPlanInput {
  childAge: number;
  deviceType: DevicePlatform | string;
  appWebsite: string;
  concern: string;
  goal: string;
}

export interface GeneratedPlan {
  summary: string;
  recommendedRule: string;
  schedule: string;
  setupSteps: string[];
  safetyNotes: string[];
  parentTalkingPoints: string[];
  platformNote: string;
}
