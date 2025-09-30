'use client';

import { useState } from 'react';
import OrderDetailModal from './OrderDetailModal';

interface OrderDetailButtonProps {
  order: { id: number; customerName?: string; partnerName?: string; status?: string; amount?: number; startDate?: string; endDate?: string; notes?: string; };
}

export default function OrderDetailButton({ order }: OrderDetailButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="text-blue-600 hover:text-blue-900"
      >
        詳細
      </button>
      <OrderDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={order}
      />
    </>
  );
}