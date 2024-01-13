'use client';

import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { usePathname, useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from './ui/dropdown-menu';
import { LogOut, LucideIcon } from 'lucide-react';

type MenuItem = {
  label: string;
  icon: LucideIcon;
  url: string;
};

interface AuthButtonProps {
  signInCallbackUrl?: string;
  signOutCallbackUrl?: string;
  menuItems?: MenuItem[];
}

export default function AuthButton({
  signInCallbackUrl,
  signOutCallbackUrl,
  menuItems,
}: AuthButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();

  function handleSignOut() {
    signOut({ redirect: false }).then(() => {
      router.push(signOutCallbackUrl ?? '/');
    });
  }

  function handleSignIn() {
    router.push(`/auth/signin?callbackUrl=${signInCallbackUrl ?? '/'}`);
  }

  return (
    <div className="flex">
      {session ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.png" />
                <AvatarFallback>WH</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {menuItems && (
              <>
                <DropdownMenuGroup>
                  {menuItems.map((menuItem) => (
                    <DropdownMenuItem
                      key={menuItem.label}
                      onClick={() => router.push(menuItem.url)}
                    >
                      <menuItem.icon className="mr-2 h-4 w-4" />
                      <span>{menuItem.label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button variant="ghost" onClick={handleSignIn}>
          Log in
        </Button>
      )}
    </div>
  );
}
