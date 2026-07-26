'use client';

import { Avatar, AvatarFallback } from '../../_components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../_components/ui/dropdown-menu';
import { signOutAction } from '../actions/sign-out.action';

export function UserMenu() {
  // controller
  const onSignOutClick = async () => {
    await signOutAction();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger data-testid="user-menu-trigger">
        <Avatar>
          <AvatarFallback>👤</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={onSignOutClick}
          data-testid="sign-out-menu-item"
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
