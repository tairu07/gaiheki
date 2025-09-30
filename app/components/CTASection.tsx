const CTASection = () => {
  return (
    <section className="bg-orange-500 text-white py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* メインタイトル */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
          外壁のお悩み、今すぐ解決しませんか？
        </h2>
        
        {/* サブテキスト */}
        <p className="text-lg md:text-xl mb-8 opacity-90">
          無料診断で最適な業者をご紹介。安心の施工で住まいを美しく保護します。
        </p>
        
        {/* ボタンエリア */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <button className="bg-white text-orange-500 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors text-lg">
            無料診断を始める
          </button>
          <button className="border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-orange-500 transition-colors text-lg">
            お電話で相談する
          </button>
        </div>
        
        {/* 営業時間情報 */}
        <div className="flex items-center justify-center text-sm opacity-80">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
          <span>受付時間：平日 9:00～18:00｜📧 メール相談は24時間受付</span>
        </div>
      </div>
    </section>
  );
};

export default CTASection;