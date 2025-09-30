const AboutServiceSection = () => {
  return (
    <section className="bg-orange-600 text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* タイトル */}
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-wide mb-2 opacity-90">About Service</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">外壁塗装の窓口について</h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg mb-2">全国3,500社以上の厳選された建築専門業者とパートナーシップを構築し、</p>
            <p className="text-lg">完全中立の立場からお客様の条件に最適な施工会社を無料でご紹介する専門サービスです。</p>
          </div>
        </div>

        {/* 3つのカード */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* お客様カード */}
          <div className="bg-white bg-opacity-90 text-gray-800 rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">お客様</h3>
            <p className="text-sm mb-2">外壁の悩みを相談したい</p>
            <p className="text-sm">適切な見積もりを比較したい</p>
          </div>

          {/* 外壁塗装の窓口カード */}
          <div className="bg-white bg-opacity-90 text-gray-800 rounded-lg p-6 text-center relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-700 text-white text-xs px-3 py-1 rounded-full">
              外壁塗装の窓口
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 mt-4">
              <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                専門アドバイザーによる無料相談
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                厳選された優良業者のみご紹介
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                最大3社まで一括見積もり対応
              </div>
            </div>
          </div>

          {/* 認定パートナー業者カード */}
          <div className="bg-white bg-opacity-90 text-gray-800 rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">認定パートナー業者</h3>
          </div>
        </div>

        {/* 底部のメッセージ */}
        <div className="text-center">
          <p className="text-lg opacity-90">
            品質重視の外壁塗装を、透明性のある適正価格でお届けします
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutServiceSection;