'use client';

import useFetchOrdersByIds from '@/hooks/useFetchOrdersByIds';
import useFetchUserProfileById from '@/hooks/useFetchUserProfileById';
import { User } from 'next-auth';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate, formatPrice, formatTime } from '@/lib/client/utils';
import CopyToClipboard from '../CopyToClipboard';

interface OrderHistorySectionProps {
  user: User;
}

export default function OrderHistorySection({ user }: OrderHistorySectionProps) {
  const profile = useFetchUserProfileById(user.id);

  const orders = useFetchOrdersByIds(profile?.orders);

  if (!orders) {
    return <div>Loading...</div>;
  }

  return (
    <div className="py-6 px-2 space-y-2">
      <p className="text-lg font-bold">Order History</p>
      <div className="h-96 relative overflow-auto">
        <Table className="p-4">
          <TableHeader className="border-2 sticky top-0 bg-secondary">
            <TableRow>
              <TableHead className="w-[100px]">Order #</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="w-[100px]">Tickets</TableHead>
              <TableHead className="text-right whitespace-nowrap">Total Price</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell className="font-medium">
                  <CopyToClipboard text={order._id.toString()}>
                    <p className="hover:text-green-500">{order._id}</p>
                  </CopyToClipboard>
                </TableCell>
                <TableCell>
                  {formatDate(order.timestamp)} &#x2022; {formatTime(order.timestamp)}
                </TableCell>
                <TableCell>{order.email}</TableCell>
                <TableCell>{order.amount}</TableCell>
                <TableCell>
                  {order.ticketData.map((ticket: any) => (
                    <div key={`${ticket.eventId}-${ticket.label}`} className="flex gap-2">
                      <p className="flex-1">{ticket.eventTitle}</p>
                      <p>{ticket.unitAmount}</p>
                      <p>{ticket.label}</p>
                      <p>{formatPrice(ticket.price)}</p>
                    </div>
                  ))}
                </TableCell>
                <TableCell className="text-right">{formatPrice(order.totalPrice)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
