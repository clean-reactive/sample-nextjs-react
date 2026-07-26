/**
 * Which persistence backend the DI container wires up, chosen by the
 * `PERSISTENCE` env var (see the `dev:in-file` / `dev:sqlite` npm scripts):
 *
 * - `in-file` — the file-backed repositories plus the dev auth/transaction
 *   doubles (no database required).
 * - anything else (default) — the real DB-backed implementations.
 */
export const USE_IN_FILE = process.env.PERSISTENCE === 'in-file';
