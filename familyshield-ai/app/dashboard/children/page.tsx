"use client";

import ChildProfileCard from "@/components/ChildProfileCard";
import Header from "@/components/Header";
import { useFamilyShield } from "@/lib/FamilyShieldContext";
import type { ChildProfile, RiskLevel } from "@/lib/types";
import { useState } from "react";

const emptyChild: Omit<ChildProfile, "id"> = {
  name: "",
  age: 8,
  deviceType: "iPad",
  riskLevel: "low",
  screenTimeGoal: "1 hour/day",
};

export default function ChildrenPage() {
  const { children, devices, rules, addChild, updateChild } = useFamilyShield();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyChild);
  const [editId, setEditId] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editId) {
      updateChild(editId, form);
      setEditId(null);
    } else {
      addChild(form);
    }
    setForm(emptyChild);
    setShowForm(false);
  }

  function startEdit(child: ChildProfile) {
    setForm({
      name: child.name,
      age: child.age,
      deviceType: child.deviceType,
      riskLevel: child.riskLevel,
      screenTimeGoal: child.screenTimeGoal,
    });
    setEditId(child.id);
    setShowForm(true);
  }

  return (
    <>
      <Header title="Child profiles" subtitle="Add and manage children" />
      <div className="flex-1 space-y-6 p-4 sm:p-6">
        <button
          type="button"
          onClick={() => {
            setShowForm(!showForm);
            setEditId(null);
            setForm(emptyChild);
          }}
          className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          {showForm ? "Cancel" : "+ Add child"}
        </button>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="font-bold text-slate-900">
              {editId ? "Edit child" : "New child profile"}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="text-sm">
                Name
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                />
              </label>
              <label className="text-sm">
                Age
                <input
                  type="number"
                  min={3}
                  max={18}
                  value={form.age}
                  onChange={(e) =>
                    setForm({ ...form, age: Number(e.target.value) })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                />
              </label>
              <label className="text-sm">
                Device type
                <input
                  value={form.deviceType}
                  onChange={(e) =>
                    setForm({ ...form, deviceType: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                />
              </label>
              <label className="text-sm">
                Risk level
                <select
                  value={form.riskLevel}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      riskLevel: e.target.value as RiskLevel,
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </label>
              <label className="text-sm sm:col-span-2">
                Screen time goal
                <input
                  value={form.screenTimeGoal}
                  onChange={(e) =>
                    setForm({ ...form, screenTimeGoal: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                />
              </label>
            </div>
            <button
              type="submit"
              className="mt-4 rounded-xl bg-brand-600 px-6 py-2 text-sm font-semibold text-white"
            >
              {editId ? "Save changes" : "Add child"}
            </button>
          </form>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {children.map((child) => (
            <ChildProfileCard
              key={child.id}
              child={child}
              deviceCount={devices.filter((d) => d.childId === child.id).length}
              ruleCount={rules.filter((r) => r.childId === child.id).length}
              onEdit={() => startEdit(child)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
