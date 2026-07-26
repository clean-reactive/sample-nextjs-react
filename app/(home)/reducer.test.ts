import { describe, expect, it } from 'vitest';

import { initialState, reducer, type HomePageState } from './reducer';

describe(`home ${reducer.name}`, () => {
  it('starts in view mode', () => {
    expect(initialState).toEqual({ status: 'view' });
  });

  it('enters bulk mode with empty selections', () => {
    expect(reducer(initialState, { type: 'BULK_MODE_ENTERED' })).toEqual({
      status: 'bulk',
      dirty: [],
      deleted: [],
    });
  });

  it('returns to view mode when bulk mode is canceled', () => {
    const bulk: HomePageState = { status: 'bulk', dirty: [1], deleted: [2] };

    expect(reducer(bulk, { type: 'BULK_MODE_CANCELED' })).toEqual({
      status: 'view',
    });
  });

  it('marks a todo dirty when toggled in bulk mode', () => {
    const bulk: HomePageState = { status: 'bulk', dirty: [], deleted: [] };

    expect(reducer(bulk, { type: 'TODO_DIRTY_TOGGLED', id: 1 })).toEqual({
      status: 'bulk',
      dirty: [1],
      deleted: [],
    });
  });

  it('unmarks a dirty todo when toggled again', () => {
    const bulk: HomePageState = { status: 'bulk', dirty: [1, 2], deleted: [] };

    expect(reducer(bulk, { type: 'TODO_DIRTY_TOGGLED', id: 1 })).toEqual({
      status: 'bulk',
      dirty: [2],
      deleted: [],
    });
  });

  it('ignores dirty toggles outside bulk mode', () => {
    expect(reducer(initialState, { type: 'TODO_DIRTY_TOGGLED', id: 1 })).toBe(
      initialState
    );
  });

  it('marks a todo for deletion and drops it from dirty', () => {
    const bulk: HomePageState = { status: 'bulk', dirty: [1, 2], deleted: [] };

    expect(reducer(bulk, { type: 'TODO_DELETION_TOGGLED', id: 1 })).toEqual({
      status: 'bulk',
      dirty: [2],
      deleted: [1],
    });
  });

  it('unmarks a deleted todo when toggled again', () => {
    const bulk: HomePageState = { status: 'bulk', dirty: [], deleted: [1, 2] };

    expect(reducer(bulk, { type: 'TODO_DELETION_TOGGLED', id: 1 })).toEqual({
      status: 'bulk',
      dirty: [],
      deleted: [2],
    });
  });

  it('ignores deletion toggles outside bulk mode', () => {
    expect(
      reducer(initialState, { type: 'TODO_DELETION_TOGGLED', id: 1 })
    ).toBe(initialState);
  });

  it('moves to updating when update all starts in bulk mode', () => {
    const bulk: HomePageState = { status: 'bulk', dirty: [1], deleted: [2] };

    expect(reducer(bulk, { type: 'UPDATE_ALL_STARTED' })).toEqual({
      status: 'updating',
      dirty: [1],
      deleted: [2],
    });
  });

  it('ignores update all start outside bulk mode', () => {
    expect(reducer(initialState, { type: 'UPDATE_ALL_STARTED' })).toBe(
      initialState
    );
  });

  it('returns to view mode when update all finishes', () => {
    const updating: HomePageState = {
      status: 'updating',
      dirty: [1],
      deleted: [2],
    };

    expect(reducer(updating, { type: 'UPDATE_ALL_FINISHED' })).toEqual({
      status: 'view',
    });
  });
});
