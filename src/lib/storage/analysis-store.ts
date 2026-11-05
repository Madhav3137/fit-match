export interface StoredAnalysis {
  analysisId: string;
  status: string;
  product: any;
  chart: any;
  recommendation: any;
  createdAt: string;
}

// In-memory analysis storage for dev and session use
const globalAnalyses = new Map<string, StoredAnalysis>();

export function saveAnalysis(record: StoredAnalysis): void {
  globalAnalyses.set(record.analysisId, record);
}

export function getAnalysis(id: string): StoredAnalysis | null {
  return globalAnalyses.get(id) || null;
}

export function getAllAnalyses(): StoredAnalysis[] {
  return Array.from(globalAnalyses.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

