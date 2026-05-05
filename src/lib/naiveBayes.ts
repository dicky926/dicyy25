import { SalesData, PredictionFeatures, NaiveBayesResult, SalesOutcome } from '../types';

export class NaiveBayes {
  private data: SalesData[] = [];
  private outcomes: SalesOutcome[] = ['High', 'Medium', 'Low'];
  
  // Storage for probabilities
  private priorProbabilities: Record<SalesOutcome, number> = { High: 0, Medium: 0, Low: 0 };
  private conditionalProbabilities: Record<string, Record<string, Record<SalesOutcome, number>>> = {};

  constructor(data: SalesData[]) {
    this.data = data;
    this.train();
  }

  private train() {
    const total = this.data.length;
    if (total === 0) return;

    // 1. Calculate Prior Probabilities P(Outcome)
    this.outcomes.forEach(outcome => {
      const count = this.data.filter(d => d.outcome === outcome).length;
      this.priorProbabilities[outcome] = count / total;
    });

    // 2. Calculate Conditional Probabilities P(Feature | Outcome)
    const features: (keyof PredictionFeatures)[] = ['product', 'category', 'customerType', 'purchaseTime', 'stockLevel'];

    features.forEach(feature => {
      this.conditionalProbabilities[feature] = {};
      
      // Get all unique values for this feature
      const values = Array.from(new Set(this.data.map(d => d[feature] as string)));
      
      values.forEach(val => {
        this.conditionalProbabilities[feature][val] = { High: 0, Medium: 0, Low: 0 };
        
        this.outcomes.forEach(outcome => {
          const outcomeData = this.data.filter(d => d.outcome === outcome);
          const outcomeCount = outcomeData.length;
          const matchCount = outcomeData.filter(d => d[feature] === val).length;
          
          // Using Laplace Smoothing to avoid zero probability
          this.conditionalProbabilities[feature][val][outcome] = (matchCount + 1) / (outcomeCount + values.length);
        });
      });
    });
  }

  public predict(features: PredictionFeatures): NaiveBayesResult {
    const results: Record<SalesOutcome, number> = { High: 0, Medium: 0, Low: 0 };

    this.outcomes.forEach(outcome => {
      // Start with the prior probability P(Outcome)
      let probability = this.priorProbabilities[outcome];

      // Multiply by each conditional probability P(Feature_i | Outcome)
      Object.entries(features).forEach(([feature, value]) => {
        const featureProbs = this.conditionalProbabilities[feature];
        if (featureProbs && featureProbs[value as string]) {
          probability *= featureProbs[value as string][outcome];
        } else {
          // If value wasn't in training data, use a default smoothed value
          const values = Array.from(new Set(this.data.map(d => d[feature as keyof PredictionFeatures] as string)));
          const outcomeCount = this.data.filter(d => d.outcome === outcome).length;
          probability *= 1 / (outcomeCount + (values.length || 1));
        }
      });

      results[outcome] = probability;
    });

    // Normalize probabilities to sum to 1 (optional but helpful for display)
    const sum = Object.values(results).reduce((a, b) => a + b, 0);
    const normalizedRes = { ...results };
    if (sum > 0) {
      this.outcomes.forEach(o => {
        normalizedRes[o] = results[o] / sum;
      });
    }

    // Find best match
    let bestMatch: SalesOutcome = 'Low';
    let maxProb = -1;
    this.outcomes.forEach(o => {
      if (normalizedRes[o] > maxProb) {
        maxProb = normalizedRes[o];
        bestMatch = o;
      }
    });

    return {
      probabilities: normalizedRes,
      bestMatch
    };
  }
}
