/**
 * @description The todo enterprise business entity as the client holds it.
 * Server-owned: the page action supplies it and the client only reads it -
 * there is no transition on this side, unlike HomePageEntity.
 * @owner The page; the page action supplies it, the presenters project it.
 * @emerges From the domain, not from a single view - declared here rather
 * than imported from src/entities/models/todo because the client and the
 * server are separate circles, each owning its own declaration. The two meet
 * structurally inside the page action.
 */
export type TodoEntity = {
  id: number;
  todo: string;
  userId: string;
  completed: boolean;
};

/**
 * @description The values the page action interpolates into the template.
 * @owner The template; page.action.ts produces it.
 */
export type HomePageTemplateData = { todos: TodoEntity[] };

/**
 * @description Page action of the home page - prepares the template for the
 * user. It may interpolate values, redirect, or both; a page action that only
 * guards resolves with `void`.
 * @owner The template (page.tsx); page.action.ts implements it.
 * @emerges From the template's needs, exactly as gateway.types.ts emerges
 * from the client controllers' needs. Not exposed - unlike a gateway action
 * it is `server-only`, so it is not an endpoint.
 */
export type HomePageAction = () => Promise<HomePageTemplateData>;
