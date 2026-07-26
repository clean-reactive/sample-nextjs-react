---
name: factory-t
description: >
    Use factory-t to write test factories; create, write, or update mock data
    factories, build entity factories, generate test data.
---

# factory-t skill

Use this skill when creating or updating factory files that generate test/mock
data using the `factory-t` library. Factories are responsible for creation of
data with possible variations in a set. Consumers responsible for the size of
set and the set specification.

```ts
import { factoryT, factoryTBuilder, fields } from 'factory-t';
```

Always import from the bare `'factory-t'` package name (it is installed as an
npm dependency).

---

## Declaring data

Factories live co-located with the type they produce.

| What | Convention |
|------|-----------|
| File name | `<EntityName>.factories.ts` (PascalCase) |
| Export name | `<entityName>Factory` (camelCase) — e.g. `headerEntityFactory` |
| Location — API layer | `js-app/src/api/<ApiGroup>/factories/<Name>.factories.ts` |
| Location — entity layer | `js-app/src/features/<feature>/repositories/<repo>/types/<Entity>.factories.ts` |
| Location — shared repo | `js-app/src/repositories/<repo>/types/<Entity>.factories.ts` |

Factories are exported from their own file; collect them in the nearest
`index.ts` only if the pattern already exists there.

### `factoryT<T>(config)` — simple factory

Use when no field depends on another field.

```ts
export const myEntityFactory = factoryT<MyEntity>({
  id: (ctx) => `entity-${ctx.index}`,          // ctx.index: auto-incremented int (starts at 1)
  name: 'static value',                        // static value
  role: fields.sequence(['A', 'B', 'C']),      // cycles through array by index
  count: fields.index(),                       // returns ctx.index as number
  note: fields.nullable('default text'),       // T | null, emphasizes nullability
  tag: fields.optional('value'),               // T | undefined, emphasizes optionality
  label: fields.string(),                      // generates 'string-field-value-<index>'
  nested: () => otherFactory.item(),           // compose: call another factory per item
  list: () => otherFactory.list({ count: 3 }), // compose a list per item
  inline: { key: 'value', count: 0 },          // static nested object (passed as-is)
  tags: ['a', 'b'],                            // static array (passed as-is)
});
```

> **All composed factory calls must be lazy** — always wrap them in `() =>`:
>
> ```ts
> list: () => otherFactory.list({ count: 3 })  // ✓ lazy — evaluated per item() call
> list: otherFactory.list({ count: 3 })        // ✗ eager — evaluated once at module load
> ```
>
> Eager calls execute at import time, **bloating** startup cost for every test file
> that imports the factory. Non-lazy declarations are the exception; if you use
> one intentionally (e.g. a fixed static list), add a comment explaining why.

`NonNullable<T>` wrapping is common when the entity type is `T | null`:

```ts
export const headerEntityFactory = factoryT<NonNullable<HeaderEntity>>({
  // ...
});
```

### `factoryTBuilder<T>(config)` — builder (use when fields depend on each other)

The constructor defines the **TypeScript type inference shape** — every field
must appear here so the type system can infer `T`. Fields that need complex
logic are overridden with `.setFieldFactory()`. All constructor fields are
automatically injectable.

```ts
export const myFactory = factoryTBuilder<MyEntity>({
  id: fields.string(),           // placeholder for TS — overridden below
  title: fields.string(),        // placeholder for TS — overridden below
  status: fields.sequence(statuses),
  draftStatus: fields.string(),  // placeholder — overridden with computed logic
  total: 0,                      // placeholder — overridden with aggregate
  items: () => itemFactory.list({ count: 3 }),
})
  .setFieldFactory('id', (ctx) => `entity-${ctx.index}`)
  .setFieldFactory('title', fields.sequence(titles))   // accepts fields.* directly
  .setFieldFactory('draftStatus', (ctx) => {
    const status = ctx.inject('status');               // inject any field
    return status === 'active' ? 'live' : 'archived';
  })
  .setFieldFactory('total', (ctx) => {                 // aggregate from multiple injected fields
    const items = ctx.inject('items');
    return items.length;
  })
  .factory(); // always call .factory() to get the FactoryT instance
```

Key rules:

- **Every field must be in the constructor** — even if just a placeholder value.
- **`setFieldFactory` overrides constructor fields** — the constructor value is
  discarded for that field.
- **`setFieldFactory` accepts either `(ctx) => value` or a `fields.*` helper
  directly** (e.g. `fields.sequence(arr)`).
- **`ctx.inject(key)` works on any field**, whether it is constructor-only or
  overridden by `setFieldFactory`.

### `fields.optional` wrapping a sequence

`fields.optional(fields.sequence(values))` is **functionally identical** to
`fields.sequence(values)` — `fields.optional` is an identity function that
returns its argument unchanged. The wrapper is a style convention seen in this
codebase to signal that the field's type is `T | undefined`:

```ts
factoryTBuilder<AssociatedFilingEntity>({
  leadClass: fields.optional(fields.sequence(leadClasses)),
  // ...
})
```

It never actually produces `undefined`. When `undefined` should be **one of
the cycling values**, put it directly inside the sequence array instead —
see the Gotchas below.

### Patterns seen in this codebase

See `references/codebase-patterns.md` for ready-to-copy examples covering:
simple entity, composed factory, builder with dependent fields, aggregate
injection, derived sibling fields, and `fields.optional(fields.sequence(...))`.

### Gotchas (declaring)

- `fields.optional(undefined)` is a **zero-variation trap** — it always
  produces `undefined`. When `undefined` should be one value among several,
  put it directly in the sequence array:

  ```ts
  // ✗ always undefined, no variation
  requestError: fields.optional(undefined),

  // ✓ cycles through undefined and a real value
  const requestErrors: Array<ApiValidationRequestErrorDto | undefined> = [
    undefined,
    { title: 'Bad Request', httpCode: '400' },
  ];
  requestError: fields.sequence(requestErrors),
  ```

- `fields.nullable(x)` and `fields.optional(x)` are **identity functions** —
  they return `x` unchanged. Their purpose is to communicate intent. You can
  pass either a plain value or another `fields.*` factory function (e.g.
  `fields.optional(fields.sequence(arr))`).
- `fields.sequence` cycles by `(ctx.index - 1) % array.length`, so the first
  call returns `items[0]`.
- The builder `.setFieldFactory()` calls override the shape defined in the
  constructor — the constructor shape is only for TypeScript inference; always
  call `.factory()` at the end of the chain.
- `factoryTBuilder` supports `.inheritedBuilder<ChildType>(extraFields)` for
  extending a base factory into a discriminated union child type (not currently
  used in this codebase).

---

## Consuming data

Factories are consumed in unit tests, mapper specs, and MSW handler setup.
Factories own the shape; tests own which fields matter for the case under test.

### Instance methods

```ts
factory.item()                                       // one object with defaults
factory.item({ fieldA: override })                   // override specific fields
factory.list({ count: 3 })                           // array of 3 objects
factory.list({ count: 3, partial: { name: 'x' } })  // all items share an override
factory.list({ partials: [{ id: 1 }, { id: 2 }] })  // per-item overrides
factory.list({ count: 2 }, options)                  // array with options
factory.resetCount()                                 // reset index back to 1
```

### Override only the field the test cares about

```ts
const item = apiDossiersContentActionItemFactory.item({
  status: 'DRAFT',   // only override what the test needs; defaults handle the rest
});
```

### Per-item overrides — testing filter/mapping logic

```ts
const items = factory.list({
  count: 4,
  partials: [
    { actionId: undefined },   // should be filtered out
    { actionName: undefined },  // should be filtered out
    { status: undefined },      // should be filtered out
    { status: 'Circulated' },   // only valid item
  ],
});
const result = items.reduce(mapToActionsListEntities, []);
expect(result).toHaveLength(1);
```

### MSW response bodies

Build the DTO array from the factory and return it from the handler:

```ts
const listDto = factory.list({
  count: 3,
  partials: [{ status: 'DRAFT' }, { status: 'Circulated' }, { status: 'Dispatched' }],
});
server.use(
  http.get(path, () => HttpResponse.json({ actions: { actionsList: listDto } })),
);
```

### Reset index for deterministic assertions

When a test asserts exact field values that depend on `ctx.index`, reset in
`beforeEach` so each test starts at index 1:

```ts
beforeEach(() => {
  myFactory.resetCount();
});
```

### Gotchas (consuming)

- When composing nested factories (`() => other.item()`), each call to the
  outer factory's `item()` increments the outer index, but the inner factory
  maintains its own independent counter. Reset both in `beforeEach` if both
  produce index-dependent values.
- `factory.list({ partials })` length determines `count` — you don't need to
  also pass `count` when using `partials`.

---

## Evals & review

- **Creation evals** (input type → assertions → canonical output):
  `evals/01-simple-entity.md`, `evals/02-nullable-optional.md`,
  `evals/03-builder-deps.md`, `evals/04-lazy-composition.md`
- **PR review checklist**: `review-checklist.md`
