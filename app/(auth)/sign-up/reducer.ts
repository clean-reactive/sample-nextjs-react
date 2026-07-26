export type SignUpFailureCode =
  'invalid_data' | 'username_taken' | 'password_mismatch' | 'unexpected_error';

export type SignUpPageEntity =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'failure'; code: SignUpFailureCode };

export type SignUpPageEvent =
  | { type: 'SUBMIT_STARTED' }
  | { type: 'SUBMIT_FAILED'; code: SignUpFailureCode };

export const initialState: SignUpPageEntity = { status: 'idle' };

export function reducer(
  _state: SignUpPageEntity,
  event: SignUpPageEvent
): SignUpPageEntity {
  switch (event.type) {
    case 'SUBMIT_STARTED':
      return { status: 'submitting' };
    case 'SUBMIT_FAILED':
      return { status: 'failure', code: event.code };
  }
}
