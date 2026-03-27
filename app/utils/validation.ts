export interface Weights {
  bias: number;
  length: number;
  score: number;
  freq: number;
}

export type Difficulty = "easy" | "medium" | "hard";

export function validateWeights(data: unknown): Record<Difficulty, Weights> {
  if (!data || typeof data !== "object") {
    throw new Error("Weights data must be an object");
  }

  const difficulties: Difficulty[] = ["easy", "medium", "hard"];
  const weights: Record<string, Weights> = {};

  for (const diff of difficulties) {
    const diffData = (data as Record<string, unknown>)[diff];
    
    if (!diffData || typeof diffData !== "object") {
      throw new Error(`Missing or invalid difficulty: ${diff}`);
    }

    const w = diffData as Record<string, unknown>;
    
    if (
      typeof w.bias !== "number" ||
      typeof w.length !== "number" ||
      typeof w.score !== "number" ||
      typeof w.freq !== "number"
    ) {
      throw new Error(`Invalid weights structure for ${diff}`);
    }

    weights[diff] = {
      bias: w.bias,
      length: w.length,
      score: w.score,
      freq: w.freq,
    };
  }

  return weights as Record<Difficulty, Weights>;
}

export function validateDictionary(data: unknown): Record<string, number> {
  if (!data || typeof data !== "object") {
    throw new Error("Dictionary data must be an object");
  }

  const dict = data as Record<string, unknown>;
  
  // Sample check first few entries
  let validCount = 0;
  for (const [word, freq] of Object.entries(dict)) {
    if (typeof word !== "string" || typeof freq !== "number") {
      throw new Error(`Invalid dictionary entry: ${word}`);
    }
    validCount++;
    if (validCount > 100) break; // Sample first 100 entries
  }

  if (validCount === 0) {
    throw new Error("Dictionary is empty");
  }

  return dict as Record<string, number>;
}
