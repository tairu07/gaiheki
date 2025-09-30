"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PartnerDashboardContent = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("diagnosis-management");

  // 診断管理データ
  const [diagnoses] = useState([
    { id: "GH-00001", prefecture: "東京都", issue: "他社から見積もりを貰をもらった", workType: "外壁と屋根の塗装", date: "2024年03月01日", status: "見積もり比較中" },
    { id: "GH-00002", prefecture: "神奈川県", issue: "価格の相場が気になっている", workType: "屋根の塗装", date: "2024年02月28日", status: "業者指定" },
    { id: "GH-00003", prefecture: "埼玉県", issue: "価格の相場が気になっている", workType: "外壁の塗装", date: "2024年02月25日", status: "見積もり募集中" },
    { id: "GH-00004", prefecture: "東京都", issue: "すぐに工事をしたい", workType: "外壁・屋根塗装", date: "2024年02月20日", status: "業者決定" }
  ]);

  // 受注管理データ
  const [orders] = useState([
    { id: "DIAG-001", customerName: "田中太郎", address: "東京都渋谷区渋谷1-1-1", amount: "¥1,200,000", email: "tanaka@example.com", status: "受注", date: "2024-01-15" },
    { id: "DIAG-002", customerName: "佐藤花子", address: "神奈川県横浜市中区本町2-2-2", amount: "¥800,000", email: "sato@example.com", status: "施工中", date: "2024-01-20" },
    { id: "DIAG-003", customerName: "山田次郎", address: "埼玉県さいたま市大宮区大宮3-3-3", amount: "¥1,500,000", email: "yamada@example.com", status: "キャンセル", date: "2024-01-10" }
  ]);

  // 施工完了データ
  const [completedWork] = useState([
    { id: "DIAG-001", customerName: "田中太郎", address: "東京都渋谷区渋谷1-1-1", amount: "¥1,200,000", email: "tanaka@example.com", status: "施工完了", date: "2024-03-15" },
    { id: "DIAG-002", customerName: "佐藤花子", address: "神奈川県横浜市中区本町2-2-2", amount: "¥800,000", email: "sato@example.com", status: "評価完了", date: "2024-03-20" },
    { id: "DIAG-003", customerName: "山田次郎", address: "埼玉県さいたま市大宮区大宮3-3-3", amount: "¥1,500,000", email: "yamada@example.com", status: "施工完了", date: "2024-02-28" }
  ]);

  // 口コミデータ
  const [reviews] = useState([
    { 
      id: 1, 
      customerName: "田中雄", 
      rating: 5.0, 
      title: "とても満足しています",
      content: "外壁塗装をお願いしました。職人さんの技術が高く、仕上がりがとても綺麗でした。工期も予定通りで、アフターフォローも丁寧でした。また機会があればお願いしたいと思います。",
      workType: "外壁・屋根塗装",
      amount: "¥850,000",
      completedDate: "2024年02月28日",
      reviewDate: "2024年03月02日"
    },
    {
      id: 2,
      customerName: "佐藤様",
      rating: 4.0,
      title: "丁寧な対応でした",
      content: "見積もりから施工まで丁寧に対応していただきました。価格も他社と比べて適正だったと思います。一部気になる箇所がありましたが、すぐに対応してくれました。",
      workType: "外壁塗装",
      amount: "¥720,000",
      completedDate: "2024年02月20日",
      reviewDate: "2024年02月25日"
    },
    {
      id: 3,
      customerName: "山田様",
      rating: 5.0,
      title: "プロの仕事でした",
      content: "",
      workType: "",
      amount: "",
      completedDate: "2024年02月15日",
      reviewDate: "2024年02月18日"
    }
  ]);

  const [companyInfo] = useState({
    companyName: "株式会社山田塗装",
    representativeName: "山田太郎",
    email: "info@yamada-tosou.co.jp",
    phone: "03-1234-5678",
    fax: "03-1234-5679",
    website: "https://yamada-tosou.co.jp",
    address: "東京都渋谷区渋谷1-1-1ビル3F",
    businessHours: "平日 8:00-18:00 / 土曜 8:00-17:00",
    holidays: "日曜・祝日・年末年始",
    businessContent: "外壁塗装、屋根塗装、防水工事を専門とする総合塗装業。戸建住宅から大型建築物まで幅広く対応し、高品質な素材と熟練の技術で長期保証を提供しています。",
    appeal: "創業30年の実績と信頼。お客様満足度95%以上を誇る外壁塗装専門店です。地域密着のサービスで、アフターフォローも万全です。",
    loginEmail: "admin@yamada-tosou.co.jp",
    rating: 4.5,
    reviewCount: 128,
    workCount: 450,
    serviceAreas: ["東京都", "神奈川県", "埼玉県"]
  });

  const handleLogout = () => {
    router.push("/partner-login");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "新規":
        return "bg-blue-100 text-blue-800";
      case "対応中":
        return "bg-yellow-100 text-yellow-800";
      case "見積提出済み":
        return "bg-green-100 text-green-800";
      case "成約":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const menuItems = [
    {
      id: "company-info",
      label: "会社情報",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      id: "diagnosis-management",
      label: "診断管理",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    },
    {
      id: "order-management", 
      label: "受注管理",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6-4h6m2 5l-3-3 3-3m-6 8.5a8 8 0 100-16 8 8 0 000 16z" />
        </svg>
      )
    },
    {
      id: "construction-completion",
      label: "施工完了管理", 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: "review-management",
      label: "口コミ情報管理",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* サイドバー */}
      <aside className="w-64 min-w-64 bg-white shadow-sm flex-shrink-0">
        {/* サイドバーヘッダー */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">管理画面</h1>
        </div>

        {/* メニューリスト */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-md transition-colors ${
                    activeTab === item.id
                      ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {item.icon}
                  <span className="ml-3 whitespace-nowrap">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* トップ画面・ログアウトボタン */}
        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200 space-y-2">
          <button
            onClick={() => router.push("/")}
            className="w-full flex items-center px-4 py-3 text-left rounded-md transition-colors text-gray-700 hover:bg-gray-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="ml-3">トップ画面に戻る</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-left rounded-md transition-colors text-gray-700 hover:bg-gray-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="ml-3">ログアウト</span>
          </button>
        </div>
      </aside>

      {/* メインコンテンツ */}
      <main className="flex-1 p-8 min-w-0">

        {/* 会社情報タブ */}
        {activeTab === "company-info" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">会社情報</h2>
              <button className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium">
                編集
              </button>
            </div>
            <p className="text-gray-600">お客様に表示される会社情報を管理できます。</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 基本情報 */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center mb-4">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <h3 className="font-medium text-gray-900">基本情報</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">会社名</label>
                        <div className="text-gray-900">{companyInfo.companyName}</div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">代表者名</label>
                        <div className="text-gray-900">{companyInfo.representativeName}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">メールアドレス</label>
                        <div className="text-gray-900">{companyInfo.email}</div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">電話番号</label>
                        <div className="text-gray-900">{companyInfo.phone}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">FAX番号</label>
                        <div className="text-gray-900">{companyInfo.fax}</div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">ウェブサイト</label>
                        <div className="text-blue-600">{companyInfo.website}</div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1">住所</label>
                      <div className="text-gray-900">{companyInfo.address}</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">営業時間</label>
                        <div className="text-gray-900">{companyInfo.businessHours}</div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">定休日</label>
                        <div className="text-gray-900">{companyInfo.holidays}</div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1">事業内容</label>
                      <div className="text-gray-900">{companyInfo.businessContent}</div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1">アピール文章</label>
                      <div className="text-gray-900">{companyInfo.appeal}</div>
                    </div>
                  </div>
                </div>

                {/* ログイン情報 */}
                <div className="bg-white rounded-lg shadow p-6 mt-6">
                  <h3 className="font-medium text-gray-900 mb-4">ログイン情報</h3>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">ログインメールアドレス</label>
                    <div className="text-gray-900">{companyInfo.loginEmail}</div>
                  </div>
                </div>
              </div>

              {/* サイドバー情報 */}
              <div className="space-y-6">
                {/* 実績・評価 */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center mb-4">
                    <svg className="w-5 h-5 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                    </svg>
                    <h3 className="font-medium text-gray-900">実績・評価</h3>
                  </div>
                  
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-orange-500">{companyInfo.rating}</div>
                    <div className="flex justify-center items-center mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className={`w-4 h-4 ${star <= Math.floor(companyInfo.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                        </svg>
                      ))}
                    </div>
                    <div className="text-sm text-gray-600">{companyInfo.reviewCount}件のレビュー</div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-900">{companyInfo.workCount}件</div>
                      <div className="text-sm text-gray-600">施工実績</div>
                    </div>
                  </div>
                </div>

                {/* 対応エリア */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="font-medium text-gray-900 mb-4">対応エリア</h3>
                  <div className="flex flex-wrap gap-2">
                    {companyInfo.serviceAreas.map((area) => (
                      <span key={area} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 診断管理タブ */}
        {activeTab === "diagnosis-management" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">診断管理</h2>
            
            {/* ステータスフィルター */}
            <div className="flex space-x-2">
              {["すべて", "業者指定", "見積もり募集中", "見積もり比較中", "業者決定", "キャンセル"].map((filter) => (
                <button
                  key={filter}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    filter === "すべて"
                      ? "bg-gray-800 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* テーブル */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">診断ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">都道府県</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">現在の状況</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">工事箇所</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">診断依頼日</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">見積もり提出</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {diagnoses.map((diagnosis) => (
                      <tr key={diagnosis.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {diagnosis.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {diagnosis.prefecture}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {diagnosis.issue}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {diagnosis.workType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {diagnosis.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 text-xs font-medium rounded-md ${
                            diagnosis.status === "見積もり比較中" ? "bg-purple-100 text-purple-800" :
                            diagnosis.status === "業者指定" ? "bg-blue-100 text-blue-800" :
                            diagnosis.status === "見積もり募集中" ? "bg-orange-100 text-orange-800" :
                            diagnosis.status === "業者決定" ? "bg-green-100 text-green-800" :
                            "bg-gray-100 text-gray-800"
                          }`}>
                            {diagnosis.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {diagnosis.status === "業者決定" ? (
                            <button className="text-gray-600">確認</button>
                          ) : (
                            <button className="bg-gray-800 text-white px-4 py-1 rounded text-sm">
                              見積もり提出
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 受注管理タブ */}
        {activeTab === "order-management" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">受注管理</h2>
              <p className="text-gray-600 mt-2">診断から受注に至った案件を管理できます。</p>
            </div>
            
            {/* ステータスフィルター */}
            <div className="flex space-x-2">
              {["すべて", "受注", "施工中", "キャンセル"].map((filter) => (
                <button
                  key={filter}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    filter === "すべて"
                      ? "bg-gray-800 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* 受注一覧 */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">受注一覧</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">診断ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">顧客名</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">施工住所</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">施工金額</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">メールアドレス</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">受注日</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.customerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.address}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select className={`px-3 py-1 text-xs font-medium rounded-md border-0 ${
                            order.status === "受注" ? "bg-blue-100 text-blue-800" :
                            order.status === "施工中" ? "bg-orange-100 text-orange-800" :
                            order.status === "キャンセル" ? "bg-red-100 text-red-800" :
                            "bg-gray-100 text-gray-800"
                          }`}>
                            <option value="受注">受注</option>
                            <option value="施工中">施工中</option>
                            <option value="キャンセル">キャンセル</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="flex items-center text-gray-600 hover:text-gray-900">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            詳細
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 施工完了管理タブ */}
        {activeTab === "construction-completion" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">施工完了管理</h2>
              <p className="text-gray-600 mt-2">施工が完了した案件を管理できます。</p>
            </div>
            
            {/* ステータスフィルター */}
            <div className="flex space-x-2">
              {["すべて", "施工完了", "評価完了"].map((filter) => (
                <button
                  key={filter}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    filter === "すべて"
                      ? "bg-gray-800 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* 施工完了一覧 */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">施工完了一覧</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">診断ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">顧客名</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">施工住所</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">施工金額</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">メールアドレス</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">完了日</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {completedWork.map((work) => (
                      <tr key={work.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {work.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {work.customerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {work.address}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {work.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {work.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 text-xs font-medium rounded-md ${
                            work.status === "施工完了" ? "bg-green-100 text-green-800" :
                            work.status === "評価完了" ? "bg-blue-100 text-blue-800" :
                            "bg-gray-100 text-gray-800"
                          }`}>
                            {work.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {work.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="flex items-center text-gray-600 hover:text-gray-900">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            詳細
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 口コミ情報管理タブ */}
        {activeTab === "review-management" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">口コミ管理</h2>
              <p className="text-gray-600 mt-2">施工完了後にお客様から送られてきた口コミ・評価を確認できます。</p>
            </div>

            {/* 総合評価 */}
            <div className="bg-white rounded-lg shadow p-8">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-4">総合評価</h3>
                <div className="text-6xl font-bold text-orange-500 mb-2">{companyInfo.rating}</div>
                <div className="flex justify-center items-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className={`w-6 h-6 ${star <= Math.floor(companyInfo.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                    </svg>
                  ))}
                </div>
              </div>
            </div>

            {/* 検索・フィルター */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-4">
                <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                  <option value="すべて">すべて</option>
                  <option value="5">5つ星</option>
                  <option value="4">4つ星</option>
                  <option value="3">3つ星</option>
                  <option value="2">2つ星</option>
                  <option value="1">1つ星</option>
                </select>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="レビューを検索..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* お客様からの口コミ一覧 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">お客様からの口コミ一覧</h3>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-4">
                        <h4 className="font-medium text-gray-900">{review.customerName}</h4>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg key={star} className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 24 24">
                              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                            </svg>
                          ))}
                          <span className="ml-2 text-sm font-medium text-gray-900">{review.rating.toFixed(1)}</span>
                        </div>
                        <span className="text-sm text-gray-500">{review.title}</span>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <div>施工完了: {review.completedDate}</div>
                        <div>レビュー: {review.reviewDate}</div>
                      </div>
                    </div>
                    
                    {review.content && (
                      <p className="text-gray-700 mb-4">{review.content}</p>
                    )}
                    
                    {review.workType && review.amount && (
                      <div className="flex items-center space-x-4 text-sm text-gray-600 bg-gray-50 rounded p-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">{review.workType}</span>
                        <span>契約金額: {review.amount}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default PartnerDashboardContent;