'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { Checkbox } from '../ui/checkbox';
import { truncateString } from '@/lib/client/utils';
import {
  DataTableBooleanSortColumnHeader,
  DataTableFilterColumnHeader,
} from '../ui/data-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { MoreHorizontal } from 'lucide-react';

export type UserColumnData = {
  id: string;
  email: string;
  isVerified: string;
  orders: string[];
};

const columnHelper = createColumnHelper<UserColumnData>();

export const defaultUserColumns = [
  columnHelper.display({
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.group({
    id: 'users',
    header: () => <div>Users</div>,
    enableHiding: false,
    columns: [
      columnHelper.accessor('id', {
        cell: (info) => (
          <div className="text-right font-medium">
            {truncateString(info.getValue() as string, 8)}
          </div>
        ),
        header: ({ column }) => (
          <DataTableFilterColumnHeader
            column={column}
            title="Id"
            className="justify-end"
          />
        ),
      }),
      columnHelper.accessor('email', {
        cell: (info) => (
          <div className="text-right font-medium">{info.getValue()}</div>
        ),
        header: ({ column }) => (
          <DataTableFilterColumnHeader
            column={column}
            title="Email"
            className="justify-end"
          />
        ),
      }),
      columnHelper.accessor('isVerified', {
        cell: (info) => (
          <div className="text-right font-medium">{info.getValue()}</div>
        ),
        header: ({ column }) => (
          <DataTableBooleanSortColumnHeader
            column={column}
            title="Is Verified?"
            className="justify-end"
          />
        ),
        sortingFn: 'basic',
      }),
      columnHelper.accessor('orders', {
        cell: (info) => {
          const orders = info.getValue() as string[];
          return (
            <>
              {orders.map((order) => (
                <p key={order} className="text-right font-medium">
                  {order}
                </p>
              ))}
            </>
          );
        },
        header: () => <div className="text-right">Orders</div>,
      }),
    ],
  }),
  columnHelper.display({
    id: 'actions',
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.id)}
            >
              Copy user ID
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.email)}
            >
              Copy email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>TODO: View customer</DropdownMenuItem>
            <DropdownMenuItem>TODO: View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }),
];
