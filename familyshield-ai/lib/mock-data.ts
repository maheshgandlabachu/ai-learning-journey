import type { ChildProfile, Device, Rule } from "./types";

/** Initial mock data — Phase 2 will load from Supabase */
export const initialChildren: ChildProfile[] = [
  {
    id: "child-1",
    name: "Emma",
    age: 9,
    deviceType: "iPad",
    riskLevel: "medium",
    screenTimeGoal: "90 min/day entertainment",
  },
  {
    id: "child-2",
    name: "Noah",
    age: 13,
    deviceType: "Android Phone",
    riskLevel: "high",
    screenTimeGoal: "2 hours/day social & games",
  },
];

export const initialDevices: Device[] = [
  {
    id: "dev-1",
    childId: "child-1",
    name: "Emma's iPad",
    platform: "ios",
    status: "online",
    syncStatus: "synced",
    protectionLevel: "medium",
  },
  {
    id: "dev-2",
    childId: "child-2",
    name: "Noah's Galaxy",
    platform: "android",
    status: "online",
    syncStatus: "pending",
    protectionLevel: "high",
  },
  {
    id: "dev-3",
    childId: "child-2",
    name: "Family Windows PC",
    platform: "windows",
    status: "offline",
    syncStatus: "pending",
    protectionLevel: "medium",
  },
];

export const initialRules: Rule[] = [
  {
    id: "rule-1",
    childId: "child-1",
    deviceId: "dev-1",
    title: "Block TikTok",
    type: "block",
    target: "TikTok",
    status: "not_supported",
    schedule: "24/7",
  },
  {
    id: "rule-2",
    childId: "child-1",
    deviceId: "dev-1",
    title: "YouTube 45 min/day",
    type: "limit_time",
    target: "YouTube",
    status: "active",
    schedule: "Daily 45 min",
  },
  {
    id: "rule-3",
    childId: "child-2",
    deviceId: "dev-2",
    title: "Roblox bedtime",
    type: "bedtime",
    target: "Roblox",
    status: "pending_sync",
    schedule: "Block after 8:30 PM",
  },
  {
    id: "rule-4",
    childId: "child-2",
    deviceId: "dev-3",
    title: "Homework focus",
    type: "homework",
    target: "Gaming",
    status: "active",
    schedule: "Mon–Fri 4–6 PM",
  },
];
