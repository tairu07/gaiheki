'use client';

import { useState, useTransition } from 'react';
import { X } from 'lucide-react';

interface InquiryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiry: { id: number; name?: string; email?: string; phoneNumber?: string; inquiryType?: string; content?: string; status?: string; createdAt?: string; };
}

export default function InquiryDetailModal({ isOpen, onClose, inquiry }: InquiryDetailModalProps) {
  const [adminMemo, setAdminMemo] = useState(inquiry?.admin_memo || '');
  const [isPending, startTransition] = useTransition();

  if (!isOpen || !inquiry) return null;

  const handleSaveAdminMemo = () => {
    startTransition(async () => {
      try {
        const response = await fetch('/api/admin/inquiries', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inquiryId: inquiry.id,
            updates: { admin_memo: adminMemo }
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update admin memo');
        }

        alert('管理者メモを保存しました');
      } catch (error) {
        console.error('Error updating admin memo:', error);
        alert('管理者メモの保存に失敗しました');
      }
    });
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      PENDING: 'bg-red-100 text-red-800',
      IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
      COMPLETED: 'bg-green-100 text-green-800',
    };

    const labels = {
      PENDING: '未対応',
      IN_PROGRESS: '対応中',
      COMPLETED: '対応完了',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black bg-opacity-30" onClick={onClose} />

        <div className="relative bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">お問い合わせ詳細</h2>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* 基本情報 */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">基本情報</h3>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded border border-gray-200">
                <div>
                  <label className="text-sm text-gray-600 font-medium">お名前</label>
                  <p className="font-semibold text-gray-900 mt-1">{inquiry.name || '-'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium">メールアドレス</label>
                  <p className="font-semibold text-gray-900 mt-1">{inquiry.email || '-'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium">電話番号</label>
                  <p className="font-semibold text-gray-900 mt-1">{inquiry.phone || '-'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium">作成日</label>
                  <p className="font-semibold text-gray-900 mt-1">
                    {inquiry.created_at ? new Date(inquiry.created_at).toLocaleDateString('ja-JP') : '-'}
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-gray-600 font-medium">件名</label>
                  <p className="font-semibold text-gray-900 mt-1">{inquiry.subject || '-'}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-gray-600 font-medium">ステータス</label>
                  <div className="mt-2">
                    {getStatusBadge(inquiry.status)}
                  </div>
                </div>
              </div>
            </div>

            {/* お問い合わせ内容 */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">お問い合わせ内容</h3>
              <div className="bg-gray-50 p-4 rounded border border-gray-200">
                <p className="whitespace-pre-wrap text-gray-900 font-medium">{inquiry.message || '-'}</p>
              </div>
            </div>

            {/* 対応履歴 */}
            {inquiry.response_history && inquiry.response_history.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900">対応履歴</h3>
                <div className="space-y-3">
                  {inquiry.response_history.map((response: { created_at: string; user: string; content: string }, index: number) => (
                    <div key={index} className="bg-gray-50 p-4 rounded border border-gray-200">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600 font-medium">
                          {new Date(response.created_at).toLocaleString('ja-JP')}
                        </span>
                        <span className="text-sm font-semibold text-gray-800">
                          {response.admin_name || '管理者'}
                        </span>
                      </div>
                      <p className="text-gray-900 font-medium">{response.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 管理者メモ */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">管理者メモ</h3>
              <div className="space-y-3">
                <textarea
                  value={adminMemo}
                  onChange={(e) => setAdminMemo(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none text-gray-900"
                  rows={4}
                  placeholder="管理者用のメモを入力してください"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveAdminMemo}
                    disabled={isPending}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 font-medium"
                  >
                    {isPending ? '保存中...' : 'メモを保存'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}