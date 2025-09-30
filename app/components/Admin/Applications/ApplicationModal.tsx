"use client";

import { useState } from "react";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: {
    id?: number;
    companyName?: string;
    companyNameKana?: string;
    postalCode?: string;
    prefecture?: string;
    city?: string;
    address?: string;
    building?: string;
    phoneNumber?: string;
    faxNumber?: string;
    email?: string;
    website?: string;
    establishedYear?: string;
    capitalAmount?: string;
    employeeCount?: number;
    insuranceType?: string;
    licenses?: string;
    businessContent?: string;
    constructionRecords?: string;
    serviceAreas?: string[];
    priceRange?: string;
    strength?: string;
    availableDates?: string;
    desiredPrice?: string;
    notes?: string;
    status?: string;
    createdAt?: string;
  };
  onStatusChange?: (applicationId: number, newStatus: string) => void;
}

export default function ApplicationModal({
  isOpen,
  onClose,
  application,
  onStatusChange
}: ApplicationModalProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'business' | 'action'>('basic');
  const [selectedStatus, setSelectedStatus] = useState(application?.status || '審査中');
  const [adminMemo, setAdminMemo] = useState('');

  if (!isOpen || !application) return null;

  const handleStatusChange = () => {
    if (onStatusChange && selectedStatus !== application.status) {
      onStatusChange(application.id, selectedStatus);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">申請詳細</h2>
          <button
            onClick={onClose}
            className="text-gray-700 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* タブナビゲーション */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('basic')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'basic'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              基本情報
            </button>
            <button
              onClick={() => setActiveTab('business')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'business'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              事業内容
            </button>
            <button
              onClick={() => setActiveTab('action')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'action'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              アクション
            </button>
          </nav>
        </div>

        {/* 基本情報タブ */}
        {activeTab === 'basic' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">会社名</label>
                <p className="text-gray-800">{application.companyName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">代表者名</label>
                <p className="text-gray-800">{application.representative}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">メールアドレス</label>
                <p className="text-gray-800">{application.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">電話番号</label>
                <p className="text-gray-800">{application.phone}</p>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-2">住所</label>
                <p className="text-gray-800">{application.address}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">ウェブサイト</label>
                {application.website ? (
                  <a
                    href={application.website.startsWith('http') ? application.website : `https://${application.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {application.website}
                  </a>
                ) : (
                  <p className="text-gray-500">未設定</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">申請日</label>
                <p className="text-gray-800">{application.applicationDate || '2024年1月15日'}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">対応可能エリア</label>
              <div className="flex flex-wrap gap-2">
                {application.serviceAreas ? (
                  application.serviceAreas.map((area: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {area}
                    </span>
                  ))
                ) : (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                    東京都、神奈川県、埼玉県、千葉県
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 事業内容タブ */}
        {activeTab === 'business' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">事業内容</label>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-800 whitespace-pre-wrap">
                  {application.businessDescription || `外壁塗装・屋根塗装を中心とした住宅リフォーム全般を手がけております。
創業30年の実績と信頼で、お客様の大切なお住まいを守ります。

【主な事業内容】
・外壁塗装工事
・屋根塗装工事
・防水工事
・外壁・屋根リフォーム
・その他住宅リフォーム全般

自社施工にこだわり、中間マージンなしの適正価格でサービスを提供しています。`}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">アピールポイント</label>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-800 whitespace-pre-wrap">
                  {application.appealPoints || `◆ 完全自社施工で安心の品質管理
◆ 地域密着30年の信頼と実績
◆ 国家資格を持つ職人が多数在籍
◆ アフターフォロー体制充実（10年保証）
◆ 無料点検・無料見積もり実施中`}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">営業時間</label>
                <p className="text-gray-800">{application.businessHours || '9:00-18:00'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">定休日</label>
                <p className="text-gray-800">{application.closedDays || '日曜・祝日'}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">保有資格</label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-900">建設業許可（塗装工事業）</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-900">一級塗装技能士（3名在籍）</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-900">外壁診断士</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* アクションタブ */}
        {activeTab === 'action' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">現在のステータス</label>
              <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                application.status === "審査中" ? "bg-yellow-100 text-yellow-800" :
                application.status === "承認" ? "bg-green-100 text-green-800" :
                application.status === "却下" ? "bg-red-100 text-red-800" :
                "bg-gray-100 text-gray-800"
              }`}>
                {application.status}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">ステータス変更</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-500 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
              >
                <option value="審査中">審査中</option>
                <option value="承認">承認</option>
                <option value="却下">却下</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">管理者メモ</label>
              <textarea
                value={adminMemo}
                onChange={(e) => setAdminMemo(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-500 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                placeholder="審査に関するメモを記入..."
              />
            </div>

            {selectedStatus === '承認' && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <p className="text-sm text-green-800">
                  承認すると、この申請者に加盟店アカウントが発行されます。
                  ログイン情報は登録されたメールアドレスに送信されます。
                </p>
              </div>
            )}

            {selectedStatus === '却下' && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-800">
                  却下理由を管理者メモに記載してください。
                  申請者には却下通知メールが送信されます。
                </p>
              </div>
            )}
          </div>
        )}

        {/* フッター */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            閉じる
          </button>
          {activeTab === 'action' && selectedStatus !== application.status && (
            <button
              onClick={handleStatusChange}
              className={`px-4 py-2 text-white rounded-md ${
                selectedStatus === '承認'
                  ? 'bg-green-600 hover:bg-green-700'
                  : selectedStatus === '却下'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              ステータスを更新
            </button>
          )}
        </div>
      </div>
    </div>
  );
}