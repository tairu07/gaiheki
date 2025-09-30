'use client';

import { useState, useTransition } from 'react';
import { X } from 'lucide-react';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: { id: number; customerName?: string; partnerName?: string; status?: string; amount?: number; startDate?: string; endDate?: string; notes?: string; evaluationUrl?: string; };
}

export default function OrderDetailModal({ isOpen, onClose, order }: OrderDetailModalProps) {
  const [adminMemo, setAdminMemo] = useState(order?.admin_memo || '');
  const [isPending, startTransition] = useTransition();
  const [showReviewTokenSuccess, setShowReviewTokenSuccess] = useState(false);

  if (!isOpen || !order) return null;

  const customer = order.quotations?.diagnosis_requests?.customers;
  const partner = order.quotations?.partners;

  const handleSaveAdminMemo = () => {
    startTransition(async () => {
      try {
        const response = await fetch('/api/admin/orders', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId: order.id,
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

  const handleGenerateReviewToken = async () => {
    if (!confirm('評価フォームのURLを発行しますか？')) return;

    try {
      const response = await fetch('/api/admin/orders/review-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order.id,
          customerEmail: customer?.customer_email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate review token');
      }

      const data = await response.json();
      setShowReviewTokenSuccess(true);
      alert(`評価フォームURLを発行しました。\n${data.reviewUrl}`);
    } catch (error) {
      console.error('Error generating review token:', error);
      alert('評価フォームURLの発行に失敗しました');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black bg-opacity-30" onClick={onClose} />

        <div className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">受注詳細 - ORD-{String(order.id).padStart(5, '0')}</h2>
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
              <h3 className="text-lg font-semibold mb-3 text-gray-900 text-gray-900">基本情報</h3>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded border border-gray-200">
                <div>
                  <label className="text-sm text-gray-600 font-medium">診断コード</label>
                  <p className="font-semibold text-gray-900 mt-1">{order.quotations?.diagnosis_requests?.diagnosis_code || '-'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium">ステータス</label>
                  <div className="mt-1">
                    <span className={`px-2 py-1 rounded text-sm font-semibold ${
                      order.order_status === 'ORDERED' ? 'bg-yellow-100 text-yellow-800' :
                      order.order_status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                      order.order_status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      order.order_status === 'REVIEW_COMPLETED' ? 'bg-purple-100 text-purple-800' :
                      order.order_status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.order_status === 'ORDERED' ? '受注' :
                       order.order_status === 'IN_PROGRESS' ? '施工中' :
                       order.order_status === 'COMPLETED' ? '施工完了' :
                       order.order_status === 'REVIEW_COMPLETED' ? '評価完了' :
                       order.order_status === 'CANCELLED' ? 'キャンセル' :
                       order.order_status}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium">受注日</label>
                  <p className="font-semibold text-gray-900 mt-1">{new Date(order.order_date || order.created_at).toLocaleDateString('ja-JP')}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium">受注金額</label>
                  <p className="font-medium text-lg">
                    {order.quotations?.quotation_amount ? `${(order.quotations.quotation_amount / 10000).toFixed(0)}万円` : '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* 顧客情報 */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900 text-gray-900">顧客情報</h3>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded border border-gray-200">
                <div>
                  <label className="text-sm text-gray-600 font-medium">顧客名</label>
                  <p className="font-semibold text-gray-900 mt-1">{customer?.customer_name || '-'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium">電話番号</label>
                  <p className="font-semibold text-gray-900 mt-1">{customer?.customer_phone || '-'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium">メールアドレス</label>
                  <p className="font-semibold text-gray-900 mt-1">{customer?.customer_email || '-'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium">施工住所</label>
                  <p className="font-semibold text-gray-900 mt-1">{customer?.construction_address || '-'}</p>
                </div>
              </div>
            </div>

            {/* 施工業者情報 */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">施工業者情報</h3>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded border border-gray-200">
                <div>
                  <label className="text-sm text-gray-600 font-medium">業者名</label>
                  <p className="font-semibold text-gray-900 mt-1">{partner?.partner_details?.company_name || partner?.username || '-'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium">アカウント名</label>
                  <p className="font-semibold text-gray-900 mt-1">{partner?.username || '-'}</p>
                </div>
              </div>
            </div>

            {/* 施工詳細 */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">施工詳細</h3>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded border border-gray-200">
                <div>
                  <label className="text-sm text-gray-600 font-medium">施工開始予定日</label>
                  <p className="font-semibold text-gray-900 mt-1">
                    {order.construction_start_date ? new Date(order.construction_start_date).toLocaleDateString('ja-JP') : '未定'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium">施工終了予定日</label>
                  <p className="font-semibold text-gray-900 mt-1">
                    {order.construction_end_date ? new Date(order.construction_end_date).toLocaleDateString('ja-JP') : '未定'}
                  </p>
                </div>
                {order.completion_date && (
                  <div>
                    <label className="text-sm text-gray-600 font-medium">実際の完了日</label>
                    <p className="font-semibold text-gray-900 mt-1">
                      {new Date(order.completion_date).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 加盟店メモ */}
            {order.partner_memo && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900">加盟店メモ</h3>
                <div className="bg-gray-50 p-4 rounded border border-gray-200">
                  <p className="whitespace-pre-wrap text-gray-900 font-medium">{order.partner_memo}</p>
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
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isPending ? '保存中...' : 'メモを保存'}
                  </button>
                </div>
              </div>
            </div>

            {/* 評価フォーム発行 */}
            {order.order_status === 'COMPLETED' && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900">評価管理</h3>
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
                  <p className="text-sm text-gray-800 font-medium mb-3">
                    施工が完了しました。顧客に評価フォームのURLを送信できます。
                  </p>
                  <button
                    onClick={handleGenerateReviewToken}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    評価フォームURLを発行
                  </button>
                  {showReviewTokenSuccess && (
                    <p className="mt-2 text-sm text-green-600">
                      評価フォームURLを発行しました。顧客のメールアドレスに送信してください。
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}