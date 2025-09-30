"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ApplicationModal from "./ApplicationModal";

interface Application {
  id: number;
  companyName: string;
  representative: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  status: string;
}

const ApplicationsView = () => {
  const router = useRouter();
  const [applicationFilter, setApplicationFilter] = useState("すべて");
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [, setIsLoading] = useState(false);

  // 承認済みの申請IDを追跡（重複登録防止）
  const [approvedApplications, setApprovedApplications] = useState<Set<number>>(new Set());

  // 初期状態は空配列にして、フェッチ失敗時のみモックデータを設定
  const [applications, setApplications] = useState<Application[]>([]);

  // データベースから申請一覧を取得
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/applications', {
        credentials: 'include'
      });

      // レスポンスの詳細をログ出力
      console.log('Applications API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Applications API error:', response.status, errorText);
        throw new Error(`Failed to fetch applications: ${response.status}`);
      }

      const data = await response.json();

      // データがある場合は設定、なければ空のまま
      if (data && Array.isArray(data)) {
        setApplications(data);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      // エラー時のみモックデータを設定
      const mockData = [
        { id: 1, companyName: "佐藤塗装工業", representative: "佐藤太郎", address: "神奈川県横浜市青葉区1-1-1", phone: "045-123-4567", email: "info@sato-tosou.co.jp", website: "サイト", status: "審査中" },
        { id: 2, companyName: "田中建装株式会社", representative: "田中花子", address: "大阪府大阪市中央区2-2-2", phone: "06-234-5678", email: "contact@tanaka-kensou.com", website: "サイト", status: "審査中" },
        { id: 3, companyName: "山田ペイント", representative: "山田次郎", address: "愛知県名古屋市中区3-3-3", phone: "052-345-6789", email: "yamada@paint.jp", website: "サイト", status: "審査中" },
        { id: 4, companyName: "鈴木リフォーム", representative: "鈴木三郎", address: "千葉県千葉市中央区4-4-4", phone: "043-456-7890", email: "suzuki@reform.co.jp", website: "サイト", status: "審査中" },
        { id: 5, companyName: "高橋塗装店", representative: "高橋四郎", address: "埼玉県さいたま市大宮区5-5-5", phone: "048-567-8901", email: "takahashi@tosou.net", website: "サイト", status: "審査中" },
        { id: 6, companyName: "伊藤建設", representative: "伊藤五郎", address: "静岡県静岡市駿河区6-6-6", phone: "054-678-9012", email: "ito@kensetsu.com", website: "サイト", status: "審査中" },
        { id: 7, companyName: "渡辺塗装工業", representative: "渡辺六郎", address: "宮城県仙台市青葉区7-7-7", phone: "022-789-0123", email: "watanabe@tosou-kogyo.jp", website: "サイト", status: "審査中" },
        { id: 8, companyName: "中村ペイント", representative: "中村七郎", address: "福岡県福岡市博多区8-8-8", phone: "092-890-1234", email: "nakamura@paint.org", website: "サイト", status: "審査中" },
        { id: 9, companyName: "小林工務店", representative: "小林八郎", address: "石川県金沢市林業9-9-9", phone: "076-901-2345", email: "kobayashi@koumuten.co.jp", website: "サイト", status: "審査中" },
        { id: 10, companyName: "加藤塗装", representative: "加藤九郎", address: "広島県広島市中区10-10-10", phone: "082-012-3456", email: "kato@tosou.hiroshima.jp", website: "サイト", status: "審査中" },
        { id: 11, companyName: "松本建装", representative: "松本一郎", address: "長野県長野市光寺11-11-11", phone: "026-123-4567", email: "matsumoto@kensou.nagano.jp", website: "サイト", status: "承認" },
        { id: 12, companyName: "井上塗装", representative: "井上二郎", address: "香川県高松市丸亀町12-12-12", phone: "087-234-5678", email: "inoue@paint.kagawa.jp", website: "サイト", status: "承認" },
        { id: 13, companyName: "木村リフォーム", representative: "木村三郎", address: "青森県青森市本町13-13-13", phone: "017-345-6789", email: "kimura@reform.aomori.jp", website: "サイト", status: "承認" },
        { id: 14, companyName: "林塗装店", representative: "林四郎", address: "宮崎県宮崎市橘通14-14-14", phone: "0985-456-7890", email: "hayashi@tosou.miyazaki.jp", website: "サイト", status: "承認" }
      ];
      setApplications(mockData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDetailClick = (application: Application) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  const handleWebsiteClick = (website: string) => {
    if (website && website !== 'サイト') {
      const url = website.startsWith('http') ? website : `https://${website}`;
      window.open(url, '_blank');
    } else {
      alert('ウェブサイトのURLが設定されていません');
    }
  };

  const handleStatusChange = async (applicationId: number, newStatus: string) => {
    const application = applications.find(app => app.id === applicationId);
    if (!application) return;

    // 確認ダイアログ
    const confirmMessage =
      newStatus === '承認' ? `「${application.companyName}」を承認しますか？\n承認すると加盟店管理に自動登録されます。` :
      newStatus === '却下' ? `「${application.companyName}」を却下しますか？` :
      `ステータスを「${newStatus}」に変更しますか？`;

    if (!confirm(confirmMessage)) return;

    try {
      // APIを呼び出してステータスを更新
      const response = await fetch(`/api/admin/applications/${applicationId}`, {
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

      await response.json();

      // ローカルステートを更新
      setApplications(prevApplications =>
        prevApplications.map(app =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );

      // 承認の場合、加盟店管理ページに遷移してデータを引き継ぐ
      if (newStatus === '承認' && !approvedApplications.has(applicationId)) {
        setApprovedApplications(prev => new Set(prev).add(applicationId));

        // 申請データを準備
        const partnerData = {
          companyName: application.companyName,
          email: application.email,
          phone: application.phone,
          prefecture: application.address.match(/(.*?[都道府県])/)?.[1] || '東京都',
          address: application.address,
          representativeName: application.representative,
          website: application.website === 'サイト' ? '' : application.website,
          status: '表示',
          loginEmail: application.email,
          // サービスエリアを都道府県に変換
          serviceAreas: application.address.match(/(.*?[都道府県])/)?.[1] ?
            [application.address.match(/(.*?[都道府県])/)?.[1]] : ['東京都'],
        };

        // sessionStorageに申請データを保存
        sessionStorage.setItem('applicationData', JSON.stringify(partnerData));
        sessionStorage.setItem('openNewPartnerModal', 'true');

        // 加盟店管理ページに遷移
        alert(`「${application.companyName}」の承認を行います。\n加盟店管理ページで詳細を確認・編集してください。`);
        router.push('/admin-dashboard/partners');
      } else if (newStatus === '却下') {
        alert(`「${application.companyName}」を却下しました。`);
      } else {
        alert(`ステータスを「${newStatus}」に変更しました。`);
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('ステータスの更新に失敗しました');
      // エラー時は元に戻す
      fetchApplications();
    }
  };

  const handleInlineStatusChange = async (applicationId: number, event: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = event.target.value;
    await handleStatusChange(applicationId, newStatus);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">加盟店申請</h2>
        </div>
        
        {/* ステータスフィルタータブ */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex space-x-2">
            {["すべて", "審査中", "承認", "却下"].map((filter) => (
              <button
                key={filter}
                onClick={() => setApplicationFilter(filter)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  applicationFilter === filter
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">会社名</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">代表者名</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">住所</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">電話番号</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">メールアドレス</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">詳細</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.filter(application => {
                return applicationFilter === "すべて" || application.status === applicationFilter;
              }).map((application) => (
                <tr key={application.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {application.companyName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {application.representative}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {application.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {application.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {application.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleWebsiteClick(application.website)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      {application.website}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDetailClick(application)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      詳細
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={application.status}
                      onChange={(e) => handleInlineStatusChange(application.id, e)}
                      className={`px-3 py-1 text-xs font-medium rounded-md border-0 cursor-pointer ${
                        application.status === "審査中" ? "bg-yellow-100 text-yellow-800" :
                        application.status === "承認" ? "bg-green-100 text-green-800" :
                        application.status === "却下" ? "bg-red-100 text-red-800" :
                        "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <option value="審査中">審査中</option>
                      <option value="承認">承認</option>
                      <option value="却下">却下</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* モーダル */}
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedApplication(null);
        }}
        application={selectedApplication}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default ApplicationsView;