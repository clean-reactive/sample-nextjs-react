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
import { initialState, reducer } from './reducer';
import { useController } from './hooks/use-controller';
import { usePresenter } from './hooks/use-presenter';

export default function SignUpPage() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    errorMessage,
    hasErrorVisible,
    isCreateAccountSpinnerVisible,
    isCreateAccountLabelVisible,
    isCreateButtonDisabled,
  } = usePresenter({ state });

  const { onFormSubmit } = useController({ state, dispatch });

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Sign up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col p-6 gap-4">
        <form onSubmit={onFormSubmit}>
          <div className="grid gap-4">
            {hasErrorVisible && (
              <p data-testid="sign-up-error" className="text-destructive">
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
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                name="confirm_password"
                type="password"
                data-testid="confirm-password-input"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isCreateButtonDisabled}
              className="w-full"
              data-testid="sign-up-button"
            >
              {isCreateAccountSpinnerVisible && (
                <Loader className="animate-spin" />
              )}
              {isCreateAccountLabelVisible && 'Create an account'}
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link
              href="/sign-in"
              className="underline"
              data-testid="sign-in-link"
            >
              Sign in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
