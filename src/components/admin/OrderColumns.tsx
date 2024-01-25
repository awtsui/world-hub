'use client';

import { formatDate, truncateString } from '@/lib/client/utils';
import { createColumnHelper } from '@tanstack/react-table';
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
import {
  DataTableBooleanSortColumnHeader,
  DataTableFilterColumnHeader,
  DataTableSortColumnHeader,
} from '../ui/data-table';
import { Checkbox } from '../ui/checkbox';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type OrderColumnData = {
  id: string;
  userId: string;
  amount: number;
  totalPrice: string;
  isPaid: string; // boolean
  email: string;
  timestamp: Date;
};

// TODO: include ticket data and ticket ids

const columnHelper = createColumnHelper<OrderColumnData>();

export const defaultOrderColumns = [
  columnHelper.display({
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
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
    id: 'orders',
    header: () => <div>Orders</div>,
    enableHiding: false,
    columns: [
      columnHelper.accessor('id', {
        cell: (info) => <div className="text-right font-medium">{truncateString(info.getValue() as string, 8)}</div>,
        header: ({ column }) => <DataTableFilterColumnHeader column={column} title="Id" className="justify-end" />,
      }),
      columnHelper.accessor('userId', {
        cell: (info) => <div className="text-right font-medium">{truncateString(info.getValue() as string, 8)}</div>,
        header: ({ column }) => <DataTableFilterColumnHeader column={column} title="User Id" className="justify-end" />,
      }),
      columnHelper.accessor('email', {
        cell: (info) => <div className="text-right font-medium">{info.getValue()}</div>,
        header: ({ column }) => <DataTableFilterColumnHeader column={column} title="Email" className="justify-end" />,
      }),
      columnHelper.accessor('amount', {
        cell: (info) => <div className="text-right font-medium">{info.getValue()}</div>,
        header: ({ column }) => <DataTableSortColumnHeader column={column} title="Amount" className="justify-end" />,
      }),
      columnHelper.accessor('totalPrice', {
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue('totalPrice'));
          const formatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(amount);

          return <div className="text-right font-medium">{formatted}</div>;
        },
        header: ({ column }) => (
          <DataTableSortColumnHeader column={column} title="Total Price" className="justify-end" />
        ),
      }),
      columnHelper.accessor('isPaid', {
        cell: (info) => <div className="text-right font-medium">{info.getValue()}</div>,
        header: ({ column }) => (
          <DataTableBooleanSortColumnHeader column={column} title="Is Paid?" className="justify-end" />
        ),
        sortingFn: 'basic',
      }),
      columnHelper.accessor('timestamp', {
        cell: (info) => {
          const timestamp = info.getValue();
          const formatted = formatDate(timestamp);
          return <div className="text-right font-medium">{formatted}</div>;
        },
        header: ({ column }) => <DataTableSortColumnHeader column={column} title="Timestamp" className="justify-end" />,
      }),
    ],
  }),
  columnHelper.display({
    id: 'actions',
    cell: ({ row }) => {
      const order = row.original;

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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(order.id)}>Copy order ID</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(order.userId)}>
              Copy user ID
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(order.email)}>Copy email</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>TODO: View customer</DropdownMenuItem>
            <DropdownMenuItem>TODO: View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }),
];
