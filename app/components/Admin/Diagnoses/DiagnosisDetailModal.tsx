"use client";

import { useEffect } from "react";

interface DiagnosisDetail {
  id: string;
  customerName: string;
  age: string;
  issue: string;
  workType: string;
  requestDate: string;
  status: string;
  isUrgent: boolean;
}

interface DiagnosisDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  diagnosis: DiagnosisDetail | null;
}

const DiagnosisDetailModal = ({ isOpen, onClose, diagnosis }: DiagnosisDetailModalProps) => {
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

  if (!isOpen || !diagnosis) {
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
          <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">
                診断詳細 - {diagnosis.id}
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

            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">顧客情報</h4>
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-gray-600">お名前</label>
                    <p className="mt-1 text-sm text-gray-900">{diagnosis.customerName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">メールアドレス</label>
                    <p className="mt-1 text-sm text-gray-900">info@example.com</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">電話番号</label>
                    <p className="mt-1 text-sm text-gray-900">090-1234-5678</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">住所</label>
                    <p className="mt-1 text-sm text-gray-900">東京都渋谷区〇〇1-2-3</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">建物情報</h4>
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-gray-600">建物の築年数</label>
                    <p className="mt-1 text-sm text-gray-900">10～15年</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">延床面積</label>
                    <p className="mt-1 text-sm text-gray-900">{diagnosis.age}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">現在の状況</label>
                    <p className="mt-1 text-sm text-gray-900">{diagnosis.issue}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">工事箇所</label>
                    <p className="mt-1 text-sm text-gray-900">{diagnosis.workType}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">希望条件</h4>
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-gray-600">予算</label>
                    <p className="mt-1 text-sm text-gray-900">100～150万円</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">希望工期</label>
                    <p className="mt-1 text-sm text-gray-900">3ヶ月以内</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-600">その他要望</label>
                    <p className="mt-1 text-sm text-gray-900">特になし</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">ステータス情報</h4>
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-gray-600">診断依頼日</label>
                    <p className="mt-1 text-sm text-gray-900">{diagnosis.requestDate}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">現在のステータス</label>
                    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-md ${
                      diagnosis.status === "業者指定" ? "bg-blue-100 text-blue-800" :
                      diagnosis.status === "見積もり募集中" ? "bg-yellow-100 text-yellow-800" :
                      diagnosis.status === "見積もり比較中" ? "bg-orange-100 text-orange-800" :
                      diagnosis.status === "業者決定" ? "bg-green-100 text-green-800" :
                      diagnosis.status === "キャンセル" ? "bg-red-100 text-red-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {diagnosis.status}
                    </span>
                  </div>
                  {diagnosis.isUrgent && (
                    <div className="col-span-2">
                      <span className="inline-flex px-3 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-md">
                        緊急対応
                      </span>
                    </div>
                  )}
                </div>
              </div>
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

export default DiagnosisDetailModal;