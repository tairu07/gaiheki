"use client";

import { useState, useEffect } from "react";
import DiagnosisDetailModal from "./DiagnosisDetailModal";
import QuotationListModal from "./QuotationListModal";

interface Diagnosis {
  id: string;
  customerName: string;
  age: string;
  issue: string;
  workType: string;
  requestDate: string;
  status: string;
  isUrgent: boolean;
}

const DiagnosesView = () => {
  const [diagnosisFilter, setDiagnosisFilter] = useState("すべて");
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<Diagnosis | null>(null);
  const [selectedDiagnosisId, setSelectedDiagnosisId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);

  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [, setIsLoading] = useState(false);

  // データベースから診断一覧を取得
  useEffect(() => {
    fetchDiagnoses();
  }, []);

  const fetchDiagnoses = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/diagnoses', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch diagnoses');
      }

      const data = await response.json();
      setDiagnoses(data);
    } catch (error) {
      console.error('Error fetching diagnoses:', error);
      // エラー時はモックデータを使用
      const mockData = [
        { id: "GH-00001", customerName: "高橋太", age: "101～150平米 (31～45坪)", issue: "劣化が少し気になる", workType: "外壁全面の塗装", requestDate: "2024年03月01日", status: "見積もり募集中", isUrgent: false },
        { id: "GH-00002", customerName: "田中陽", age: "51～100平米 (16～30坪)", issue: "色褪せや汚れが気になる", workType: "屋根の塗装", requestDate: "2024年02月28日", status: "見積もり比較中", isUrgent: false },
        { id: "GH-00003", customerName: "鈴木賢", age: "151～200平米 (46～61坪)", issue: "色褪せや汚れが気になる", workType: "外壁の塗装", requestDate: "2024年02月25日", status: "業者決定", isUrgent: false },
        { id: "GH-00004", customerName: "千葉真", age: "201～250平米 (61～76坪)", issue: "ひび割れや破損したところがある", workType: "補修・防水", requestDate: "2024年02月20日", status: "見積もり募集中", isUrgent: false },
        { id: "GH-00005", customerName: "東京悟", age: "～50平米 (15坪) 以下", issue: "工事中心", workType: "外壁の塗り替え（サイディング）", requestDate: "2024年02月18日", status: "見積もり比較中", isUrgent: false }
      ];
      setDiagnoses(mockData);
    } finally {
      setIsLoading(false);
    }
  };

  // 詳細ボタンをクリックした時の処理
  const handleShowDetail = (diagnosis: Diagnosis) => {
    setSelectedDiagnosis(diagnosis);
    setIsDetailModalOpen(true);
  };

  // 見積詳細ボタンをクリックした時の処理
  const handleShowQuotation = (diagnosisId: string) => {
    setSelectedDiagnosisId(diagnosisId);
    setIsQuotationModalOpen(true);
  };

  // ステータス変更の処理
  const handleStatusChange = async (diagnosisId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/diagnoses/${diagnosisId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      // ローカルステートを更新
      setDiagnoses(prevDiagnoses =>
        prevDiagnoses.map(diagnosis =>
          diagnosis.id === diagnosisId ? { ...diagnosis, status: newStatus } : diagnosis
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
      alert('ステータスの更新に失敗しました');
    }
  };

  // ステータスに応じた自動遷移のチェック（実際はAPIで処理）
  const checkStatusTransition = (diagnosis: Diagnosis) => {
    // 見積もり募集中 → 見積もり比較中への自動遷移
    // （実際は見積もりが複数提出されたタイミングで変更）
    if (diagnosis.status === "見積もり募集中") {
      // APIで見積もり数をチェック
      // 2件以上あれば「見積もり比較中」に変更
    }

    // 業者決定 → 受注管理への移行
    if (diagnosis.status === "業者決定") {
      // 受注管理テーブルにレコードを作成
      // この診断は受注管理画面でも表示される
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">診断管理</h2>
        </div>

        {/* ステータスフィルタータブ */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex space-x-2">
            {["すべて", "業者指定", "見積もり募集中", "見積もり比較中", "業者決定", "キャンセル"].map((filter) => (
              <button
                key={filter}
                onClick={() => setDiagnosisFilter(filter)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  diagnosisFilter === filter
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">診断ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">顧客名</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">延床面積</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">現在の状況</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">工事箇所</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">診断依頼日</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">詳細</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">見積もり詳細</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {diagnoses.filter(diagnosis => {
                return diagnosisFilter === "すべて" || diagnosis.status === diagnosisFilter;
              }).map((diagnosis) => (
                <tr key={diagnosis.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {diagnosis.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {diagnosis.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {diagnosis.age}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {diagnosis.issue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {diagnosis.workType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {diagnosis.requestDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-medium rounded-md ${
                      diagnosis.status === "業者指定" ? "bg-blue-100 text-blue-800" :
                      diagnosis.status === "見積もり募集中" ? "bg-yellow-100 text-yellow-800" :
                      diagnosis.status === "見積もり比較中" ? "bg-orange-100 text-orange-800" :
                      diagnosis.status === "業者決定" ? "bg-green-100 text-green-800" :
                      diagnosis.status === "キャンセル" ? "bg-red-100 text-red-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {diagnosis.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleShowDetail(diagnosis)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      詳細
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleShowQuotation(diagnosis.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      見積もり詳細
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* モーダルコンポーネント */}
      <DiagnosisDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedDiagnosis(null);
        }}
        diagnosis={selectedDiagnosis}
      />

      <QuotationListModal
        isOpen={isQuotationModalOpen}
        onClose={() => {
          setIsQuotationModalOpen(false);
          setSelectedDiagnosisId(null);
        }}
        diagnosisId={selectedDiagnosisId || ""}
      />
    </div>
  );
};

export default DiagnosesView;