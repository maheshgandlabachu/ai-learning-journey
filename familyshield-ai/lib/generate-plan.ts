import type { AIPlanInput, GeneratedPlan } from "./types";
import { PLATFORM_SUPPORT, platformFromDeviceType } from "./platform";

/**
 * Mock AI rule generator — Phase 1 only.
 * Phase 3 will replace this with OpenAI / Claude API calls.
 */
export function generatePlan(input: AIPlanInput): GeneratedPlan {
  const platform = platformFromDeviceType(String(input.deviceType));
  const platformInfo = PLATFORM_SUPPORT[platform];

  const goalLower = input.goal.toLowerCase();
  let recommendedRule = `Monitor and manage ${input.appWebsite} on ${input.deviceType}.`;
  let schedule = "Weekdays: 1 hour after school · Weekends: 90 minutes · No use after 8:30 PM";

  if (goalLower.includes("block")) {
    recommendedRule = `Block ${input.appWebsite} entirely on ${input.deviceType}.`;
    schedule = "Blocked 24/7 unless parent approves a 30-minute exception.";
  } else if (goalLower.includes("bedtime")) {
    recommendedRule = `Enable bedtime mode — ${input.appWebsite} unavailable after 8:30 PM.`;
    schedule = "School nights: block from 8:30 PM – 7:00 AM · Weekends: block from 9:30 PM – 8:00 AM";
  } else if (goalLower.includes("homework")) {
    recommendedRule = `Homework focus mode — only educational apps during study time.`;
    schedule = "Mon–Fri 4:00 PM – 6:00 PM: block entertainment apps including " + input.appWebsite;
  } else if (goalLower.includes("limit")) {
    recommendedRule = `Daily time limit for ${input.appWebsite}.`;
    schedule = "60 minutes per day · 15-minute warning before limit · resets at midnight";
  }

  const age = input.childAge;
  const ageNote =
    age <= 8
      ? "Younger children benefit from shorter sessions and more co-viewing."
      : age <= 12
        ? "Set clear rules and review usage weekly together."
        : "Teens need transparent rules and agreed consequences.";

  return {
    summary: `Safe family plan for a ${age}-year-old on ${input.deviceType}, focused on ${input.appWebsite}. Goal: ${input.goal}.`,
    recommendedRule,
    schedule,
    setupSteps: [
      `Open FamilyShield AI dashboard and select the child's ${input.deviceType} device.`,
      `Create a new rule: "${recommendedRule}"`,
      platform === "android"
        ? "On the Android child app (Phase 4): grant accessibility & usage access permissions."
        : platform === "ios"
          ? "On iOS (Phase 6): use Apple Screen Time / FamilyControls APIs via approved app."
          : "On Windows (Phase 5): install the FamilyShield desktop agent.",
      "Set the schedule shown below and tap Save.",
      "Verify status shows Active or Pending sync on the device card.",
    ],
    safetyNotes: [
      ageNote,
      "This plan is general guidance — always use official device parental controls too.",
      `Platform note: ${platformInfo.message}`,
      input.concern
        ? `Your concern ("${input.concern.slice(0, 80)}${input.concern.length > 80 ? "…" : ""}") — address it in a calm family conversation first.`
        : "Talk with your child about why limits help sleep, focus, and safety.",
    ],
    parentTalkingPoints: [
      `"We're setting this up to keep you safe, not to punish you."`,
      `"You can earn extra time by finishing homework first."`,
      `"If something online makes you uncomfortable, tell us right away."`,
      `"Rules can change as you grow — we'll review together each month."`,
    ],
    platformNote: platformInfo.message,
  };
}
