'use client';

import { useState, useEffect } from 'react';
import ColumnEditorModal from './ColumnEditorModal';
import { PlusCircle, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

const categories = [
  'すべて',
  '外壁塗装の基礎知識',
  '塗料の種類と特徴',
  '施工事例',
  'メンテナンス',
  '業者選びのポイント',
  '費用・見積もり',
  'トラブル対処法',
  '季節・天候',
];

export default function ColumnsView() {
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('すべて');
  const [statusFilter, setStatusFilter] = useState('すべて');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);

  useEffect(() => {
    fetchColumns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFilter, statusFilter]);

  const fetchColumns = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (categoryFilter !== 'すべて') {
        params.append('category', categoryFilter);
      }
      if (statusFilter !== 'すべて') {
        params.append('status', statusFilter);
      }

      const response = await fetch(`/api/admin/columns?${params}`);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error || 'Failed to fetch columns');
      }
      const data = await response.json();
      setColumns(data || []);
    } catch (error) {
      console.error('Error fetching columns:', error);
      setColumns([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (column) => {
    setSelectedColumn(column);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedColumn(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('このコラムを削除してもよろしいですか？')) return;

    try {
      const response = await fetch('/api/admin/columns', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete column');
      }

      alert('コラムを削除しました');
      fetchColumns();
    } catch (error) {
      console.error('Error deleting column:', error);
      alert('コラムの削除に失敗しました');
    }
  };

  const handleToggleStatus = async (column) => {
    const newStatus = column.status === '表示' ? '非表示' : '表示';

    try {
      const response = await fetch('/api/admin/columns', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: column.id,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      alert(`コラムを${newStatus}に変更しました`);
      fetchColumns();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('ステータスの変更に失敗しました');
    }
  };

  const handleSave = () => {
    fetchColumns();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">コラム管理</h2>
          <button
            onClick={handleCreate}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <PlusCircle className="w-5 h-5" />
            <span>新規コラム作成</span>
          </button>
        </div>

        {/* フィルター */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 space-y-4">
          <div className="flex space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">カテゴリ</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-gray-900"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ステータス</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-gray-900"
              >
                <option value="すべて">すべて</option>
                <option value="表示">表示</option>
                <option value="非表示">非表示</option>
              </select>
            </div>
          </div>
        </div>

        {/* テーブル */}
        {loading ? (
          <div className="p-8 text-center text-gray-600 font-medium">
            読み込み中...
          </div>
        ) : columns.length === 0 ? (
          <div className="text-center py-8 text-gray-600 font-medium">
            該当するコラムがありません
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    タイトル
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    カテゴリ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    閲覧数
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    ステータス
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    作成日
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {columns.map((column) => (
                  <tr key={column.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {column.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs truncate">
                        {column.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {column.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {column.views || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(column)}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold ${
                          column.status === '表示'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {column.status === '表示' ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                        <span>{column.status}</span>
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {column.created_at ? new Date(column.created_at).toLocaleDateString('ja-JP') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(column)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(column.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* コラムエディタモーダル */}
      <ColumnEditorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        column={selectedColumn}
        onSave={handleSave}
      />
    </div>
  );
}