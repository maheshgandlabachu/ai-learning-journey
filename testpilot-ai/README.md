# TestPilot AI — Phase 1 MVP

**Generate smarter test cases from user stories in seconds.**

SaaS MVP for QA engineers, SDETs, product owners, and startups.  
**Phase 1 only:** mock AI, no auth, database, Jira, payments, or real AI API.

## Features

- Landing page (hero, features, how it works)
- Test case generator form (user story, AC, app type, testing type, priority)
- Mock structured output: positive, negative, edge cases
- Regression checklist, API ideas, automation suggestions, risk notes
- Copy / Print / Download output
- Dashboard stats preview

## Tech stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS

## How to run locally

```bash
cd C:\Projects\AI-Learning-Journey\testpilot-ai
npm install
npm run dev
```

Open **http://localhost:3000**

| Page | URL |
|------|-----|
| Landing | `/` |
| Generator | `/generator` |

## Folder structure

```
testpilot-ai/
├── app/
│   ├── page.tsx              # Landing
│   ├── layout.tsx
│   ├── globals.css
│   └── generator/page.tsx    # Form + output + stats
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── LandingHero.tsx
│   ├── FeatureCard.tsx
│   ├── GeneratorForm.tsx
│   ├── TestCaseOutput.tsx
│   ├── TestCaseCard.tsx
│   └── DashboardStats.tsx
└── lib/
    ├── types.ts
    └── generateMockTestCases.ts   # Mock AI (edit for Phase 2)
```

## Modify mock AI later (Phase 2)

Edit `lib/generateMockTestCases.ts`:

1. Keep the same `GeneratorFormInput` → `GeneratedTestSuite` signature.
2. Replace the function body with a call to OpenAI/Claude API.
3. Parse JSON response into `TestCase[]` arrays.

The UI (`GeneratorForm`, `TestCaseOutput`) does not need to change.

## Future roadmap

| Phase | Feature |
|-------|---------|
| 1 | Mock test case generator ✅ |
| 2 | Real AI API integration |
| 3 | Export to Excel/PDF |
| 4 | User login and saved projects |
| 5 | Jira integration |
| 6 | Team workspace |
| 7 | Stripe subscriptions |
| 8 | Playwright/Selenium script generation |
