# FamilyShield AI — Phase 1 MVP

AI-powered **parent web dashboard** for planning screen-time and app-blocking rules.  
**Phase 1 only:** mock data, no login, no database, no real device control, no payments.

## Product goal

Help parents create safe plans for kids across:

- Android (future child app)
- iOS (future Apple APIs)
- Windows (future desktop agent)
- Parent web dashboard (**built now**)

## Features (Phase 1)

- Landing page with hero, features, platform support
- Parent dashboard with sidebar navigation
- Child profiles (add / edit)
- Device management (mock Android, iOS, Windows)
- Rule management (block, limit time, bedtime, homework, weekend)
- **AI Rule Generator** (mock `generatePlan()`)
- Platform capability badges
- Rule statuses: Active, Pending sync, Not supported
- Copy plan & Print plan buttons

## Tech stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- React Context for client state (no DB yet)

## How to run locally

```bash
cd C:\Projects\AI-Learning-Journey\familyshield-ai
npm install
npm run dev
```

Open **http://localhost:3000**

## Folder structure

```
familyshield-ai/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Tailwind + print styles
│   └── dashboard/
│       ├── layout.tsx           # Sidebar + FamilyShieldProvider
│       ├── page.tsx             # Overview + stats
│       ├── children/page.tsx    # Child profiles
│       ├── devices/page.tsx     # Devices
│       ├── rules/page.tsx       # Rules
│       └── ai-generator/page.tsx
├── components/
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   ├── DashboardStats.tsx
│   ├── ChildProfileCard.tsx
│   ├── DeviceCard.tsx
│   ├── RuleCard.tsx
│   ├── PlatformSupportBadge.tsx
│   └── AIRuleGenerator.tsx
└── lib/
    ├── types.ts                 # Shared TypeScript types
    ├── mock-data.ts             # Initial mock data
    ├── generate-plan.ts         # Mock AI (Phase 3 → real API)
    ├── platform.ts              # Platform capability messages
    └── FamilyShieldContext.tsx  # Client state (Phase 2 → Supabase)
```

## Future roadmap

| Phase | Feature |
|-------|---------|
| 1 | Web dashboard with mock rules ✅ |
| 2 | Supabase database |
| 3 | Real AI (OpenAI / Claude) |
| 4 | Android child app |
| 5 | Windows desktop agent |
| 6 | iOS app (Apple FamilyControls APIs) |
| 7 | Stripe subscriptions |

## Disclaimer

This tool gives general guidance and does not replace official device parental-control settings.
