export type HomePageState =
  | { status: 'view' }
  | { status: 'bulk'; dirty: number[]; deleted: number[] }
  | { status: 'updating'; dirty: number[]; deleted: number[] };

export type HomePageEvent =
  | { type: 'BULK_MODE_ENTERED' }
  | { type: 'BULK_MODE_CANCELED' }
  | { type: 'TODO_DIRTY_TOGGLED'; id: number }
  | { type: 'TODO_DELETION_TOGGLED'; id: number }
  | { type: 'UPDATE_ALL_STARTED' }
  | { type: 'UPDATE_ALL_FINISHED' };

export const initialState: HomePageState = { status: 'view' };

const toggleMembership = (ids: number[], id: number) =>
  ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id];

export function reducer(
  state: HomePageState,
  event: HomePageEvent
): HomePageState {
  switch (event.type) {
    case 'BULK_MODE_ENTERED':
      return { status: 'bulk', dirty: [], deleted: [] };
    case 'BULK_MODE_CANCELED':
      return { status: 'view' };
    case 'TODO_DIRTY_TOGGLED':
      if (state.status !== 'bulk') return state;
      return { ...state, dirty: toggleMembership(state.dirty, event.id) };
    case 'TODO_DELETION_TOGGLED':
      if (state.status !== 'bulk') return state;
      return {
        ...state,
        dirty: state.dirty.filter((i) => i !== event.id),
        deleted: toggleMembership(state.deleted, event.id),
      };
    case 'UPDATE_ALL_STARTED':
      if (state.status !== 'bulk') return state;
      return { ...state, status: 'updating' };
    case 'UPDATE_ALL_FINISHED':
      return { status: 'view' };
  }
}
