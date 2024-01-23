'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { Checkbox } from '../ui/checkbox';
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
import { truncateString } from '@/lib/client/utils';
import { DataTableFilterColumnHeader } from '../ui/data-table';
import { Venue } from '@/lib/types';

const columnHelper = createColumnHelper<Venue>();

export const defaultVenueColumns = [
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
    id: 'venues',
    header: () => <div>Venues</div>,
    enableHiding: false,
    columns: [
      columnHelper.accessor('venueId', {
        cell: (info) => <div className="text-right font-medium">{truncateString(info.getValue() as string, 8)}</div>,
        header: ({ column }) => <DataTableFilterColumnHeader column={column} title="Id" className="justify-end" />,
      }),
      columnHelper.accessor('name', {
        cell: (info) => <div className="text-right font-medium">{info.getValue()}</div>,
        header: ({ column }) => <DataTableFilterColumnHeader column={column} title="Name" className="justify-end" />,
      }),
      columnHelper.accessor('address', {
        cell: (info) => <div className="text-right font-medium">{info.getValue()}</div>,
        header: ({ column }) => <DataTableFilterColumnHeader column={column} title="Address" className="justify-end" />,
      }),
      columnHelper.accessor('city', {
        cell: (info) => <div className="text-right font-medium">{info.getValue()}</div>,
        header: ({ column }) => <DataTableFilterColumnHeader column={column} title="City" className="justify-end" />,
      }),
      columnHelper.accessor('state', {
        cell: (info) => <div className="text-right font-medium">{info.getValue()}</div>,
        header: ({ column }) => <DataTableFilterColumnHeader column={column} title="State" className="justify-end" />,
      }),
      columnHelper.accessor('zipcode', {
        cell: (info) => <div className="text-right font-medium">{info.getValue()}</div>,
        header: ({ column }) => (
          <DataTableFilterColumnHeader column={column} title="Zip Code" className="justify-end" />
        ),
      }),
      columnHelper.accessor('parking', {
        cell: (info) => {
          const parking = info.getValue() as string[];
          return (
            <>
              {parking.map((instruction: any, index) => (
                <div key={`instruction-${index}`} className="text-right font-medium">
                  {instruction}
                </div>
              ))}
            </>
          );
        },
        header: () => <p className="text-right font-medium">Parking</p>,
      }),
    ],
  }),
  columnHelper.display({
    id: 'actions',
    cell: ({ row }) => {
      const venue = row.original;

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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(venue.venueId)}>
              Copy venue ID
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(`${venue.address} ${venue.city}, ${venue.state} ${venue.zipcode}`)
              }
            >
              Copy address
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
