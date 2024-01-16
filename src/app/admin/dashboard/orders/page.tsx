import {
  OrderColumnData,
  defaultOrderColumns,
} from '@/components/admin/OrderColumns';
import { DataTable } from '@/components/ui/data-table';
import { getAllOrders } from '@/lib/actions';

export default async function AdminManageOrdersPage() {
  const orders = await getAllOrders();

  const ordersIsFetched: boolean = orders && !!orders.length;
  const orderData: OrderColumnData[] = ordersIsFetched
    ? orders.map((order: any) => ({
        id: order._id,
        userId: order.userId,
        amount: order.amount,
        totalPrice: order.totalPrice,
        isPaid: order.isPaid ? 'Yes' : 'No',
        email: order.email,
        timestamp: order.timestamp,
      }))
    : [];

  return (
    <div className="container mx-auto px-12 py-4">
      <div className="">
        <p className="text-3xl">Manage Orders</p>
      </div>

      <div className="p-2">
        <DataTable columns={defaultOrderColumns} data={orderData} />
      </div>
    </div>
  );
}
