'use client';

import { useEffect, useState } from 'react';

interface DashboardStats {
  partnersCount: number;
  ordersCount: number;
  inquiriesCount: number;
  diagnosesCount: number;
}

export default function AdminDashboardPage() {
  const [username] = useState('admin');
  const [stats, setStats] = useState<DashboardStats>({
    partnersCount: 0,
    ordersCount: 0,
    inquiriesCount: 0,
    diagnosesCount: 0,
  });

  useEffect(() => {
    // モックデータを設定（実際のデータベース接続が復旧したら置き換える）
    setStats({
      partnersCount: 24,
      ordersCount: 156,
      inquiriesCount: 8,
      diagnosesCount: 12,
    });
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="text-gray-600 mt-2">ようこそ、{username}さん</p>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  アクティブ加盟店
                </dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  {stats.partnersCount}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  総受注数
                </dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  {stats.ordersCount}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-100 rounded-lg p-3">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  未対応の問い合わせ
                </dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  {stats.inquiriesCount}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  見積もり募集中
                </dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  {stats.diagnosesCount}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* クイックアクション */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">クイックアクション</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin-dashboard/diagnoses"
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <h3 className="font-medium text-gray-900">診断管理</h3>
            <p className="text-sm text-gray-500 mt-1">見積もり依頼の確認と業者選定</p>
          </a>
          <a
            href="/admin-dashboard/orders"
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <h3 className="font-medium text-gray-900">受注管理</h3>
            <p className="text-sm text-gray-500 mt-1">施工状況の管理と確認</p>
          </a>
          <a
            href="/admin-dashboard/partners"
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <h3 className="font-medium text-gray-900">加盟店管理</h3>
            <p className="text-sm text-gray-500 mt-1">加盟店情報の編集と管理</p>
          </a>
        </div>
      </div>
    </div>
  );
}