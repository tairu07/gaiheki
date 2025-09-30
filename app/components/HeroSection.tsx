const HeroSection = () => {
  return (
    <section className="bg-orange-500 text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* メインコンテンツ */}
        <div className="text-center mb-12">
          {/* メインタイトル */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
            <span className="block">外壁のお悩み、</span>
            <span className="block text-yellow-300">すべて解決します。</span>
          </h1>
          
          {/* サービス名とバッジ */}
          <div className="bg-orange-600 inline-block px-8 py-4 rounded-lg mb-8">
            <h2 className="text-2xl font-bold mb-4">プロタッチ外壁塗装</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                利用者満足度97%
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                </svg>
                提携業者数3,500社超
              </div>
            </div>
            <p className="text-sm mt-2 opacity-90">信頼と実績の外壁塗装マッチングサービス</p>
          </div>
        </div>

        {/* 3つの特徴 */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="flex items-center justify-center">
              <svg className="w-4 h-4 mr-2 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              透明な料金体系で安心
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="flex items-center justify-center">
              <svg className="w-4 h-4 mr-2 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              技術力の高い職人をご紹介
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5z" />
              </svg>
            </div>
            <p className="flex items-center justify-center">
              <svg className="w-4 h-4 mr-2 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              アフターフォローまで完全サポート
            </p>
          </div>
        </div>

        {/* 注記 */}
        <div className="text-center mb-8">
          <p className="text-sm opacity-80">※2024年度お客様満足度調査結果より</p>
        </div>

        {/* 診断フォームボックス */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
            <p className="text-orange-500 text-sm font-medium mb-2">無料診断はたった30秒！</p>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">今すぐ外壁の状態をチェック</h3>
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full text-lg w-full mb-4 transition-colors">
              無料診断を始める
            </button>
            <div className="flex items-center justify-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              初回診断完了でQUOカード2,000円分をプレゼント！
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;