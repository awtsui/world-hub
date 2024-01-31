'use client';

import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from './ui/dropdown-menu';
import { LogOut } from 'lucide-react';
import { MenuItem } from '@/lib/types';

interface AuthButtonProps {
  signInCallbackUrl?: string;
  signOutCallbackUrl?: string;
  menuItems?: MenuItem[];
  imageUrl?: string;
}

export default function AuthButton({ signInCallbackUrl, signOutCallbackUrl, menuItems, imageUrl }: AuthButtonProps) {
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
              <Avatar className="h-12 w-12 relative">
                <AvatarImage src={imageUrl} className="object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity duration-500"></div>
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
                    <DropdownMenuItem key={menuItem.label} onClick={() => router.push(menuItem.url)}>
                      <menuItem.icon className="mr-2 h-4 w-4" />
                      <span>{menuItem.label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4 text-md" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button className="text-md" variant="ghost" onClick={handleSignIn}>
          Sign in
        </Button>
      )}
    </div>
  );
}
