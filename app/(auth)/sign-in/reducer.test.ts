import { describe, expect, it } from 'vitest';

import { initialState, reducer, type SignInPageEntity } from './reducer';

describe(`sign-in ${reducer.name}`, () => {
  it('starts idle', () => {
    expect(initialState).toEqual({ status: 'idle' });
  });

  it('moves to submitting when a submit starts', () => {
    expect(reducer(initialState, { type: 'SUBMIT_STARTED' })).toEqual({
      status: 'submitting',
    });
  });

  it('records the code when a submit fails', () => {
    const submitting: SignInPageEntity = { status: 'submitting' };

    expect(
      reducer(submitting, {
        type: 'SUBMIT_FAILED',
        code: 'invalid_credentials',
      })
    ).toEqual({ status: 'failure', code: 'invalid_credentials' });
  });

  it('clears a previous failure when the next submit starts', () => {
    const failed: SignInPageEntity = {
      status: 'failure',
      code: 'invalid_credentials',
    };

    expect(reducer(failed, { type: 'SUBMIT_STARTED' })).toEqual({
      status: 'submitting',
    });
  });
});
