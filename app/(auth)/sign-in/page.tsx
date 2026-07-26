'use client';

import Link from 'next/link';
import { useReducer } from 'react';
import { Loader } from 'lucide-react';

import { Button } from '../../_components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../_components/ui/card';
import { Input } from '../../_components/ui/input';
import { Label } from '../../_components/ui/label';
import { Separator } from '../../_components/ui/separator';
import { signInAction } from './actions';
import { initialState, reducer, type SignInFailureCode } from './reducer';

const errorMessages: Record<SignInFailureCode, string> = {
  invalid_credentials: 'Incorrect username or password',
  unexpected_error: 'Something went wrong. Please try again.',
};

export default function SignInPage() {
  // entities
  const [state, dispatch] = useReducer(reducer, initialState);

  // presenter
  const isSubmitting = state.status === 'submitting';
  const errorMessage =
    state.status === 'failure' ? errorMessages[state.code] : undefined;
  const hasErrorVisible = !!errorMessage;
  const isLoginSpinnerVisible = isSubmitting;
  const isLoginLabelVisible = !isSubmitting;
  const isLoginButtonDisabled = isSubmitting;

  // controller
  const onFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const formData = new FormData(event.currentTarget);

    dispatch({ type: 'SUBMIT_STARTED' });
    try {
      const res = await signInAction(formData);
      if (res?.status === 'failure') {
        dispatch({ type: 'SUBMIT_FAILED', code: res.code });
      }
    } catch {
      dispatch({ type: 'SUBMIT_FAILED', code: 'unexpected_error' });
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col p-6 gap-4">
        <form onSubmit={onFormSubmit}>
          <div className="grid gap-4">
            {hasErrorVisible && (
              <p data-testid="sign-in-error" className="text-destructive">
                {errorMessage}
              </p>
            )}
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="nikolovlazar"
                data-testid="username-input"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                data-testid="password-input"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isLoginButtonDisabled}
              className="w-full"
              data-testid="sign-in-button"
            >
              {isLoginSpinnerVisible && <Loader className="animate-spin" />}
              {isLoginLabelVisible && 'Login'}
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link
              href="/sign-up"
              className="underline"
              data-testid="sign-up-link"
            >
              Sign up
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
