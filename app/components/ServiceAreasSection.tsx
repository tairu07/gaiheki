const ServiceAreasSection = () => {
  const prefectures = [
    "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県", "茨城県",
    "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県", "新潟県", "富山県",
    "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県", "三重県",
    "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県", "鳥取県", "島根県",
    "岡山県", "広島県", "山口県", "徳島県", "香川県", "愛媛県", "高知県", "福岡県",
    "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"
  ];

  return (
    <section id="service-areas" className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* タイトル */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">全国対応エリア</h2>
          <p className="text-lg text-gray-600 mb-2">
            お住まいの地域に対応した信頼できる業者をご紹介
          </p>
          <p className="text-lg text-orange-500 font-semibold">
            <span className="text-orange-600">北海道から沖縄まで、全国47都道府県対応</span>
          </p>
        </div>

        {/* 都道府県グリッド */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
          {prefectures.map((prefecture, index) => (
            <button
              key={index}
              className="bg-gray-100 hover:bg-orange-50 hover:text-orange-600 text-gray-700 py-3 px-4 rounded-lg text-sm font-medium transition-colors border border-gray-200 hover:border-orange-200"
            >
              {prefecture}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceAreasSection;