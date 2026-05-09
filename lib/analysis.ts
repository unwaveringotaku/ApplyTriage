import {
  ENTRY_LEVEL_PHRASES,
  HIGH_SENIORITY_PHRASES,
  KEYWORD_GROUPS,
  LOCATION_RISK_PHRASES,
  ROLE_BACKGROUND_LINES,
  ROLE_TITLE_HINTS,
  WORK_AUTH_EXPLANATIONS,
  WORK_AUTH_PHRASES
} from "@/lib/constants";
import {
  AnalysisResult,
  ConfidenceLevel,
  EvidenceSnippet,
  JobInput,
  OutreachMessages,
  RecommendedAction,
  RiskLevel,
  RoleType,
  SignalBuckets,
  WorkAuthorizationStatus,
  WorkAuthSignal
} from "@/types";

const CRITICAL_CITIZENSHIP_PHRASES = [
  "u.s. citizen",
  "us citizen",
  "security clearance required",
  "clearance required",
  "must be a u.s. person"
];

function normalizeText(text: string) {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildTermRegExp(term: string) {
  const pattern = escapeRegExp(normalizeText(term)).replace(/\s+/g, "\\s+");
  return new RegExp(`(^|[^a-z0-9])${pattern}($|[^a-z0-9])`);
}

function containsTerm(text: string, term: string) {
  return buildTermRegExp(term).test(text);
}

function getEvidenceSnippet(sourceText: string, phrase: string) {
  const compactSource = sourceText.replace(/\s+/g, " ").trim();
  const phraseIndex = compactSource.toLowerCase().indexOf(normalizeText(phrase));

  if (phraseIndex === -1) {
    return "";
  }

  const start = Math.max(0, phraseIndex - 90);
  const end = Math.min(compactSource.length, phraseIndex + phrase.length + 90);
  const prefix = start > 0 ? "..." : "";
  const suffix = end < compactSource.length ? "..." : "";

  return `${prefix}${compactSource.slice(start, end).trim()}${suffix}`;
}

function uniqueSorted(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

function phraseMatches(
  sourceText: string,
  phrases: readonly string[],
  category: WorkAuthSignal["category"]
) {
  const text = normalizeText(sourceText);

  return phrases
    .filter((phrase) => containsTerm(text, phrase))
    .map<WorkAuthSignal>((phrase) => ({
      phrase,
      category,
      snippet: getEvidenceSnippet(sourceText, phrase)
    }));
}

function isNegatedPositiveSignal(text: string, phrase: string) {
  const pattern = escapeRegExp(normalizeText(phrase)).replace(/\s+/g, "\\s+");
  const negativePatterns = [
    new RegExp(`no\\s+${pattern}`),
    new RegExp(`not\\s+eligible\\s+for\\s+${pattern}`),
    new RegExp(`without\\s+${pattern}`),
    new RegExp(`cannot\\s+${pattern}`)
  ];

  return negativePatterns.some((matcher) => matcher.test(text));
}

function scoreFromRisk(risk: RiskLevel) {
  switch (risk) {
    case "Low":
      return 25;
    case "Medium":
      return 15;
    case "High":
      return 6;
    case "Critical":
      return 0;
  }
}

function scoreFromLocationRisk(risk: "Low" | "Medium" | "High") {
  switch (risk) {
    case "Low":
      return 10;
    case "Medium":
      return 6;
    case "High":
      return 2;
  }
}

function scoreFromSeniorityRisk(risk: "Low" | "Medium" | "High") {
  switch (risk) {
    case "Low":
      return 20;
    case "Medium":
      return 12;
    case "High":
      return 4;
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function extractSignals(jobDescription: string): SignalBuckets {
  const text = normalizeText(jobDescription);
  const critical = phraseMatches(jobDescription, WORK_AUTH_PHRASES.critical, "critical");
  const high = phraseMatches(jobDescription, WORK_AUTH_PHRASES.high, "high");
  const medium = phraseMatches(jobDescription, WORK_AUTH_PHRASES.medium, "medium");
  const negativePhrases = [...critical, ...high].map((signal) => signal.phrase);
  const positive = phraseMatches(jobDescription, WORK_AUTH_PHRASES.positive, "positive").filter(
    (signal) =>
      !negativePhrases.some((negativePhrase) => containsTerm(negativePhrase, signal.phrase)) &&
      !isNegatedPositiveSignal(text, signal.phrase)
  );

  return {
    critical,
    high,
    medium,
    positive
  };
}

export function calculateWorkAuthorizationRisk(
  jobDescription: string,
  status: WorkAuthorizationStatus
) {
  const signals = extractSignals(jobDescription);
  const hasCritical = signals.critical.length > 0;
  const hasHigh = signals.high.length > 0;
  const hasMedium = signals.medium.length > 0;
  const hasPositive = signals.positive.length > 0;
  const needsSponsorship =
    status === "Needs sponsorship now" || status === "Will need sponsorship in the future";
  const temporaryStatus = status === "CPT" || status === "OPT" || status === "STEM OPT";
  const noSponsorshipNeeded =
    status === "Citizen / permanent resident / no sponsorship needed";
  const hasCitizenshipRestriction = signals.critical.some((signal) =>
    CRITICAL_CITIZENSHIP_PHRASES.includes(signal.phrase)
  );

  let risk: RiskLevel = "Medium";

  if (hasCritical && (needsSponsorship || temporaryStatus)) {
    risk = "Critical";
  } else if (hasHigh && (needsSponsorship || temporaryStatus)) {
    risk = "High";
  } else if (hasPositive && !hasCritical) {
    risk = "Low";
  } else if (hasMedium) {
    risk = "Medium";
  } else if (!hasCritical && !hasHigh && !hasMedium && !hasPositive) {
    risk = "Medium";
  }

  if (noSponsorshipNeeded) {
    if (hasCitizenshipRestriction) {
      risk = hasCritical ? "High" : "Medium";
    } else if (hasCritical || hasHigh || hasMedium || hasPositive) {
      risk = "Low";
    }
  }

  const summary = hasCritical
    ? "The job description includes explicit sponsorship or eligibility restrictions that make this role risky for international students."
    : hasHigh
      ? "The posting strongly implies limited sponsorship flexibility, so this role needs extra caution."
      : hasPositive
        ? "The job description includes language that suggests some openness to OPT, CPT, or sponsorship conversations."
        : hasMedium
          ? "The posting uses authorization language, but it is not specific enough to confirm compatibility."
          : "No clear sponsorship language was found, so treat the role as unclear until a recruiter confirms eligibility.";

  return {
    risk,
    score: scoreFromRisk(risk),
    signals,
    summary
  };
}

function getRelevantKeywords(roleType: RoleType, jobDescription: string) {
  const baseKeywords = KEYWORD_GROUPS[roleType];
  const aiKeywords = KEYWORD_GROUPS["AI/ML"];
  const text = normalizeText(jobDescription);
  const aiMatches = aiKeywords.filter((keyword) => containsTerm(text, keyword));

  if (aiMatches.length >= 2) {
    return uniqueSorted([...baseKeywords, ...aiKeywords]);
  }

  return baseKeywords;
}

export function calculateSkillMatch(jobDescription: string, roleType: RoleType, background?: string) {
  const text = normalizeText(jobDescription);
  const backgroundText = normalizeText(background ?? "");
  const relevantKeywords = getRelevantKeywords(roleType, jobDescription);
  const matchedKeywords = relevantKeywords.filter((keyword) => containsTerm(text, keyword));
  const missingKeywords = relevantKeywords.filter((keyword) => !containsTerm(text, keyword));
  const backgroundAlignedKeywords = matchedKeywords.filter((keyword) =>
    backgroundText ? containsTerm(backgroundText, keyword) : false
  );

  const expectedKeywordCount = Math.min(8, relevantKeywords.length);
  const baseScore = Math.round((Math.min(matchedKeywords.length, expectedKeywordCount) / expectedKeywordCount) * 30);
  const backgroundBoost = clamp(backgroundAlignedKeywords.length * 2, 0, 5);
  const skillMatchScore = clamp(baseScore + backgroundBoost, 0, 35);

  const recommendedResumeFocus = matchedKeywords.length
    ? `Lead with ${matchedKeywords.slice(0, 3).join(", ")} and quantify how you used them in real projects.`
    : `Lead with the most relevant experience you have for ${roleType.toLowerCase()} and mirror the posting language only when it is truthful.`;

  return {
    skillMatchScore,
    relevantKeywords,
    matchedKeywords: uniqueSorted(matchedKeywords),
    missingKeywords: uniqueSorted(missingKeywords),
    backgroundAlignedKeywords: uniqueSorted(backgroundAlignedKeywords),
    resumeKeywordSuggestions: uniqueSorted(missingKeywords.slice(0, 8)),
    recommendedResumeFocus
  };
}

export function calculateSeniorityRisk(jobTitle: string, jobDescription: string) {
  const titleText = normalizeText(jobTitle);
  const descriptionText = normalizeText(jobDescription);
  const highDescriptionSignals = [
    "senior",
    "lead",
    "principal",
    "director",
    "head of",
    "executive",
    "5+ years",
    "7+ years",
    "10+ years",
    "people management",
    "manage a team",
    "direct reports",
    "team leadership"
  ];
  const hasEntrySignals = ENTRY_LEVEL_PHRASES.some(
    (phrase) => containsTerm(titleText, phrase) || containsTerm(descriptionText, phrase)
  );
  const hasHighSignals =
    HIGH_SENIORITY_PHRASES.some((phrase) => containsTerm(titleText, phrase)) ||
    highDescriptionSignals.some((phrase) => containsTerm(descriptionText, phrase));

  let risk: "Low" | "Medium" | "High" = "Medium";
  let summary =
    "The seniority level is not fully explicit, so assume some recruiter verification may be needed.";

  if (hasHighSignals) {
    risk = "High";
    summary =
      "The role asks for senior-level signals that are likely to be a stretch for a student or early-career candidate.";
  } else if (hasEntrySignals) {
    risk = "Low";
    summary =
      "The posting includes entry-level language that aligns well with student and early-career applications.";
  }

  return {
    risk,
    score: scoreFromSeniorityRisk(risk),
    summary
  };
}

export function calculateLocationRisk(jobDescription: string, location: string) {
  const text = `${normalizeText(jobDescription)} ${normalizeText(location)}`;
  const hasHighRisk = LOCATION_RISK_PHRASES.high.some((phrase) => containsTerm(text, phrase));
  const hasLowRisk = LOCATION_RISK_PHRASES.low.some((phrase) => containsTerm(text, phrase));
  const hasMediumRisk = LOCATION_RISK_PHRASES.medium.some((phrase) => containsTerm(text, phrase));

  let risk: "Low" | "Medium" | "High" = "Medium";
  let summary =
    "The role appears location-bound enough that you should confirm day-to-day expectations before committing.";

  if (hasHighRisk) {
    risk = "High";
    summary =
      "The role includes onsite, relocation, or clearance expectations that can increase application friction.";
  } else if (hasLowRisk) {
    risk = "Low";
    summary = "The role appears remote-friendly or flexible, which lowers location friction.";
  } else if (hasMediumRisk) {
    risk = "Medium";
    summary = "The job includes hybrid or onsite language, so the location setup deserves a quick check.";
  }

  return {
    risk,
    score: scoreFromLocationRisk(risk),
    summary
  };
}

function calculateRoleTypeMatch(jobTitle: string, jobDescription: string, roleType: RoleType) {
  if (roleType === "General") {
    return {
      score: 10,
      summary: "The general track keeps the app focused on broad fit rather than a specialized role taxonomy."
    };
  }

  const titleText = normalizeText(jobTitle);
  const descriptionText = normalizeText(jobDescription);
  const titleHints = ROLE_TITLE_HINTS[roleType];
  const keywordHits = KEYWORD_GROUPS[roleType].filter((keyword) =>
    containsTerm(descriptionText, keyword)
  ).length;
  const titleHit = titleHints.some((hint) => containsTerm(titleText, hint));

  let score = 3;
  let summary =
    "The role shares some overlap with your selected track, but it is not a direct match on title or focus.";

  if (titleHit) {
    score = 10;
    summary = "The job title aligns directly with your selected target role.";
  } else if (keywordHits >= 5) {
    score = 8;
    summary = "The role responsibilities align strongly with your selected target role.";
  } else if (keywordHits >= 3) {
    score = 6;
    summary = "The role has moderate overlap with your target function.";
  }

  return {
    score,
    summary
  };
}

function workAuthorizationStatusLine(status: WorkAuthorizationStatus) {
  return WORK_AUTH_EXPLANATIONS[status];
}

function truncate(text: string, maxLength: number) {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 1).trim()}…`;
}

function getRiskContextLine(risk: RiskLevel) {
  switch (risk) {
    case "Low":
      return "The eligibility language looked fairly open, but I wanted to confirm expectations before I apply.";
    case "Medium":
      return "I noticed the posting includes work authorization language, so I wanted to clarify candidate eligibility before applying.";
    case "High":
      return "The role looks like a strong fit, but I noticed restrictive work authorization language and wanted to confirm whether candidates with my profile are considered.";
    case "Critical":
      return "Before I proceed, I wanted to confirm whether candidates with my work authorization profile are considered for this role.";
  }
}

export function generateRecommendation(params: {
  workAuthorizationRisk: RiskLevel;
  fitScore: number;
  skillMatchScore: number;
}): { action: RecommendedAction; explanation: string } {
  const { workAuthorizationRisk, fitScore, skillMatchScore } = params;

  if (fitScore < 50) {
    return workAuthorizationRisk === "Low"
      ? {
          action: "APPLY WITH REFERRAL",
          explanation:
            "Authorization risk looks manageable, but the fit is still thin enough that a referral or warm intro would help."
        }
      : {
          action: "SKIP",
          explanation:
            "The role looks too risky or misaligned to justify spending one of your application slots right now."
        };
  }

  if (workAuthorizationRisk === "Critical") {
    return {
      action: "SKIP",
      explanation:
        "The job description contains explicit eligibility restrictions, so this role is not a strong use of your time."
    };
  }

  if (workAuthorizationRisk === "High") {
    return fitScore >= 75
      ? {
          action: "APPLY WITH REFERRAL",
          explanation:
            "The role is a strong fit, but sponsorship risk is high enough that a referral or warm intro is the safest move."
        }
      : {
          action: "SKIP",
          explanation:
            "Sponsorship risk is high and the overall fit is not strong enough to offset it."
        };
  }

  if (workAuthorizationRisk === "Medium") {
    if (fitScore >= 70) {
      return {
        action: "MESSAGE RECRUITER FIRST",
        explanation:
          "The role looks promising, but the work authorization language is unclear enough that a quick recruiter check is worth it."
      };
    }

    return skillMatchScore >= 18
      ? {
          action: "MESSAGE RECRUITER FIRST",
          explanation:
            "There is enough functional fit to justify a quick clarification before you apply."
        }
      : {
          action: "APPLY WITH REFERRAL",
          explanation:
            "The role is not a clear enough fit to cold-apply confidently, so try a referral or warm contact first."
        };
  }

  if (fitScore >= 70) {
    return {
      action: "APPLY NOW",
      explanation:
        "The role looks aligned and the authorization risk appears manageable, so this is worth an immediate application."
    };
  }

  return {
    action: "APPLY WITH REFERRAL",
    explanation:
      "The risk looks manageable, but a referral or context-setting message would strengthen the application."
  };
}

export function generateOutreachMessages(input: JobInput, analysis: Pick<AnalysisResult, "matchedKeywords" | "workAuthorizationRisk">): OutreachMessages {
  const jobTitle = input.jobTitle || "role";
  const company = input.companyName || "the company";
  const statusLine = workAuthorizationStatusLine(input.workAuthorizationStatus);
  const shortBackground =
    input.background?.trim() || ROLE_BACKGROUND_LINES[input.roleType];
  const matchedFocus =
    analysis.matchedKeywords.slice(0, 3).join(", ") || "the team’s priorities";

  const linkedinNote = truncate(
    `Hi, I’m interested in the ${jobTitle} role at ${company}. I’m ${input.workAuthorizationStatus} and would value a quick eligibility clarification before I apply.`,
    190
  );

  const recruiterEmailSubject = `Question about ${jobTitle} role at ${company}`;

  const recruiterEmailBody = `Hi,

I hope you’re doing well. I’m interested in the ${jobTitle} role at ${company} and wanted to ask a quick question before applying.

I’m currently ${input.workAuthorizationStatus}. ${getRiskContextLine(analysis.workAuthorizationRisk)}

${statusLine}

My background includes ${shortBackground}, and the role stood out because of its focus on ${matchedFocus}.

Thank you,
[Your Name]`;

  const followUpMessage = `Hi, just following up on my earlier note about the ${jobTitle} role. I wanted to confirm whether candidates with ${input.workAuthorizationStatus} are considered before I submit my application. Thank you.`;

  return {
    linkedinNote,
    recruiterEmailSubject,
    recruiterEmailBody,
    workAuthorizationParagraph: statusLine,
    followUpMessage
  };
}

function collectEvidenceSnippets(params: {
  jobDescription: string;
  signals: SignalBuckets;
  matchedKeywords: string[];
  seniorityRisk: "Low" | "Medium" | "High";
  locationRisk: "Low" | "Medium" | "High";
  roleSummary: string;
}): EvidenceSnippet[] {
  const workAuthEvidence = [
    ...params.signals.critical,
    ...params.signals.high,
    ...params.signals.medium,
    ...params.signals.positive
  ]
    .filter((signal) => signal.snippet)
    .map<EvidenceSnippet>((signal) => ({
      label: "Work authorization signal",
      phrase: signal.phrase,
      snippet: signal.snippet ?? "",
      category: signal.category
    }));

  const skillEvidence = params.matchedKeywords
    .slice(0, 5)
    .map((keyword) => ({
      keyword,
      snippet: getEvidenceSnippet(params.jobDescription, keyword)
    }))
    .filter((item) => item.snippet)
    .map<EvidenceSnippet>((item) => ({
      label: "Matched skill keyword",
      phrase: item.keyword,
      snippet: item.snippet,
      category: "skill"
    }));

  const seniorityEvidence: EvidenceSnippet[] =
    params.seniorityRisk === "Medium"
      ? []
      : [
          {
            label: "Seniority assessment",
            phrase: `${params.seniorityRisk} seniority risk`,
            snippet:
              params.seniorityRisk === "Low"
                ? "The posting includes entry-level or early-career language."
                : "The posting includes senior-level requirements or leadership expectations.",
            category: "seniority"
          }
        ];

  const locationEvidence: EvidenceSnippet[] =
    params.locationRisk === "Medium"
      ? []
      : [
          {
            label: "Location assessment",
            phrase: `${params.locationRisk} location risk`,
            snippet:
              params.locationRisk === "Low"
                ? "The role appears remote-friendly or flexible."
                : "The role includes onsite, relocation, clearance, or similar location friction.",
            category: "location"
          }
        ];

  return [...workAuthEvidence, ...skillEvidence, ...seniorityEvidence, ...locationEvidence].slice(
    0,
    12
  );
}

function calculateAnalysisConfidence(params: {
  input: JobInput;
  signals: SignalBuckets;
  matchedKeywords: string[];
  evidenceSnippets: EvidenceSnippet[];
}): { level: ConfidenceLevel; reasons: string[] } {
  const descriptionLength = params.input.jobDescription.trim().length;
  const explicitSignalCount =
    params.signals.critical.length +
    params.signals.high.length +
    params.signals.medium.length +
    params.signals.positive.length;
  const reasons: string[] = [];
  let confidenceScore = 0;

  if (descriptionLength >= 900) {
    confidenceScore += 2;
    reasons.push("The job description is detailed enough for a stronger scan.");
  } else if (descriptionLength >= 350) {
    confidenceScore += 1;
    reasons.push("The job description has enough detail for a useful first pass.");
  } else {
    reasons.push("The job description is short, so some requirements may be missing.");
  }

  if (explicitSignalCount > 0) {
    confidenceScore += 2;
    reasons.push("The posting includes explicit work authorization or location language.");
  } else {
    reasons.push("No explicit work authorization language was found.");
  }

  if (params.matchedKeywords.length >= 4) {
    confidenceScore += 1;
    reasons.push("Several role keywords were matched against the selected track.");
  }

  if (params.input.jobTitle.trim()) {
    confidenceScore += 1;
    reasons.push("The job title helps validate seniority and role alignment.");
  }

  if (params.input.location.trim()) {
    confidenceScore += 1;
    reasons.push("Location context is available for onsite, hybrid, or remote friction.");
  }

  if (params.input.background?.trim()) {
    confidenceScore += 1;
    reasons.push("Your background text improves resume-fit interpretation.");
  }

  if (params.evidenceSnippets.length >= 3) {
    confidenceScore += 1;
    reasons.push("Multiple evidence snippets support the recommendation.");
  }

  const level: ConfidenceLevel =
    confidenceScore >= 7 ? "High" : confidenceScore >= 4 ? "Medium" : "Low";

  return {
    level,
    reasons: reasons.slice(0, 5)
  };
}

export function analyzeJobDescription(input: JobInput): AnalysisResult {
  const workAuth = calculateWorkAuthorizationRisk(
    input.jobDescription,
    input.workAuthorizationStatus
  );
  const skillMatch = calculateSkillMatch(
    input.jobDescription,
    input.roleType,
    input.background
  );
  const seniority = calculateSeniorityRisk(input.jobTitle, input.jobDescription);
  const location = calculateLocationRisk(input.jobDescription, input.location);
  const roleMatch = calculateRoleTypeMatch(
    input.jobTitle,
    input.jobDescription,
    input.roleType
  );

  const overallScore = clamp(
    workAuth.score +
      skillMatch.skillMatchScore +
      seniority.score +
      location.score +
      roleMatch.score,
    0,
    100
  );

  const recommendation = generateRecommendation({
    workAuthorizationRisk: workAuth.risk,
    fitScore: overallScore,
    skillMatchScore: skillMatch.skillMatchScore
  });

  const partialResult = {
    matchedKeywords: skillMatch.matchedKeywords,
    workAuthorizationRisk: workAuth.risk
  };
  const evidenceSnippets = collectEvidenceSnippets({
    jobDescription: input.jobDescription,
    signals: workAuth.signals,
    matchedKeywords: skillMatch.matchedKeywords,
    seniorityRisk: seniority.risk,
    locationRisk: location.risk,
    roleSummary: roleMatch.summary
  });
  const confidence = calculateAnalysisConfidence({
    input,
    signals: workAuth.signals,
    matchedKeywords: skillMatch.matchedKeywords,
    evidenceSnippets
  });

  return {
    recommendedAction: recommendation.action,
    explanation: recommendation.explanation,
    overallScore,
    fitScore: overallScore,
    analysisConfidence: confidence.level,
    confidenceReasons: confidence.reasons,
    workAuthorizationRisk: workAuth.risk,
    skillMatchScore: skillMatch.skillMatchScore,
    seniorityRisk: seniority.risk,
    seniorityScore: seniority.score,
    locationRisk: location.risk,
    locationScore: location.score,
    roleMatchScore: roleMatch.score,
    workAuthorizationCompatibilityScore: workAuth.score,
    scoreBreakdown: {
      skillMatch: skillMatch.skillMatchScore,
      workAuthorizationCompatibility: workAuth.score,
      seniorityMatch: seniority.score,
      locationMatch: location.score,
      roleMatch: roleMatch.score,
      overall: overallScore
    },
    signals: workAuth.signals,
    evidenceSnippets,
    matchedKeywords: skillMatch.matchedKeywords,
    missingKeywords: skillMatch.missingKeywords,
    backgroundAlignedKeywords: skillMatch.backgroundAlignedKeywords,
    resumeKeywordSuggestions: skillMatch.resumeKeywordSuggestions,
    recommendedResumeFocus: skillMatch.recommendedResumeFocus,
    outreachMessages: generateOutreachMessages(input, partialResult),
    workAuthorizationSummary: workAuth.summary,
    senioritySummary: seniority.summary,
    locationSummary: location.summary,
    roleSummary: roleMatch.summary
  };
}
