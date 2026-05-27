/**
 * Mock AI test case generator — Phase 1 only.
 * Phase 2: replace this function with OpenAI / Claude API calls.
 */

import type {
  GeneratedTestSuite,
  GeneratorFormInput,
  Priority,
  TestCase,
} from "./types";

function makeId(prefix: string, n: number): string {
  return `TC-${prefix}-${String(n).padStart(3, "0")}`;
}

function makeCase(
  prefix: string,
  n: number,
  title: string,
  preconditions: string,
  steps: string[],
  expectedResult: string,
  priority: Priority
): TestCase {
  return {
    id: makeId(prefix, n),
    title,
    preconditions,
    steps,
    expectedResult,
    priority,
  };
}

/** Extract a short feature name from user story for realistic titles */
function featureLabel(story: string): string {
  const trimmed = story.trim().slice(0, 60);
  if (!trimmed) return "the feature";
  return trimmed.replace(/\s+/g, " ").replace(/\.$/, "");
}

/**
 * Main mock generator — returns structured test suite from form input.
 */
export function generateMockTestCases(
  input: GeneratorFormInput
): GeneratedTestSuite {
  const feature = featureLabel(input.userStory);
  const app = input.applicationType;
  const testType = input.testingType;
  const defaultPriority = input.priority;

  const acLines = input.acceptanceCriteria
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const acHint =
    acLines.length > 0
      ? ` Acceptance criteria include: "${acLines[0]}".`
      : "";

  const summary = `Test suite for ${app} (${testType}) covering "${feature}".${acHint} Generated with TestPilot AI mock engine (Phase 1).`;

  const positiveTestCases: TestCase[] = [
    makeCase(
      "POS",
      1,
      `Verify happy path for ${feature}`,
      `User has valid access to ${app}; test data is configured.`,
      [
        "Navigate to the feature entry point",
        "Perform the primary action described in the user story",
        "Submit or confirm the action",
      ],
      "System completes the action successfully and shows confirmation per acceptance criteria.",
      defaultPriority
    ),
    makeCase(
      "POS",
      2,
      `Validate acceptance criteria — primary scenario`,
      "All required fields and permissions are available.",
      acLines.length
        ? acLines.map((ac, i) => `Verify: ${ac}`)
        : [
            "Execute the main user flow end-to-end",
            "Compare UI/API response against expected behavior",
          ],
      "Each acceptance criterion is satisfied without errors.",
      defaultPriority === "High" ? "High" : "Medium"
    ),
    makeCase(
      "POS",
      3,
      `Verify data persistence after ${feature}`,
      "User is authenticated; network is stable.",
      [
        "Complete the primary flow",
        "Refresh the page or re-fetch via API",
        "Verify stored state matches submitted data",
      ],
      "Data is persisted correctly and displayed on reload.",
      "Medium"
    ),
  ];

  const negativeTestCases: TestCase[] = [
    makeCase(
      "NEG",
      1,
      `Reject invalid input for ${feature}`,
      "User is on the feature form/endpoint.",
      [
        "Enter invalid or empty required fields",
        "Attempt to submit",
      ],
      "System shows clear validation errors; no partial save occurs.",
      "High"
    ),
    makeCase(
      "NEG",
      2,
      "Unauthorized access is blocked",
      "User is logged out or lacks permission.",
      [
        "Attempt to access the feature URL or API directly",
      ],
      "Access is denied with appropriate HTTP status / UI message (401/403).",
      "High"
    ),
    makeCase(
      "NEG",
      3,
      "Handle network timeout gracefully",
      "Simulate slow or offline network (DevTools / proxy).",
      [
        "Start the primary action",
        "Interrupt network mid-request",
      ],
      "User sees retry or error message; no corrupted state.",
      "Medium"
    ),
  ];

  const edgeCases: TestCase[] = [
    makeCase(
      "EDGE",
      1,
      "Boundary values for numeric/text inputs",
      "Feature accepts user input.",
      [
        "Test minimum allowed value",
        "Test maximum allowed value",
        "Test value just above maximum",
      ],
      "Min/max accepted; out-of-range rejected with validation.",
      "Medium"
    ),
    makeCase(
      "EDGE",
      2,
      "Concurrent actions on same resource",
      "Two sessions or API clients available.",
      [
        "Trigger the same action simultaneously from two clients",
      ],
      "System handles race condition without data corruption (lock or clear error).",
      "Low"
    ),
    makeCase(
      "EDGE",
      3,
      `Special characters and Unicode in ${feature}`,
      "Input fields accept text.",
      [
        "Enter emoji, accents, and SQL-like strings",
        "Submit and review stored/displayed output",
      ],
      "Input is sanitized/encoded; no XSS or DB errors.",
      "Medium"
    ),
  ];

  const regressionChecklist = [
    `Smoke: ${feature} loads without console errors on ${app}`,
    "Login/logout still works after feature deployment",
    "Existing related flows (navigation, search) unaffected",
    "API contract backward compatible (if applicable)",
    "Mobile responsive layout unchanged (if Web/Mobile)",
    `Performance: page/API response within SLA for ${testType}`,
  ];

  const apiValidationIdeas =
    app === "API" || testType === "API Testing"
      ? [
          "Validate 200 response schema against OpenAPI/Swagger spec",
          "Verify 400 for malformed JSON body",
          "Verify 401/403 for missing or expired tokens",
          "Check rate limiting headers and 429 behavior",
          "Validate pagination (limit, offset, empty page)",
        ]
      : [
          "Inspect network tab for correct REST verbs and status codes",
          "Verify request payload matches UI selections",
          "Confirm error payloads return machine-readable codes",
        ];

  const automationSuggestions = [
    `Playwright/Cypress: automate happy path for "${feature}" on ${app}`,
    "API: add Postman/Newman collection for positive + negative cases",
    "Add CI smoke job on pull request targeting critical paths",
    "Use data-driven tests for boundary value cases",
    testType === "End-to-End Testing"
      ? "Tag @e2e scenarios in test management tool for nightly runs"
      : "Map test IDs to user story for traceability",
  ];

  const riskNotes = [
    `Application type (${app}) may require compliance checks before production.`,
    input.testingType.includes("Negative")
      ? "Prioritize security and validation tests in sprint zero."
      : "Include negative paths even for functional stories.",
    acLines.length === 0
      ? "Risk: acceptance criteria empty — clarify with PO before sign-off."
      : "Ensure all AC lines have at least one mapped test case.",
    "Mock output only — review with QA lead before baseline release.",
  ];

  return {
    summary,
    positiveTestCases,
    negativeTestCases,
    edgeCases,
    regressionChecklist,
    apiValidationIdeas,
    automationSuggestions,
    riskNotes,
  };
}

/** Build flat text export for copy / download */
export function suiteToPlainText(suite: GeneratedTestSuite): string {
  const formatCases = (label: string, cases: TestCase[]) => {
    const blocks = cases.map(
      (tc) =>
        `${tc.id} | ${tc.priority}\n` +
        `Title: ${tc.title}\n` +
        `Preconditions: ${tc.preconditions}\n` +
        `Steps:\n${tc.steps.map((s, i) => `  ${i + 1}. ${s}`).join("\n")}\n` +
        `Expected: ${tc.expectedResult}\n`
    );
    return `\n=== ${label} ===\n\n${blocks.join("\n")}`;
  };

  return [
    "TestPilot AI — Generated Test Suite",
    "===================================",
    "",
    "SUMMARY",
    suite.summary,
    formatCases("POSITIVE TEST CASES", suite.positiveTestCases),
    formatCases("NEGATIVE TEST CASES", suite.negativeTestCases),
    formatCases("EDGE CASES", suite.edgeCases),
    "\n=== REGRESSION CHECKLIST ===\n",
    suite.regressionChecklist.map((x) => `• ${x}`).join("\n"),
    "\n=== API VALIDATION IDEAS ===\n",
    suite.apiValidationIdeas.map((x) => `• ${x}`).join("\n"),
    "\n=== AUTOMATION SUGGESTIONS ===\n",
    suite.automationSuggestions.map((x) => `• ${x}`).join("\n"),
    "\n=== RISK NOTES ===\n",
    suite.riskNotes.map((x) => `• ${x}`).join("\n"),
  ].join("\n");
}

/** Stats for dashboard preview */
export function statsFromSuite(suite: GeneratedTestSuite) {
  const total =
    suite.positiveTestCases.length +
    suite.negativeTestCases.length +
    suite.edgeCases.length;
  return {
    totalGenerated: total,
    positiveCount: suite.positiveTestCases.length,
    negativeCount: suite.negativeTestCases.length,
    edgeCount: suite.edgeCases.length,
    automationCandidates: suite.automationSuggestions.length,
  };
}
