/**
 * Math'as Connect — contrat de résultats du jeu Addition écrite multiple.
 * Couche pure, sans réseau, sans localStorage et sans action sur le mode classique.
 * Non branchée au jeu : activation uniquement après validation du backend et des tests.
 */
export const APP_KEY = 'addition-ecrite-multiple';
export const SCHEMA_VERSION = 1;
const MODES = Object.freeze(['classic', 'sudden']);
const COUNTS = Object.freeze([4, 10, 20]);
const integer = (n, min, max) => Number.isSafeInteger(n) && n >= min && n <= max;

/** Définit une réalisation finale, jamais un clic ou calcul intermédiaire. */
export function normalizeRun(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw Error('invalid_run');
  if (!MODES.includes(raw.mode)) throw Error('invalid_mode');
  if (!integer(raw.level, 1, 3)) throw Error('invalid_level');
  if (!integer(raw.score, 0, 100000)) throw Error('invalid_score');
  const result = { mode: raw.mode, level: raw.level, score: raw.score };
  if (raw.mode === 'classic') {
    if (!COUNTS.includes(raw.total) || raw.score > raw.total) throw Error('invalid_classic_result');
    result.total = raw.total;
  } else if (raw.total != null) {
    throw Error('invalid_sudden_total');
  }
  return Object.freeze(result);
}

/** État minimal destiné à l'adaptateur Connect; les préférences locales restent locales. */
export function emptyState() {
  return {
    classic: Array.from({ length: 3 }, () => ({})),
    sudden: [0, 0, 0]
  };
}
export function mergeRun(state, input) {
  const run = normalizeRun(input);
  const next = emptyState();
  for (let i = 0; i < 3; i++) {
    const old = state?.classic?.[i] || {};
    for (const count of COUNTS) {
      const value = old[count];
      if (value != null) {
        if (!integer(value, 0, count)) throw Error('invalid_existing_classic');
        next.classic[i][count] = value;
      }
    }
    const sudden = state?.sudden?.[i] ?? 0;
    if (!integer(sudden, 0, 100000)) throw Error('invalid_existing_sudden');
    next.sudden[i] = sudden;
  }
  const slot = run.level - 1;
  if (run.mode === 'classic') {
    next.classic[slot][run.total] = Math.max(next.classic[slot][run.total] ?? 0, run.score);
  } else {
    next.sudden[slot] = Math.max(next.sudden[slot], run.score);
  }
  return next;
}

/** Jamais d'XP décidé dans le navigateur : attribution exclusivement côté serveur. */
export const XP_POLICY = 'server-only';
