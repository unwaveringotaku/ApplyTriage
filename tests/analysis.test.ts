import assert from "node:assert/strict";

import {
  analyzeJobDescription,
  calculateSeniorityRisk,
  calculateWorkAuthorizationRisk
} from "../lib/analysis";
import { SAMPLE_JOB } from "../lib/constants";
import { JobInput } from "../types";

const baseInput: JobInput = {
  jobTitle: SAMPLE_JOB.jobTitle,
  companyName: SAMPLE_JOB.companyName,
  location: SAMPLE_JOB.location,
  jobDescription: SAMPLE_JOB.jobDescription,
  workAuthorizationStatus: SAMPLE_JOB.workAuthorizationStatus,
  roleType: SAMPLE_JOB.roleType,
  background: SAMPLE_JOB.background
};

const sampleResult = analyzeJobDescription(baseInput);

assert.equal(sampleResult.recommendedAction, "MESSAGE RECRUITER FIRST");
assert.equal(sampleResult.workAuthorizationRisk, "Medium");
assert.ok(sampleResult.overallScore >= 70);
assert.ok(sampleResult.evidenceSnippets.length > 0);
assert.notEqual(sampleResult.analysisConfidence, "Low");

const criticalAuth = calculateWorkAuthorizationRisk(
  "This role requires permanent work authorization and no visa sponsorship now or in the future.",
  "STEM OPT"
);

assert.equal(criticalAuth.risk, "Critical");
assert.ok(criticalAuth.signals.critical.length > 0);
assert.ok(criticalAuth.signals.critical.every((signal) => signal.snippet));

const productManagerSeniority = calculateSeniorityRisk(
  "Product Manager",
  "You will own product discovery, roadmap tradeoffs, product metrics, launch planning, and cross-functional communication with design and engineering partners."
);

assert.notEqual(productManagerSeniority.risk, "High");

const seniorRole = calculateSeniorityRisk(
  "Senior Product Manager",
  "This role requires team leadership, direct reports, executive communication, and 7+ years of product experience."
);

assert.equal(seniorRole.risk, "High");
