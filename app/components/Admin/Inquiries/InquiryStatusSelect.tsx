'use client';

import { useState, useTransition } from 'react';

interface InquiryStatusSelectProps {
  inquiryId: number;
  currentStatus: string;
}

export default function InquiryStatusSelect({ inquiryId, currentStatus }: InquiryStatusSelectProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isPending, startTransition] = useTransition();

  const handleStatusUpdate = async (newStatus: string) => {
    if (!confirm(`ステータスを「${getStatusLabel(newStatus)}」に変更しますか？`)) {
      setStatus(currentStatus);
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch('/api/admin/inquiries', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inquiryId,
            updates: { status: newStatus }
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update status');
        }

        setStatus(newStatus);
        alert(`ステータスを「${getStatusLabel(newStatus)}」に変更しました`);
      } catch (error) {
        console.error('Error updating status:', error);
        alert('ステータスの更新に失敗しました');
        setStatus(currentStatus);
      }
    });
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      PENDING: '未対応',
      IN_PROGRESS: '対応中',
      COMPLETED: '対応完了',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-red-100 text-red-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
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
      <option value="PENDING">未対応</option>
      <option value="IN_PROGRESS">対応中</option>
      <option value="COMPLETED">対応完了</option>
    </select>
  );
}