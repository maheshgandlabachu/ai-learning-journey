"use client";

/**
 * Client-side state for Phase 1 (no database).
 * Phase 2: replace with Supabase hooks / server actions.
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { initialChildren, initialDevices, initialRules } from "./mock-data";
import type { ChildProfile, Device, Rule, RuleType } from "./types";

interface FamilyShieldState {
  children: ChildProfile[];
  devices: Device[];
  rules: Rule[];
  addChild: (child: Omit<ChildProfile, "id">) => void;
  updateChild: (id: string, child: Partial<ChildProfile>) => void;
  addDevice: (device: Omit<Device, "id">) => void;
  addRule: (rule: Omit<Rule, "id" | "status"> & { status?: Rule["status"] }) => void;
}

const FamilyShieldContext = createContext<FamilyShieldState | null>(null);

function newId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function FamilyShieldProvider({ children: nodes }: { children: ReactNode }) {
  const [children, setChildren] = useState<ChildProfile[]>(initialChildren);
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [rules, setRules] = useState<Rule[]>(initialRules);

  const addChild = useCallback((child: Omit<ChildProfile, "id">) => {
    setChildren((prev) => [...prev, { ...child, id: newId("child") }]);
  }, []);

  const updateChild = useCallback((id: string, patch: Partial<ChildProfile>) => {
    setChildren((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c))
    );
  }, []);

  const addDevice = useCallback((device: Omit<Device, "id">) => {
    setDevices((prev) => [...prev, { ...device, id: newId("dev") }]);
  }, []);

  const addRule = useCallback(
    (rule: Omit<Rule, "id" | "status"> & { status?: Rule["status"] }) => {
      const platform = devices.find((d) => d.id === rule.deviceId)?.platform;
      let status: Rule["status"] = rule.status ?? "pending_sync";
      if (platform === "ios" && rule.type === "block") {
        status = "not_supported";
      }
      setRules((prev) => [
        ...prev,
        {
          ...rule,
          id: newId("rule"),
          status,
        },
      ]);
    },
    [devices]
  );

  const value = useMemo(
    () => ({
      children,
      devices,
      rules,
      addChild,
      updateChild,
      addDevice,
      addRule,
    }),
    [children, devices, rules, addChild, updateChild, addDevice, addRule]
  );

  return (
    <FamilyShieldContext.Provider value={value}>
      {nodes}
    </FamilyShieldContext.Provider>
  );
}

export function useFamilyShield() {
  const ctx = useContext(FamilyShieldContext);
  if (!ctx) {
    throw new Error("useFamilyShield must be used inside FamilyShieldProvider");
  }
  return ctx;
}

export const RULE_TYPE_LABELS: Record<RuleType, string> = {
  block: "Block app/website",
  limit_time: "Limit time",
  bedtime: "Bedtime schedule",
  homework: "Homework focus",
  weekend: "Weekend rules",
};
