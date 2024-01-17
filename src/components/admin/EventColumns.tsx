'use client';

import { formatDate, truncateString } from '@/lib/client/utils';
import { Checkbox } from '@radix-ui/react-checkbox';
import { createColumnHelper } from '@tanstack/react-table';
import {
  DataTableFilterColumnHeader,
  DataTableSortColumnHeader,
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
import { EventApprovalStatus } from '@/lib/types';
import { deleteRejectedEvent, updateEventApprovalStatus } from '@/lib/actions';

export type EventColumnData = {
  id: string;
  title: string;
  subTitle: string;
  hostId: string;
  category: string;
  subCategory: string;
  thumbnailUrl: string;
  datetime: Date;
  currency: string;
  description: string;
  venueId: string;
  lineup: string[];
  purchaseLimit: number;
  ticketTiers: [
    {
      label: string;
      price: string;
    }
  ];
  ticketsPurchased: number;
  ticketQuantity: number;
  approvalStatus: EventApprovalStatus;
};

const columnHelper = createColumnHelper<EventColumnData>();

export const defaultEventColumns = [
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
    id: 'events',
    header: () => <div>Events</div>,
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
      columnHelper.accessor('title', {
        cell: (info) => (
          <div className="text-right font-medium">
            {truncateString(info.getValue() as string, 15)}
          </div>
        ),
        header: ({ column }) => (
          <DataTableFilterColumnHeader
            column={column}
            title="Title"
            className="justify-end"
          />
        ),
      }),
      columnHelper.accessor('subTitle', {
        cell: (info) => (
          <div className="text-right font-medium">
            {truncateString(info.getValue() as string, 15)}
          </div>
        ),
        header: () => <div className="text-right">Subtitle</div>,
      }),
      columnHelper.accessor('hostId', {
        cell: (info) => (
          <div className="text-right font-medium">
            {truncateString(info.getValue() as string, 8)}
          </div>
        ),
        header: ({ column }) => (
          <DataTableFilterColumnHeader
            column={column}
            title="Host ID"
            className="justify-end"
          />
        ),
      }),
      columnHelper.accessor('category', {
        cell: (info) => (
          <div className="text-right font-medium">{info.getValue()}</div>
        ),
        header: ({ column }) => (
          <DataTableFilterColumnHeader
            column={column}
            title="Category"
            className="justify-end"
          />
        ),
      }),
      columnHelper.accessor('subCategory', {
        cell: (info) => (
          <div className="text-right font-medium">{info.getValue()}</div>
        ),
        header: ({ column }) => (
          <DataTableFilterColumnHeader
            column={column}
            title="Subcategory"
            className="justify-end"
          />
        ),
      }),
      columnHelper.accessor('thumbnailUrl', {
        cell: (info) => (
          <a rel="noopener noreferrer" target="_blank" href={info.getValue()}>
            <span className="text-sky-500 font-medium hover:text-sky-800">
              Image
            </span>
          </a>
        ),
        header: () => <p className="text-right font-medium">Thumbnail URL</p>,
      }),
      columnHelper.accessor('datetime', {
        cell: (info) => {
          const timestamp = info.getValue();
          const formatted = formatDate(new Date(timestamp as Date));
          return <div className="text-right font-medium">{formatted}</div>;
        },
        header: ({ column }) => (
          <DataTableSortColumnHeader
            column={column}
            title="Datetime"
            className="justify-end"
          />
        ),
      }),
      columnHelper.accessor('currency', {
        cell: (info) => (
          <div className="text-right font-medium">{info.getValue()}</div>
        ),
        header: () => <p className="text-right font-medium">Currency</p>,
      }),
      columnHelper.accessor('description', {
        cell: (info) => (
          <div className="text-right font-medium">
            {truncateString(info.getValue(), 20)}
          </div>
        ),
        header: () => <p className="text-right font-medium">Description</p>,
      }),
      columnHelper.accessor('venueId', {
        cell: (info) => (
          <div className="text-right font-medium">
            {truncateString(info.getValue() as string, 8)}
          </div>
        ),
        header: ({ column }) => (
          <DataTableFilterColumnHeader
            column={column}
            title="Venue ID"
            className="justify-end"
          />
        ),
      }),
      columnHelper.accessor('lineup', {
        cell: (info) => {
          const lineup = info.getValue() as string[];
          return (
            <div className="text-right font-medium">{lineup.join(', ')}</div>
          );
        },
        header: () => <div className="text-right">Lineup</div>,
      }),
      columnHelper.accessor('purchaseLimit', {
        cell: (info) => (
          <div className="text-right font-medium">{info.getValue()}</div>
        ),
        header: () => <p className="text-right font-medium">Purchase Limit</p>,
      }),
      columnHelper.accessor('ticketTiers', {
        cell: (info) => {
          const ticketTiers = info.getValue() as Record<
            'label' | 'price',
            string
          >[];
          return (
            <>
              {ticketTiers.map((tier: any) => {
                const price = parseFloat(tier.price);
                const formatted = new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(price);
                return (
                  <div key={tier.label} className="text-right font-medium">
                    {tier.label}-{formatted}
                  </div>
                );
              })}
            </>
          );
        },
        header: () => <div className="text-right">Events</div>,
      }),
      columnHelper.accessor('ticketsPurchased', {
        cell: (info) => (
          <div className="text-right font-medium">{info.getValue()}</div>
        ),
        header: ({ column }) => (
          <DataTableSortColumnHeader
            column={column}
            title="Tickets Purchased"
            className="justify-end"
          />
        ),
      }),
      columnHelper.accessor('ticketQuantity', {
        cell: (info) => (
          <div className="text-right font-medium">{info.getValue()}</div>
        ),
        header: ({ column }) => (
          <DataTableSortColumnHeader
            column={column}
            title="Ticket Quantity"
            className="justify-end"
          />
        ),
      }),
    ],
  }),
  columnHelper.display({
    id: 'actions',
    cell: ({ row }) => {
      const event = row.original;

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
              onClick={() => navigator.clipboard.writeText(event.id)}
            >
              Copy event ID
            </DropdownMenuItem>
            {row.getValue('approvalStatus') === EventApprovalStatus.Pending && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    updateEventApprovalStatus(
                      row.getValue('id'),
                      EventApprovalStatus.Approved
                    )
                  }
                >
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    updateEventApprovalStatus(
                      row.getValue('id'),
                      EventApprovalStatus.Rejected
                    )
                  }
                >
                  Reject
                </DropdownMenuItem>
              </>
            )}
            {row.getValue('approvalStatus') ===
              EventApprovalStatus.Rejected && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="mx-auto">
                  <Button
                    variant={'destructive'}
                    className="h-8 w-20"
                    onClick={() => deleteRejectedEvent(row.getValue('id'))}
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
