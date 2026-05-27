"use client";

import DeviceCard from "@/components/DeviceCard";
import Header from "@/components/Header";
import { useFamilyShield } from "@/lib/FamilyShieldContext";
import type { Device, DevicePlatform } from "@/lib/types";
import { useState } from "react";

export default function DevicesPage() {
  const { children, devices, addDevice } = useFamilyShield();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    childId: children[0]?.id ?? "",
    name: "",
    platform: "android" as DevicePlatform,
    status: "online" as Device["status"],
    syncStatus: "pending" as Device["syncStatus"],
    protectionLevel: "medium" as Device["protectionLevel"],
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.childId) return;
    addDevice(form);
    setForm({
      ...form,
      name: "",
    });
    setShowForm(false);
  }

  return (
    <>
      <Header title="Devices" subtitle="Mock connected child devices" />
      <div className="flex-1 space-y-6 p-4 sm:p-6">
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          {showForm ? "Cancel" : "+ Add device"}
        </button>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-200 bg-white p-6"
          >
            <h2 className="font-bold">Connect device (mock)</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="text-sm">
                Child
                <select
                  value={form.childId}
                  onChange={(e) => setForm({ ...form, childId: e.target.value })}
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                >
                  {children.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm">
                Device name
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                />
              </label>
              <label className="text-sm">
                Platform
                <select
                  value={form.platform}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      platform: e.target.value as DevicePlatform,
                    })
                  }
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                >
                  <option value="android">Android</option>
                  <option value="ios">iPhone / iPad</option>
                  <option value="windows">Windows PC</option>
                  <option value="router">Router / Wi‑Fi</option>
                </select>
              </label>
              <label className="text-sm">
                Protection level
                <select
                  value={form.protectionLevel}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      protectionLevel: e.target
                        .value as Device["protectionLevel"],
                    })
                  }
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </label>
            </div>
            <button
              type="submit"
              className="mt-4 rounded-xl bg-brand-600 px-6 py-2 text-sm font-semibold text-white"
            >
              Add device
            </button>
          </form>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {devices.map((device) => {
            const child = children.find((c) => c.id === device.childId);
            return (
              <DeviceCard key={device.id} device={device} child={child} />
            );
          })}
        </div>
      </div>
    </>
  );
}
