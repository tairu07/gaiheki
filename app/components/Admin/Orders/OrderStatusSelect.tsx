'use client';

import { useState, useTransition } from 'react';

interface OrderStatusSelectProps {
  orderId: number;
  currentStatus: string;
}

export default function OrderStatusSelect({ orderId, currentStatus }: OrderStatusSelectProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isPending, startTransition] = useTransition();

  const handleStatusUpdate = async (newStatus: string) => {
    if (!confirm(`ステータスを「${newStatus}」に変更しますか？`)) {
      setStatus(currentStatus);
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch('/api/admin/orders', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId,
            updates: { order_status: newStatus }
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update status');
        }

        setStatus(newStatus);
        alert(`ステータスを「${newStatus}」に変更しました`);
      } catch (error) {
        console.error('Error updating status:', error);
        alert('ステータスの更新に失敗しました');
        setStatus(currentStatus);
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ORDERED':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'REVIEW_COMPLETED':
        return 'bg-purple-100 text-purple-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <select
      value={status}
      onChange={(e) => {
        setStatus(e.target.value);
        handleStatusUpdate(e.target.value);
      }}
      disabled={isPending}
      className={`px-3 py-1 text-xs font-medium rounded-md border-0 cursor-pointer ${getStatusColor(status)} ${isPending ? 'opacity-50' : ''}`}
    >
      <option value="ORDERED">受注</option>
      <option value="IN_PROGRESS">施工中</option>
      <option value="COMPLETED">施工完了</option>
      <option value="REVIEW_COMPLETED">評価完了</option>
      <option value="CANCELLED">キャンセル</option>
    </select>
  );
}