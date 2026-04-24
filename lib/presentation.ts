import { RecommendedAction, RiskLevel } from "@/types";

export function getActionStyles(action: RecommendedAction) {
  switch (action) {
    case "APPLY NOW":
      return "bg-emerald-100 text-emerald-800 ring-emerald-200";
    case "MESSAGE RECRUITER FIRST":
      return "bg-sky-100 text-sky-800 ring-sky-200";
    case "APPLY WITH REFERRAL":
      return "bg-violet-100 text-violet-800 ring-violet-200";
    case "SKIP":
      return "bg-rose-100 text-rose-800 ring-rose-200";
  }
}

export function getRiskStyles(risk: RiskLevel | "Low" | "Medium" | "High") {
  switch (risk) {
    case "Low":
      return "bg-emerald-100 text-emerald-800 ring-emerald-200";
    case "Medium":
      return "bg-amber-100 text-amber-800 ring-amber-200";
    case "High":
      return "bg-orange-100 text-orange-800 ring-orange-200";
    case "Critical":
      return "bg-rose-100 text-rose-800 ring-rose-200";
  }
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(date));
}
