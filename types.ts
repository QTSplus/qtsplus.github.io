export interface Author {
  name: string;
  affiliation: number[];
  isCorresponding?: boolean;
  email?: string;
}

export interface Affiliation {
  id: number;
  name: string;
}

export interface ComparisonMetric {
  category: string;
  baseline: number;
  ours: number;
  metric: string;
}

export interface AnimationToken {
  id: number;
  color: string;
  relevance: number; // 0 to 1
  timestamp: number;
}