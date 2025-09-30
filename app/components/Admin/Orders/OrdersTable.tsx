import { prisma } from '@/app/lib/prisma';
import { OrderStatus } from '@prisma/client';
import OrderStatusSelect from './OrderStatusSelect';
import OrderDetailButton from './OrderDetailButton';

interface OrdersTableProps {
  status?: string;
}

async function getOrders(status?: string) {
  const where = status && status !== 'すべて'
    ? { order_status: status as OrderStatus }
    : {};

  const orders = await prisma.orders.findMany({
    where,
    include: {
      quotations: {
        include: {
          diagnosis_requests: {
            include: {
              customers: true,
            }
          },
          partners: {
            include: {
              partner_details: true,
            }
          },
        }
      },
    },
    orderBy: {
      created_at: 'desc'
    }
  });

  return orders;
}

export default async function OrdersTable({ status }: OrdersTableProps) {
  const orders = await getOrders(status);

  if (orders.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        該当する受注データがありません
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              診断ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              顧客名
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              電話番号
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              メールアドレス
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              施工住所
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              施工金額
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              施工業者
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ステータス
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              詳細
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => {
            const customer = order.quotations?.diagnosis_requests?.customers;

            return (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.quotations?.diagnosis_requests?.diagnosis_code || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {customer?.customer_name || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {customer?.customer_phone || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {customer?.customer_email || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {customer?.construction_address || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {order.quotations?.quotation_amount ? `${(order.quotations.quotation_amount / 10000).toFixed(0)}万円` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.quotations?.partners?.partner_details?.company_name || order.quotations?.partners?.username || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <OrderStatusSelect
                    orderId={order.id}
                    currentStatus={order.order_status}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <OrderDetailButton order={order} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}