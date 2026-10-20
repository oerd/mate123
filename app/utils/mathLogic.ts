import {
  TestParameters,
  Operation,
  allOperations,
  RoundingNearest,
  roundingNearestOptions,
  RoundingAnswers,
  roundingAnswersOptions,
  comparisonModeOptions,
} from '../TestParametersContext';

export const COMPARISON_LESS = -1;
export const COMPARISON_EQUAL = 0;
export const COMPARISON_GREATER = 1;
export const comparisonAnswers = [COMPARISON_LESS, COMPARISON_EQUAL, COMPARISON_GREATER];

export function comparisonSymbol(value: number): string {
  if (value < 0) return '<';
  if (value > 0) return '>';
  return '=';
}

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

  const roundingNearest = roundingNearestOptions.includes(params.roundingNearest)
    ? params.roundingNearest
    : 10;
  const roundingAnswers = roundingAnswersOptions.includes(params.roundingAnswers)
    ? params.roundingAnswers
    : 2;
  const comparisonModes = comparisonModeOptions.filter((mode) => (params.comparisonModes ?? []).includes(mode));

  return {
    firstOperandMin: Math.min(firstMin, firstMax),
    firstOperandMax: Math.max(firstMin, firstMax),
    secondOperandMin: Math.min(secondMin, secondMax),
    secondOperandMax: Math.max(secondMin, secondMax),
    operations: validOps.length > 0 ? validOps : ['addition'],
    numberOfResults: clamp(params.numberOfResults, 2, 8),
    sortResults: Boolean(params.sortResults),
    roundingNearest,
    roundingAnswers,
    roundingNumberLine: Boolean(params.roundingNumberLine),
    comparisonModes: comparisonModes.length > 0 ? comparisonModes : ['numbers'],
  };
}

export interface MathProblem {
  num1: number;
  num2: number;
  operation: Operation;
  answer: number;
  addends?: [number, number];
}

export function roundToNearest(value: number, nearest: RoundingNearest): number {
  return Math.round(value / nearest) * nearest;
}

export function roundingRange(params: TestParameters): { min: number; max: number } {
  const nearest = params.roundingNearest;
  if (params.firstOperandMax > nearest) {
    return { min: params.firstOperandMin, max: params.firstOperandMax };
  }
  return { min: nearest + 1, max: nearest * 10 - 1 };
}

function generateRoundingProblem(params: TestParameters): MathProblem {
  const nearest = params.roundingNearest;
  const { min, max } = roundingRange(params);
  let num1 = getRandomInt(min, max);
  for (let attempts = 0; num1 % nearest === 0 && attempts < 20; attempts++) {
    num1 = getRandomInt(min, max);
  }
  if (num1 % nearest === 0) {
    num1 = Math.min(max, num1 + 1);
  }
  return { num1, num2: nearest, operation: 'rounding', answer: roundToNearest(num1, nearest) };
}

const EQUAL_COMPARISON_PROBABILITY = 0.2;

function generateComparisonProblem(params: TestParameters): MathProblem {
  const equal = Math.random() < EQUAL_COMPARISON_PROBABILITY;
  const modes = params.comparisonModes.length > 0 ? params.comparisonModes : ['numbers'];
  const mode = modes[Math.floor(Math.random() * modes.length)];
  if (mode === 'sums') {
    const a = getRandomInt(params.firstOperandMin, params.firstOperandMax);
    const b = getRandomInt(params.secondOperandMin, params.secondOperandMax);
    const num1 = a + b;
    let num2 = num1;
    if (!equal) {
      const delta = getRandomInt(1, 4) * (Math.random() < 0.5 ? -1 : 1);
      num2 = Math.max(0, num1 + delta);
      if (num2 === num1) num2 = num1 + Math.abs(delta);
    }
    return { num1, num2, operation: 'comparison', answer: Math.sign(num1 - num2), addends: [a, b] };
  }
  const num1 = getRandomInt(params.firstOperandMin, params.firstOperandMax);
  const num2 = equal ? num1 : getRandomInt(params.secondOperandMin, params.secondOperandMax);
  return { num1, num2, operation: 'comparison', answer: Math.sign(num1 - num2) };
}

export function generateRoundingOptions(
  problem: MathProblem,
  count: RoundingAnswers,
  sortResults: boolean
): number[] {
  const nearest = problem.num2;
  const lower = Math.floor(problem.num1 / nearest) * nearest;
  const upper = lower + nearest;
  const options = [lower, upper];
  if (count > 2) {
    const extras = [lower - nearest, upper + nearest, problem.num1];
    for (const candidate of extras) {
      if (options.length >= count) break;
      if (candidate >= 0 && !options.includes(candidate)) options.push(candidate);
    }
  }
  return sortResults ? options.sort((a, b) => a - b) : shuffle(options);
}

export function generateOptionsForProblem(problem: MathProblem, params: TestParameters): number[] {
  switch (problem.operation) {
    case 'comparison':
      return [...comparisonAnswers];
    case 'rounding':
      return generateRoundingOptions(problem, params.roundingAnswers, params.sortResults);
    default:
      return generateAnswerOptions(problem.answer, {
        numberOfResults: params.numberOfResults,
        sortResults: params.sortResults,
      });
  }
}

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateProblem(params: TestParameters, operation: Operation): MathProblem {
  if (operation === 'rounding') return generateRoundingProblem(params);
  if (operation === 'comparison') return generateComparisonProblem(params);

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
    case 'rounding': return roundToNearest(n1, n2 as RoundingNearest);
    case 'comparison': return Math.sign(n1 - n2);
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
