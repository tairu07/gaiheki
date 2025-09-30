"use client";

import { useState, useEffect } from "react";
import PartnerModal from "./PartnerModal";

interface Partner {
  id: number;
  companyName: string;
  email: string;
  phone: string;
  prefecture: string;
  status: string;
  registrationDate: string;
  address?: string;
  representativeName?: string;
  businessDescription?: string;
  appealText?: string;
  businessHours?: string;
  closedDays?: string;
  website?: string;
  rating?: number;
  reviewCount?: number;
  completedCount?: number;
  priceRangeMin?: number;
  priceRangeMax?: number;
  averagePrice?: number;
  serviceAreas?: string[];
}

const PartnersView = () => {
  const [partnerFilter, setPartnerFilter] = useState("すべて");
  const [partnerSearch, setPartnerSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'detail'>('add');
  const [selectedPartner, setSelectedPartner] = useState<Partner | undefined>(undefined);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // データベースからパートナー情報を取得
  const fetchPartners = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/partners', {
        credentials: 'include'
      });

      // レスポンスの詳細をログ出力
      console.log('Partners API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Partners API error:', response.status, errorText);
        throw new Error(`Failed to fetch partners: ${response.status}`);
      }

      const data = await response.json();
      setPartners(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching partners:', err);
      // setError('パートナー情報の取得に失敗しました');
      // エラー時はモックデータを使用（エラー表示はしない）
    } finally {
      setLoading(false);
    }
  };

  // コンポーネントマウント時にデータ取得と申請データチェック
  useEffect(() => {
    fetchPartners(); // データベース接続を有効化

    // 申請からの遷移をチェック
    const applicationData = sessionStorage.getItem('applicationData');
    const shouldOpenModal = sessionStorage.getItem('openNewPartnerModal');

    if (applicationData && shouldOpenModal === 'true') {
      // 申請データをパース
      const data = JSON.parse(applicationData);

      // 新規登録モーダルを開く
      setSelectedPartner(data);
      setModalMode('add');
      setIsModalOpen(true);

      // sessionStorageをクリア
      sessionStorage.removeItem('applicationData');
      sessionStorage.removeItem('openNewPartnerModal');
    }
  }, []);

  // ステータス変更処理
  const handlePartnerStatusChange = async (partnerId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/partners/${partnerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      // ローカルステートを更新
      setPartners(partners.map(partner =>
        partner.id === partnerId ? { ...partner, status: newStatus } : partner
      ));
    } catch (err) {
      console.error('Error updating partner status:', err);
      alert('ステータスの更新に失敗しました');
    }
  };

  const handleAddClick = () => {
    setSelectedPartner(undefined);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleDetailClick = (partner: Partner) => {
    setSelectedPartner(partner);
    setModalMode('detail');
    setIsModalOpen(true);
  };

  // const handleEditClick = (partner: Partner) => {
  //   setSelectedPartner(partner);
  //   setModalMode('edit');
  //   setIsModalOpen(true);
  // };

  // 削除処理
  const handleDeleteClick = async (partnerId: number) => {
    if (!confirm('本当に削除しますか？この操作は取り消せません。')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/partners/${partnerId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to delete partner');
      }

      // ローカルステートから削除
      setPartners(partners.filter(p => p.id !== partnerId));
      alert('パートナーを削除しました');
    } catch (err) {
      console.error('Error deleting partner:', err);
      alert('パートナーの削除に失敗しました');
    }
  };

  // モーダル保存処理
  const handleModalSave = async (newPartner: { name: string; email: string; phoneNumber: string; postalCode: string; address: string; serviceAreas: string[]; status: string; }) => {
    try {
      if (modalMode === 'add') {
        // 新規作成
        const response = await fetch('/api/admin/partners', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newPartner),
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to create partner');
        }

        alert('パートナーを登録しました');
        // データを再取得
        await fetchPartners();
      } else if (modalMode === 'edit' && selectedPartner) {
        // 更新
        const response = await fetch(`/api/admin/partners/${selectedPartner.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newPartner),
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to update partner');
        }

        alert('パートナー情報を更新しました');
        // データを再取得
        await fetchPartners();
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving partner:', err);
      alert('保存に失敗しました');
    }
  };

  // フィルタリングされたパートナー
  const filteredPartners = partners.filter(partner => {
    const matchesFilter = partnerFilter === "すべて" || partner.status === partnerFilter;
    const matchesSearch = partner.companyName.toLowerCase().includes(partnerSearch.toLowerCase()) ||
                        partner.email.toLowerCase().includes(partnerSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">加盟店管理</h2>
        </div>

        {/* ツールバー */}
        <div className="px-6 py-4 bg-gray-200 border-b border-gray-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleAddClick}
                className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
              >
                新規追加
              </button>
              <select
                value={partnerFilter}
                onChange={(e) => setPartnerFilter(e.target.value)}
                className="px-3 py-2 border border-gray-500 rounded-md text-sm text-gray-800"
              >
                <option value="すべて">すべて</option>
                <option value="表示">表示</option>
                <option value="非表示">非表示</option>
              </select>
              <div className="relative">
                <input
                  type="text"
                  value={partnerSearch}
                  onChange={(e) => setPartnerSearch(e.target.value)}
                  placeholder="検索..."
                  className="pl-3 pr-10 py-2 border border-gray-500 rounded-md text-sm w-64 text-gray-800"
                />
                <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-500">{filteredPartners.length}</div>
              <div className="text-sm text-gray-700">登録加盟店数</div>
            </div>
          </div>
        </div>

        {/* テーブル */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">会社名</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">メールアドレス</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">電話番号</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">都道府県</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">ステータス</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">作成日</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">詳細</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPartners.map((partner) => (
                <tr key={partner.id} className="hover:bg-gray-100">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {partner.companyName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {partner.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {partner.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {partner.prefecture}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={partner.status}
                      onChange={(e) => handlePartnerStatusChange(partner.id, e.target.value)}
                      className={`px-3 py-1 text-xs font-medium rounded-md border-0 ${
                        partner.status === "表示"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-300 text-gray-900"
                      }`}
                    >
                      <option value="表示">表示</option>
                      <option value="非表示">非表示</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {partner.registrationDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDetailClick(partner)}
                      className="text-blue-600 hover:text-blue-900 text-sm"
                    >
                      詳細
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDeleteClick(partner.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* モーダル */}
      <PartnerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        partner={selectedPartner}
        onSave={handleModalSave}
        onEditClick={(partner) => {
          setSelectedPartner(partner);
          setModalMode('edit');
        }}
      />
    </div>
  );
};

export default PartnersView;