"use client";

import { useState } from "react";
import Link from "next/link";

const ColumnsPageContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("すべてのカテゴリ");

  // サンプルコラムデータ
  const columns = [
    {
      id: 1,
      title: "外壁塗装の最適な時期とは？",
      category: "塗装知識",
      date: "2024-01-15T10:00:00Z",
      description: "外壁塗装を行う最適な時期について詳しく解説します。季節による違い、建物の状態による判断基準をご紹介。春と秋が最も適しているのか、真夏や真冬に塗装は可能なのか詳しく解説いたします。",
      image: "/api/placeholder/400/250"
    },
    {
      id: 2,
      title: "塗料の種類と特徴を比較",
      category: "塗料情報",
      date: "2024-01-14T14:00:00Z",
      description: "シリコン塗料、フッ素塗料、無機塗料など、各種塗料の特徴と価格帯を詳しく比較します。耐久性、価格、仕上がりの美しさなど、様々な角度から塗装を選ぶポイントをご紹介いたします。",
      image: "/api/placeholder/400/250"
    },
    {
      id: 3,
      title: "外壁塗装の費用相場",
      category: "費用・価格",
      date: "2024-01-13T09:00:00Z",
      description: "戸建て住宅の外壁塗装にかかる費用の相場と、価格を左右する要因について解説します。建物の大きさ、使用する塗料、施工業者による価格差について詳しくご説明いたします。",
      image: "/api/placeholder/400/250"
    }
  ];

  const categories = ["すべてのカテゴリ", "塗装知識", "塗料情報", "費用・価格", "施工事例", "メンテナンス"];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Tokyo'
    }).replace(/\//g, '-').replace(',', '');
  };

  const filteredColumns = columns.filter(column => {
    const matchesSearch = column.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         column.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "すべてのカテゴリ" || column.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* パンくずナビ */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-orange-500 transition-colors">
              トップ
            </Link>
            <span>＞</span>
            <span className="text-gray-700">外壁塗装コラム</span>
          </nav>
        </div>

        {/* メインコンテンツ */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">外壁・屋根塗装の関連コラム</h1>
          <p className="text-lg text-gray-600">
            外壁塗装に関する役立つ情報をお届けします。費用相場から業者選びまで、専門家が詳しく解説します。
          </p>
        </div>

        {/* 検索・フィルターセクション */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* 検索バー */}
            <div className="flex-1 relative">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="コラムを検索..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            {/* カテゴリフィルター */}
            <div className="lg:w-64">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none bg-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* 検索結果数 */}
        <div className="mb-6">
          <p className="text-gray-600">{filteredColumns.length}件のコラムが見つかりました</p>
        </div>

        {/* コラム一覧 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredColumns.map(column => (
            <article key={column.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* 画像エリア */}
              <div className="aspect-video bg-gray-200 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>

              <div className="p-6">
                {/* カテゴリとタグ */}
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
                    {column.category}
                  </span>
                  <span className="text-xs text-gray-500">{formatDate(column.date)}</span>
                </div>

                {/* タイトル */}
                <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                  {column.title}
                </h3>

                {/* 説明文 */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {column.description}
                </p>

                {/* 詳しく読むリンク */}
                <Link 
                  href={`/columns/${column.id}`}
                  className="inline-flex items-center text-orange-500 hover:text-orange-600 font-medium text-sm transition-colors"
                >
                  詳しく読む
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* 検索結果がない場合 */}
        {filteredColumns.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.507-.878-6.137-2.32L2 17l4.9-1.063A7.962 7.962 0 0112 15z" />
            </svg>
            <p className="text-gray-500 text-lg">検索条件に合うコラムが見つかりませんでした。</p>
            <p className="text-gray-400 text-sm mt-2">検索キーワードやカテゴリを変更してお試しください。</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColumnsPageContent;