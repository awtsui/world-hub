'use client';

import { truncateString } from '@/lib/client/utils';
import { Checkbox } from '@radix-ui/react-checkbox';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTableFilterColumnHeader } from '../ui/data-table';
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
import { HostApprovalStatus } from '@/lib/types';
import {
  deleteRejectedHost,
  updateHostAccountApprovalStatus,
} from '@/lib/actions';

export type HostColumnData = {
  id: string;
  name: string;
  email: string;
  biography: string;
  events: string[];
  approvalStatus: HostApprovalStatus;
};

const columnHelper = createColumnHelper<HostColumnData>();

export const defaultHostColumns = [
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
    id: 'hosts',
    header: () => <div>Hosts</div>,
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
      columnHelper.accessor('approvalStatus', {
        cell: (info) => (
          <div className="text-right font-medium">{info.getValue()}</div>
        ),
        header: ({ column }) => (
          <DataTableFilterColumnHeader
            column={column}
            title="Approval Status"
            className="justify-end"
          />
        ),
      }),
      columnHelper.accessor('name', {
        cell: (info) => (
          <div className="text-right font-medium">{info.getValue()}</div>
        ),
        header: ({ column }) => (
          <DataTableFilterColumnHeader
            column={column}
            title="Name"
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
      columnHelper.accessor('biography', {
        cell: (info) => (
          <div className="text-right font-medium">
            {truncateString(info.getValue() as string, 30)}
          </div>
        ),
        header: () => <p className="text-right font-medium">Biography</p>,
      }),
      columnHelper.accessor('events', {
        cell: (info) => {
          const events = info.getValue() as string[];
          return (
            <div className="text-right font-medium">
              {events.toSorted().join(', ')}
            </div>
          );
        },
        header: () => <div className="text-right">Events</div>,
      }),
    ],
  }),
  columnHelper.display({
    id: 'actions',
    cell: ({ row }) => {
      const host = row.original;

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
              onClick={() => navigator.clipboard.writeText(host.id)}
            >
              Copy host ID
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(host.email)}
            >
              Copy email
            </DropdownMenuItem>
            {row.getValue('approvalStatus') === HostApprovalStatus.Pending && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    updateHostAccountApprovalStatus(
                      row.getValue('id'),
                      HostApprovalStatus.Approved
                    )
                  }
                >
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    updateHostAccountApprovalStatus(
                      row.getValue('id'),
                      HostApprovalStatus.Rejected
                    )
                  }
                >
                  Reject
                </DropdownMenuItem>
              </>
            )}
            {row.getValue('approvalStatus') === HostApprovalStatus.Rejected && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="mx-auto">
                  <Button
                    variant={'destructive'}
                    className="h-8 w-20"
                    onClick={() => deleteRejectedHost(row.getValue('id'))}
                  >
                    Delete
                  </Button>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }),
];
