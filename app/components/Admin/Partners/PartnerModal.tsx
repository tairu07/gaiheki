"use client";

import { useState, useEffect } from "react";

interface PartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit' | 'detail';
  partner?: { id?: number; name?: string; email?: string; phoneNumber?: string; postalCode?: string; address?: string; serviceAreas?: string[]; status?: string; createdAt?: string; };
  onSave?: (partner: { id?: number; name?: string; email?: string; phoneNumber?: string; postalCode?: string; address?: string; serviceAreas?: string[]; status?: string; createdAt?: string; }) => void;
  onEditClick?: (partner: { id?: number; name?: string; email?: string; phoneNumber?: string; postalCode?: string; address?: string; serviceAreas?: string[]; status?: string; createdAt?: string; }) => void;
}

export default function PartnerModal({ isOpen, onClose, mode, partner, onSave, onEditClick }: PartnerModalProps) {
  const [selectedPrefectures, setSelectedPrefectures] = useState<string[]>([]);

  useEffect(() => {
    if (partner?.serviceAreas) {
      setSelectedPrefectures(partner.serviceAreas);
    } else if (partner?.prefecture) {
      setSelectedPrefectures([partner.prefecture]);
    } else {
      setSelectedPrefectures([]);
    }
  }, [partner]);

  if (!isOpen) return null;

  const isReadOnly = mode === 'detail';
  const title = mode === 'add' ? '新規加盟店登録' : mode === 'edit' ? '加盟店情報編集' : '加盟店詳細';

  const allPrefectures = [
    "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
    "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
    "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
    "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
    "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
    "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
    "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave && mode !== 'detail') {
      const formData = new FormData(e.target as HTMLFormElement);
      const newPartner = {
        companyName: formData.get('companyName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        prefecture: formData.get('prefecture'),
        address: formData.get('address'),
        representativeName: formData.get('representativeName'),
        businessDescription: formData.get('businessDescription'),
        appealText: formData.get('appealText'),
        businessHours: formData.get('businessHours'),
        closedDays: formData.get('closedDays'),
        website: formData.get('website'),
        serviceAreas: selectedPrefectures,
        loginEmail: formData.get('loginEmail'),
        password: formData.get('password'),
        status: formData.get('status') || '表示',
      };
      onSave(newPartner);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-700 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 基本情報セクション */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">基本情報</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  会社名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  defaultValue={partner?.companyName}
                  readOnly={isReadOnly}
                  required={!isReadOnly}
                  className="w-full px-3 py-2 border border-gray-500 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  代表者名
                </label>
                <input
                  type="text"
                  name="representativeName"
                  defaultValue={partner?.representativeName || ''}
                  readOnly={isReadOnly}
                  className="w-full px-3 py-2 border border-gray-500 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  メールアドレス <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  defaultValue={partner?.email}
                  readOnly={isReadOnly}
                  required={!isReadOnly}
                  className="w-full px-3 py-2 border border-gray-500 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  電話番号 <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  defaultValue={partner?.phone}
                  readOnly={isReadOnly}
                  required={!isReadOnly}
                  className="w-full px-3 py-2 border border-gray-500 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  本社所在地（都道府県） <span className="text-red-500">*</span>
                </label>
                <select
                  name="prefecture"
                  defaultValue={partner?.prefecture}
                  disabled={isReadOnly}
                  required={!isReadOnly}
                  className="w-full px-3 py-2 border border-gray-500 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                >
                  <option value="">選択してください</option>
                  {allPrefectures.map(pref => (
                    <option key={pref} value={pref}>{pref}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  ウェブサイト
                </label>
                <input
                  type="url"
                  name="website"
                  defaultValue={partner?.website || ''}
                  readOnly={isReadOnly}
                  className="w-full px-3 py-2 border border-gray-500 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-900 mb-1">
                住所
              </label>
              <input
                type="text"
                name="address"
                defaultValue={partner?.address || ''}
                readOnly={isReadOnly}
                className="w-full px-3 py-2 border border-gray-500 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
              />
            </div>
          </div>

          {/* 対応エリア（新規追加・編集時） */}
          {mode !== 'detail' && (
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">対応エリア</h3>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  対応可能な都道府県を選択 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto border border-gray-500 rounded-md p-3">
                  {allPrefectures.map(pref => (
                    <label key={pref} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input
                        type="checkbox"
                        value={pref}
                        checked={selectedPrefectures.includes(pref)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPrefectures([...selectedPrefectures, pref]);
                          } else {
                            setSelectedPrefectures(selectedPrefectures.filter(p => p !== pref));
                          }
                        }}
                        className="rounded border-gray-400 text-blue-600 focus:ring-blue-500"
                        disabled={isReadOnly}
                      />
                      <span className="text-sm text-gray-800">{pref}</span>
                    </label>
                  ))}
                </div>
                {selectedPrefectures.length === 0 && mode !== 'detail' && (
                  <p className="text-red-500 text-sm mt-1">少なくとも1つの都道府県を選択してください</p>
                )}
              </div>
            </div>
          )}

          {/* 事業情報セクション */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">事業情報</h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  営業時間
                </label>
                <input
                  type="text"
                  name="businessHours"
                  defaultValue={partner?.businessHours || '9:00-18:00'}
                  readOnly={isReadOnly}
                  placeholder="例：9:00-18:00"
                  className="w-full px-3 py-2 border border-gray-500 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  定休日
                </label>
                <input
                  type="text"
                  name="closedDays"
                  defaultValue={partner?.closedDays || '日曜・祝日'}
                  readOnly={isReadOnly}
                  placeholder="例：日曜・祝日"
                  className="w-full px-3 py-2 border border-gray-500 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900 mb-1">
                事業内容
              </label>
              <textarea
                name="businessDescription"
                rows={3}
                defaultValue={partner?.businessDescription || ''}
                readOnly={isReadOnly}
                className="w-full px-3 py-2 border border-gray-500 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                placeholder="事業内容の詳細を入力してください"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                アピール文章
              </label>
              <textarea
                name="appealText"
                rows={3}
                defaultValue={partner?.appealText || ''}
                readOnly={isReadOnly}
                className="w-full px-3 py-2 border border-gray-500 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                placeholder="お客様へのアピール文章を入力してください"
              />
            </div>
          </div>

          {/* 評価情報（詳細モードのみ） */}
          {mode === 'detail' && (
            <>
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">実績・評価</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      総合評価
                    </label>
                    <div className="flex items-center">
                      {partner?.rating > 0 ? (
                        <>
                          <span className="text-2xl font-bold text-yellow-500">
                            {partner.rating.toFixed(1)}
                          </span>
                          <span className="ml-2 text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <span key={i}>
                                {i < Math.floor(partner.rating) ? '★' : '☆'}
                              </span>
                            ))}
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-500">評価なし</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      レビュー件数
                    </label>
                    <p className="text-lg font-semibold text-gray-900">{partner?.reviewCount || 0}件</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      施工実績
                    </label>
                    <p className="text-lg font-semibold text-gray-900">{partner?.completedCount || 0}件</p>
                  </div>
                </div>
              </div>

              {/* 対応エリア（詳細モードのみ） */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">対応エリア</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPrefectures.length > 0 ? (
                    selectedPrefectures.map((area: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {area}
                      </span>
                    ))
                  ) : (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                      未設定
                    </span>
                  )}
                </div>
              </div>

              {/* 価格帯（詳細モードのみ - データがある場合のみ表示） */}
              {(partner?.priceRangeMin || partner?.priceRangeMax || partner?.averagePrice) && (
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">価格帯</h3>
                  <div className="bg-gray-200 p-4 rounded-md">
                    <p className="text-sm text-gray-800 mb-2">過去の施工実績から算出</p>
                    {partner?.priceRangeMin && partner?.priceRangeMax && (
                      <p className="text-lg font-semibold text-gray-900">
                        {partner.priceRangeMin}万円 〜 {partner.priceRangeMax}万円
                      </p>
                    )}
                    {partner?.averagePrice && (
                      <p className="text-sm text-gray-800 mt-1">
                        平均施工価格: {partner.averagePrice}万円
                      </p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ログイン情報（新規追加時のみ） */}
          {mode === 'add' && (
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">ログイン情報</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    ログインメールアドレス <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="loginEmail"
                    defaultValue={partner?.loginEmail || partner?.email}
                    required
                    className="w-full px-3 py-2 border border-gray-500 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    パスワード <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    defaultValue=""
                    required
                    placeholder="パスワードを設定"
                    className="w-full px-3 py-2 border border-gray-500 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    加盟店がログインに使用するパスワードを設定してください
                  </p>
                </div>
              </div>
              {partner?.companyName && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-800">
                    <strong>申請情報から自動入力されました</strong><br />
                    必要に応じて内容を編集し、パスワードを設定してから保存してください。
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ステータス（詳細以外） */}
          {mode !== 'detail' && (
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                ステータス
              </label>
              <select
                name="status"
                defaultValue={partner?.status || '表示'}
                className="w-full px-3 py-2 border border-gray-500 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
              >
                <option value="表示">表示</option>
                <option value="非表示">非表示</option>
              </select>
            </div>
          )}

          {/* ステータス情報（詳細モードのみ） */}
          {mode === 'detail' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  ステータス
                </label>
                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                  partner?.status === '表示'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-300 text-gray-900'
                }`}>
                  {partner?.status}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  登録日
                </label>
                <p className="text-sm text-gray-800">{partner?.registrationDate}</p>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              {mode === 'detail' ? '閉じる' : 'キャンセル'}
            </button>
            {mode === 'detail' && (
              <button
                type="button"
                onClick={() => {
                  if (onEditClick) {
                    onEditClick(partner);
                  }
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                編集
              </button>
            )}
            {mode !== 'detail' && (
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                保存
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}