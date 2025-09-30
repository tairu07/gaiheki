'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function OrderFilterTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get('status') || 'すべて';

  const filters = ['すべて', 'ORDERED', 'IN_PROGRESS', 'COMPLETED', 'REVIEW_COMPLETED', 'CANCELLED'];
  const filterLabels: Record<string, string> = {
    'すべて': 'すべて',
    'ORDERED': '受注',
    'IN_PROGRESS': '施工中',
    'COMPLETED': '施工完了',
    'REVIEW_COMPLETED': '評価完了',
    'CANCELLED': 'キャンセル'
  };

  const handleFilterChange = (filter: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (filter === 'すべて') {
      params.delete('status');
    } else {
      params.set('status', filter);
    }
    router.push(`/admin-dashboard/orders?${params.toString()}`);
  };

  return (
    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
      <div className="flex space-x-2">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => handleFilterChange(filter)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              currentFilter === filter
                ? 'bg-gray-800 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {filterLabels[filter] || filter}
          </button>
        ))}
      </div>
    </div>
  );
}