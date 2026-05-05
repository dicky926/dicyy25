export type SalesOutcome = 'High' | 'Medium' | 'Low';

export interface SalesData {
  id: string;
  product: string;
  category: string;
  customerType: string;
  purchaseTime: string;
  stockLevel: string;
  outcome: SalesOutcome;
}

export interface PredictionFeatures {
  product: string;
  category: string;
  customerType: string;
  purchaseTime: string;
  stockLevel: string;
}

export interface NaiveBayesResult {
  probabilities: Record<SalesOutcome, number>;
  bestMatch: SalesOutcome;
}
