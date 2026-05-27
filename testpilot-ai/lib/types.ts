/** Shared types for TestPilot AI — used by form, mock generator, and future API */

export type ApplicationType =
  | "Web App"
  | "Mobile App"
  | "API"
  | "E-commerce"
  | "Banking/Finance"
  | "Healthcare"
  | "SaaS";

export type TestingType =
  | "Functional Testing"
  | "Regression Testing"
  | "API Testing"
  | "UI Testing"
  | "Negative Testing"
  | "End-to-End Testing";

export type Priority = "High" | "Medium" | "Low";

export interface GeneratorFormInput {
  userStory: string;
  acceptanceCriteria: string;
  applicationType: ApplicationType;
  testingType: TestingType;
  priority: Priority;
}

export interface TestCase {
  id: string;
  title: string;
  preconditions: string;
  steps: string[];
  expectedResult: string;
  priority: Priority;
}

export interface GeneratedTestSuite {
  summary: string;
  positiveTestCases: TestCase[];
  negativeTestCases: TestCase[];
  edgeCases: TestCase[];
  regressionChecklist: string[];
  apiValidationIdeas: string[];
  automationSuggestions: string[];
  riskNotes: string[];
}

export interface DashboardStats {
  totalGenerated: number;
  positiveCount: number;
  negativeCount: number;
  edgeCount: number;
  automationCandidates: number;
}
