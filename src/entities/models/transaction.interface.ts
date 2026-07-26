/**
 * Opaque handle to an open transaction. Repository calls receive it so their
 * writes join that transaction.
 *
 * It is `unknown` on purpose: the concrete handle is backend-specific (see
 * `SqliteTransaction`, `InFileTransaction`), so the application layer names
 * that such a thing exists without describing it - naming it here would make
 * the innermost layer depend on infrastructure.
 */
export type ITransaction = unknown;
