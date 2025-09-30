"use client";

import { useState, useEffect } from "react";

interface Quotation {
  id: number;
  partnerId: number;
  partnerName: string;
  amount: string;
  proposedPeriod: string;
  validUntil: string;
  status: string;
  submittedAt: string;
  selected: boolean;
  appealText?: string;
}

interface QuotationListModalProps {
  isOpen: boolean;
  onClose: () => void;
  diagnosisId: string;
}

const QuotationListModal = ({ isOpen, onClose, diagnosisId }: QuotationListModalProps) => {
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [quotations, setQuotations] = useState<Quotation[]>([]);

  useEffect(() => {
    if (isOpen && diagnosisId) {
      fetchQuotations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, diagnosisId]);

  const fetchQuotations = async () => {
    try {
      const response = await fetch(`/api/admin/diagnoses/${diagnosisId}/quotations`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch quotations');
      }

      const data = await response.json();
      setQuotations(data);
    } catch (error) {
      console.error('Error fetching quotations:', error);
      // エラー時はモックデータを使用
      const mockQuotations: Quotation[] = [
        {
          id: 1,
          partnerId: 1,
          partnerName: "佐藤塗装工業",
          amount: "120万円",
          proposedPeriod: "2週間",
          validUntil: "2024/04/01",
          status: "提出済み",
          submittedAt: "2024/03/15",
          selected: false,
          appealText: `弊社は創業30年の実績を持つ、地域密着型の塗装専門業者です。

【弊社の強み】
✅ 高品質な塗料を使用し、10年保証付き
✅ 施工期間中の騒音対策を徹底
✅ 近隣への配慮を最優先に作業
✅ 経験豊富な職人による丁寧な施工`
        },
        {
          id: 2,
          partnerId: 2,
          partnerName: "田中建装株式会社",
          amount: "98万円",
          proposedPeriod: "3週間",
          validUntil: "2024/03/31",
          status: "提出済み",
          submittedAt: "2024/03/14",
          selected: false,
          appealText: `地元で20年以上の実績がある弊社にお任せください。`
        },
        {
          id: 3,
          partnerId: 3,
          partnerName: "山田ペイント",
          amount: "135万円",
          proposedPeriod: "10日間",
          validUntil: "2024/04/10",
          status: "提出済み",
          submittedAt: "2024/03/16",
          selected: false,
          appealText: `最新技術と確かな技術力で施工いたします。`
        }
      ];
      setQuotations(mockQuotations);
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleSelectPartner = async (quotation: Quotation) => {
    if (confirm(`${quotation.partnerName}を業者として決定しますか？\n見積金額: ${quotation.amount}`)) {
      try {
        // APIを呼び出して業者を選定
        const response = await fetch(`/api/admin/diagnoses/${diagnosisId}/quotations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            quotationId: quotation.id,
            partnerId: quotation.partnerId
          }),
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to select partner');
        }

        await response.json();

        alert(`${quotation.partnerName}を業者として決定しました。\n\n診断ステータス: 業者決定\n受注管理に移行しました。`);

        onClose();

        // 診断画面をリロードして最新状態を表示
        window.location.reload();
      } catch (error) {
        console.error('Failed to select partner:', error);
        alert('業者決定に失敗しました');
      }
    }
  };

  const handleViewDetail = (quotation: Quotation) => {
    setSelectedQuotation(quotation);
  };

  if (!isOpen || !diagnosisId) {
    return null;
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-gray-500 bg-opacity-75 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="relative w-full max-w-5xl bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">
                見積もり一覧 - 診断ID: {diagnosisId}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {!selectedQuotation ? (
                <>
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      提出された見積もり: {quotations.length}件
                      {quotations.some(q => q.selected) && (
                        <span className="ml-2 font-semibold">（選定済み）</span>
                      )}
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">業者名</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">見積金額</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">工期</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">有効期限</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">提出日</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {quotations.map((quotation) => (
                          <tr key={quotation.id} className={`hover:bg-gray-50 ${quotation.selected ? 'bg-green-50' : ''}`}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {quotation.partnerName}
                              {quotation.selected && (
                                <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-md">選定済</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                              {quotation.amount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {quotation.proposedPeriod}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {quotation.validUntil}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {quotation.submittedAt}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-md">
                                {quotation.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <button
                                onClick={() => handleViewDetail(quotation)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                詳細
                              </button>
                              {!quotation.selected && !quotations.some(q => q.selected) && (
                                <button
                                  onClick={() => handleSelectPartner(quotation)}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  業者決定
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {quotations.length === 0 && (
                    <div className="mt-6 text-center py-12 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">まだ見積もりが提出されていません</p>
                    </div>
                  )}
                </>
              ) : (
                <div>
                  <button
                    onClick={() => setSelectedQuotation(null)}
                    className="mb-4 text-sm text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    一覧に戻る
                  </button>

                  <div className="space-y-6">
                    <div className="p-6 bg-gray-50 rounded-lg">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        {selectedQuotation.partnerName}の見積もり詳細
                      </h4>

                      <div className="mb-6">
                        <label className="text-sm font-medium text-gray-600">見積金額</label>
                        <p className="mt-1 text-3xl font-bold text-gray-900">{selectedQuotation.amount}</p>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">提案工期</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedQuotation.proposedPeriod}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">見積有効期限</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedQuotation.validUntil}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">提出日</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedQuotation.submittedAt}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-gray-50 rounded-lg">
                      <h5 className="text-md font-semibold text-gray-900 mb-3">アピール文章</h5>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {selectedQuotation.appealText || `弊社は地域密着型の塗装専門業者です。
お客様の大切な住まいを、心を込めて施工させていただきます。`}
                      </p>
                    </div>

                    {!selectedQuotation.selected && !quotations.some(q => q.selected) && (
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => handleSelectPartner(selectedQuotation)}
                          className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
                        >
                          この業者を決定
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end p-6 border-t">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuotationListModal;