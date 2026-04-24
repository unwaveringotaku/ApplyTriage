import { AnalyzerShell } from "@/components/analyzer/AnalyzerShell";

export default async function AnalyzePage({
  searchParams
}: {
  searchParams?: Promise<{ sample?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const autoLoadSample = resolvedSearchParams?.sample === "1";

  return <AnalyzerShell autoLoadSample={autoLoadSample} />;
}
