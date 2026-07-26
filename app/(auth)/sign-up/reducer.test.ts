import { describe, expect, it } from 'vitest';

import { initialState, reducer, type SignUpPageEntity } from './reducer';

describe(`sign-up ${reducer.name}`, () => {
  it('starts idle', () => {
    expect(initialState).toEqual({ status: 'idle' });
  });

  it('moves to submitting when a submit starts', () => {
    expect(reducer(initialState, { type: 'SUBMIT_STARTED' })).toEqual({
      status: 'submitting',
    });
  });

  it('records the code when a submit fails', () => {
    const submitting: SignUpPageEntity = { status: 'submitting' };

    expect(
      reducer(submitting, {
        type: 'SUBMIT_FAILED',
        code: 'username_taken',
      })
    ).toEqual({ status: 'failure', code: 'username_taken' });
  });

  it('clears a previous failure when the next submit starts', () => {
    const failed: SignUpPageEntity = {
      status: 'failure',
      code: 'password_mismatch',
    };

    expect(reducer(failed, { type: 'SUBMIT_STARTED' })).toEqual({
      status: 'submitting',
    });
  });
});
