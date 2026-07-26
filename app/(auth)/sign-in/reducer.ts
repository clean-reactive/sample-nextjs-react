export type SignInFailureCode = 'invalid_credentials' | 'unexpected_error';

export type SignInPageEntity =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'failure'; code: SignInFailureCode };

export type SignInPageEvent =
  | { type: 'SUBMIT_STARTED' }
  | { type: 'SUBMIT_FAILED'; code: SignInFailureCode };

export const initialState: SignInPageEntity = { status: 'idle' };

export function reducer(
  _state: SignInPageEntity,
  event: SignInPageEvent
): SignInPageEntity {
  switch (event.type) {
    case 'SUBMIT_STARTED':
      return { status: 'submitting' };
    case 'SUBMIT_FAILED':
      return { status: 'failure', code: event.code };
  }
}
