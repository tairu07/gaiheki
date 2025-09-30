import AdminSidebar from "../../components/Admin/Common/AdminSidebar";
import OrdersTable from "../../components/Admin/Orders/OrdersTable";
import OrderFilterTabs from "../../components/Admin/Orders/OrderFilterTabs";
import { Suspense } from "react";

interface OrdersPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const params = await searchParams;
  const status = params.status;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar />
      <main className="flex-1 p-8 min-w-0">
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">受注管理</h2>
            </div>

            <OrderFilterTabs />

            <Suspense fallback={
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <p className="mt-2 text-gray-600">受注データを読み込み中...</p>
              </div>
            }>
              <OrdersTable status={status} />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}