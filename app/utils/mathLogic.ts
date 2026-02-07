import { TestParameters, Operation, allOperations } from '../TestParametersContext';

export const round2 = (n: number) => Math.round(n * 100) / 100;

export function isAnswerCorrect(answer: number, correctAnswer: number): boolean {
  if (!Number.isFinite(answer)) return false;
  return round2(answer) === round2(correctAnswer);
}

export interface GenerateOptionsConfig {
  numberOfResults: number;
  sortResults: boolean;
}

export function generateAnswerOptions(correct: number, config: GenerateOptionsConfig): number[] {
  const targetCount = config.numberOfResults;
  const correctRounded = round2(correct);

  const opts = new Set<number>([correctRounded]);

  let range = Math.max(5, Math.ceil(Math.abs(correctRounded) / 2));
  let attempts = 0;
  const MAX_ATTEMPTS = 500;

  while (opts.size < targetCount && attempts < MAX_ATTEMPTS) {
    const delta = Math.floor(Math.random() * range * 2) - range;
    const candidate = Math.max(0, correctRounded + delta);

    if (candidate !== correctRounded) {
      opts.add(candidate);
    }

    attempts++;
    if (attempts % 50 === 0) range *= 2;
  }

  for (let i = 1; opts.size < targetCount; i++) {
    opts.add(correctRounded + range + i);
  }

  const arr = Array.from(opts);

  return config.sortResults
    ? arr.sort((a, b) => a - b)
    : arr.sort(() => Math.random() - 0.5);
}

export function sanitizeParameters(params: TestParameters): TestParameters {
  const clamp = (val: number, min: number, max: number) =>
    Number.isFinite(val) ? Math.max(min, Math.min(max, Math.round(val))) : min;

  const firstMin = clamp(params.firstOperandMin, 0, 1000);
  const firstMax = clamp(params.firstOperandMax, 0, 1000);
  const secondMin = clamp(params.secondOperandMin, 0, 1000);
  const secondMax = clamp(params.secondOperandMax, 0, 1000);

  const validOps = (params.operations ?? []).filter(
    (op): op is Operation => allOperations.includes(op as Operation)
  );

  return {
    firstOperandMin: Math.min(firstMin, firstMax),
    firstOperandMax: Math.max(firstMin, firstMax),
    secondOperandMin: Math.min(secondMin, secondMax),
    secondOperandMax: Math.max(secondMin, secondMax),
    operations: validOps.length > 0 ? validOps : ['addition'],
    numberOfResults: clamp(params.numberOfResults, 2, 8),
    sortResults: Boolean(params.sortResults),
  };
}

export interface MathProblem {
  num1: number;
  num2: number;
  operation: Operation;
  answer: number;
}

export function generateProblem(params: TestParameters, operation: Operation): MathProblem {
  let num1 = 0;
  let num2 = 0;

  switch (operation) {
    case 'addition':
    case 'multiplication':
      num1 = getRandomInt(params.firstOperandMin, params.firstOperandMax);
      num2 = getRandomInt(params.secondOperandMin, params.secondOperandMax);
      break;

    case 'subtraction': {
      // 1. Pick num1 freely from its range
      num1 = getRandomInt(params.firstOperandMin, params.firstOperandMax);
      
      // 2. We need num2 such that:
      //    a) num2 >= secondOperandMin
      //    b) num2 <= secondOperandMax
      //    c) num2 <= num1 (to ensure positive result)
      
      // Combine constraints:
      const effMin = params.secondOperandMin;
      const effMax = Math.min(params.secondOperandMax, num1);
      
      if (effMin <= effMax) {
        // Happy path: valid range exists
        num2 = getRandomInt(effMin, effMax);
      } else {
        // Impossible to satisfy all constraints.
        // E.g. num1=3, secondMin=5.
        // We must violate one constraint.
        // Option: Increase num1 to match at least secondMin?
        // OR: Decrease num2 to match num1?
        
        // Strategy: Force num2 to be num1 (result 0) if allowed, 
        // or just pick a valid num2 from its original range and Accept Negative?
        // NO, knowledge.md implies "elementary school", so negatives are likely out.
        // Strategy: Regenerate num1 to be larger?
        
        // Let's try to pick a num1 that IS valid first.
        const validNum1Min = Math.max(params.firstOperandMin, params.secondOperandMin);
        const validNum1Max = params.firstOperandMax;
        
        if (validNum1Min <= validNum1Max) {
          // We can pick a valid num1
          num1 = getRandomInt(validNum1Min, validNum1Max);
          // Now re-calculate effMax
          const newEffMax = Math.min(params.secondOperandMax, num1);
          num2 = getRandomInt(params.secondOperandMin, newEffMax);
        } else {
          // Ranges are disjoint (First < Second).
          // e.g. First=[1,5], Second=[10,20].
          // We CANNOT generate a non-negative subtraction.
          // Fallback: Just swap them? Or return 0?
          // Let's swap the definitions for this problem instance to ensure solvability.
          const n1 = getRandomInt(params.firstOperandMin, params.firstOperandMax);
          const n2 = getRandomInt(params.secondOperandMin, params.secondOperandMax);
          num1 = Math.max(n1, n2);
          num2 = Math.min(n1, n2);
        }
      }
      break;
    }
    case 'division': {
        const secondMin = Math.max(1, params.secondOperandMin);
        const secondMax = Math.max(secondMin, params.secondOperandMax);

        const candidates = buildCandidateList(secondMin, secondMax);

        let found = false;
        for (const candidate of candidates) {
          const minQ = Math.ceil(params.firstOperandMin / candidate);
          const maxQ = Math.floor(params.firstOperandMax / candidate);
          if (minQ <= maxQ) {
            num2 = candidate;
            num1 = getRandomInt(minQ, maxQ) * candidate;
            found = true;
            break;
          }
        }

        if (!found) {
          num2 = candidates[0];
          const closestQuotient = Math.max(1, Math.round(params.firstOperandMin / num2));
          num1 = closestQuotient * num2;
        }
      break;
    }
  }

  return {
    num1,
    num2,
    operation,
    answer: calculateAnswer(num1, num2, operation)
  };
}

function calculateAnswer(n1: number, n2: number, op: Operation): number {
  switch(op) {
    case 'addition': return n1 + n2;
    case 'subtraction': return n1 - n2;
    case 'multiplication': return n1 * n2;
    case 'division': return n1 / n2;
  }
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildCandidateList(min: number, max: number): number[] {
  const range = max - min + 1;
  const candidates: number[] = [];
  if (range <= 20) {
    for (let i = min; i <= max; i++) candidates.push(i);
    for (let i = candidates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }
  } else {
    const tried = new Set<number>();
    while (tried.size < 20) {
      const v = getRandomInt(min, max);
      if (!tried.has(v)) {
        tried.add(v);
        candidates.push(v);
      }
    }
  }
  return candidates;
}
