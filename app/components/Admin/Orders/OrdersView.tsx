"use client";

import { useState, useEffect } from "react";

interface Order {
  id: string;
  diagnosisId: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  partnerName: string;
  orderAmount: string;
  orderDate: string;
  constructionPeriod: string;
  status: string;
  progress: number;
  scheduledStartDate: string;
  scheduledEndDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  paymentStatus: string;
}

const OrdersView = () => {
  const [orderFilter, setOrderFilter] = useState("すべて");
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    // APIから受注データを取得（現在はモックデータ）
    const mockOrders: Order[] = [
      {
        id: "ORD-00001",
        diagnosisId: "GH-00003",
        customerName: "鈴木賢",
        phone: "090-1234-5678",
        email: "suzuki@example.com",
        address: "東京都渋谷区1-1-1",
        partnerName: "田中建装株式会社",
        orderAmount: "98万円",
        orderDate: "2024/03/01",
        constructionPeriod: "3週間",
        status: "工事準備中",
        progress: 10,
        scheduledStartDate: "2024/03/15",
        scheduledEndDate: "2024/04/05",
        paymentStatus: "未払い"
      },
      {
        id: "ORD-00002",
        diagnosisId: "GH-00009",
        customerName: "神戸賢",
        phone: "090-8765-4321",
        email: "kobe@example.com",
        address: "兵庫県神戸市2-2-2",
        partnerName: "佐藤塗装工業",
        orderAmount: "120万円",
        orderDate: "2024/02/25",
        constructionPeriod: "2週間",
        status: "工事中",
        progress: 45,
        scheduledStartDate: "2024/03/01",
        scheduledEndDate: "2024/03/15",
        actualStartDate: "2024/03/01",
        paymentStatus: "一部支払済"
      },
      {
        id: "ORD-00003",
        diagnosisId: "GH-00011",
        customerName: "北海道太",
        phone: "011-1234-5678",
        email: "hokkaido@example.com",
        address: "北海道札幌市3-3-3",
        partnerName: "山田ペイント",
        orderAmount: "135万円",
        orderDate: "2024/02/20",
        constructionPeriod: "10日間",
        status: "工事完了",
        progress: 100,
        scheduledStartDate: "2024/02/25",
        scheduledEndDate: "2024/03/07",
        actualStartDate: "2024/02/25",
        actualEndDate: "2024/03/05",
        paymentStatus: "支払済"
      },
      {
        id: "ORD-00004",
        diagnosisId: "GH-00013",
        customerName: "岩手健",
        phone: "019-9876-5432",
        email: "iwate@example.com",
        address: "岩手県盛岡市4-4-4",
        partnerName: "高橋塗装店",
        orderAmount: "110万円",
        orderDate: "2024/02/15",
        constructionPeriod: "2週間",
        status: "工事中",
        progress: 75,
        scheduledStartDate: "2024/02/20",
        scheduledEndDate: "2024/03/05",
        actualStartDate: "2024/02/20",
        paymentStatus: "一部支払済"
      }
    ];
    setOrders(mockOrders);
  };

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    if (confirm(`ステータスを「${newStatus}」に変更しますか？`)) {
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      alert(`ステータスを「${newStatus}」に変更しました`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "工事準備中":
        return "bg-yellow-100 text-yellow-800";
      case "工事中":
        return "bg-blue-100 text-blue-800";
      case "工事完了":
        return "bg-green-100 text-green-800";
      case "検査中":
        return "bg-purple-100 text-purple-800";
      case "完了確認済":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "未払い":
        return "bg-red-100 text-red-800";
      case "一部支払済":
        return "bg-yellow-100 text-yellow-800";
      case "支払済":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">受注管理</h2>
        </div>
        
        {/* ステータスフィルタータブ */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex space-x-2">
            {["すべて", "工事準備中", "工事中", "工事完了", "検査中", "完了確認済"].map((filter) => (
              <button
                key={filter}
                onClick={() => setOrderFilter(filter)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  orderFilter === filter
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* テーブル */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">受注ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">診断ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">顧客名</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">施工業者</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">受注金額</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">工期</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">進捗</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">支払状況</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">詳細</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.filter(order => {
                return orderFilter === "すべて" || order.status === orderFilter;
              }).map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.diagnosisId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.partnerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {order.orderAmount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.constructionPeriod}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-32">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              order.progress === 100 ? 'bg-green-600' :
                              order.progress >= 50 ? 'bg-blue-600' :
                              'bg-yellow-600'
                            }`}
                            style={{ width: `${order.progress}%` }}
                          />
                        </div>
                        <span className="ml-2 text-xs font-medium text-gray-600">
                          {order.progress}%
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      className={`px-3 py-1 text-xs font-medium rounded-md border-0 cursor-pointer ${getStatusColor(order.status)}`}
                    >
                      <option value="工事準備中">工事準備中</option>
                      <option value="工事中">工事中</option>
                      <option value="工事完了">工事完了</option>
                      <option value="検査中">検査中</option>
                      <option value="完了確認済">完了確認済</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-medium rounded-md ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => alert(`受注詳細: ${order.id}\n\n予定工期: ${order.scheduledStartDate} ～ ${order.scheduledEndDate}\n${order.actualStartDate ? `実際の開始日: ${order.actualStartDate}` : ''}\n${order.actualEndDate ? `実際の終了日: ${order.actualEndDate}` : ''}`)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      詳細
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersView;