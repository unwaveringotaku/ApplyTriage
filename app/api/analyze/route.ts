import { NextResponse } from "next/server";

import { analyzeJobDescription } from "@/lib/analysis";
import { ROLE_OPTIONS, WORK_AUTH_OPTIONS } from "@/lib/constants";
import { JobInput, RoleType, WorkAuthorizationStatus } from "@/types";

function isWorkAuthorizationStatus(value: unknown): value is WorkAuthorizationStatus {
  return typeof value === "string" && WORK_AUTH_OPTIONS.includes(value as WorkAuthorizationStatus);
}

function isRoleType(value: unknown): value is RoleType {
  return typeof value === "string" && ROLE_OPTIONS.includes(value as RoleType);
}

function normalizePayload(payload: Partial<JobInput>): JobInput {
  return {
    jobTitle: payload.jobTitle?.toString() ?? "",
    companyName: payload.companyName?.toString() ?? "",
    location: payload.location?.toString() ?? "",
    jobDescription: payload.jobDescription?.toString() ?? "",
    workAuthorizationStatus: isWorkAuthorizationStatus(payload.workAuthorizationStatus)
      ? payload.workAuthorizationStatus
      : "STEM OPT",
    roleType: isRoleType(payload.roleType) ? payload.roleType : "General",
    background: payload.background?.toString() ?? ""
  };
}

export async function POST(request: Request) {
  try {
    const payload = normalizePayload((await request.json()) as Partial<JobInput>);

    if (payload.jobDescription.trim().length < 100) {
      return NextResponse.json(
        {
          error: "Paste at least 100 characters from a job description for a useful analysis."
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      result: analyzeJobDescription(payload)
    });
  } catch {
    return NextResponse.json(
      {
        error: "Unable to analyze this job description."
      },
      { status: 400 }
    );
  }
}
