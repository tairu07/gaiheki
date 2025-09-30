'use client';

import { useState } from 'react';
import InquiryDetailModal from './InquiryDetailModal';

interface InquiryDetailButtonProps {
  inquiry: { id: number; name?: string; email?: string; phoneNumber?: string; inquiryType?: string; content?: string; status?: string; createdAt?: string; };
}

export default function InquiryDetailButton({ inquiry }: InquiryDetailButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="text-blue-600 hover:text-blue-900"
      >
        詳細
      </button>
      <InquiryDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        inquiry={inquiry}
      />
    </>
  );
}