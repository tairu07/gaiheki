const HowToUseSection = () => {
  const steps = [
    {
      number: "1",
      title: "無料診断フォームに入力",
      description: "お住まいの築年数、外壁の材質、気になる箇所などを簡単なフォームに入力いただきます。スマホからでも30秒で完了します。"
    },
    {
      number: "2", 
      title: "専門スタッフによる詳細ヒアリング",
      description: "外壁塗装の専門知識を持つスタッフが、お客様のご要望や予算について詳しくお聞きします。半数分程度でもお気軽にご相談ください。"
    },
    {
      number: "3",
      title: "最適な施工業者をマッチング", 
      description: "お客様のご希望に合わせて、厳選された優良業者の中から最適な施工店を2〜3社ご提案いたします。複数社の見積もり比較も可能です。"
    }
  ];

  return (
    <section className="bg-gray-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* タイトル */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">ご利用の手順</h2>
        </div>

        {/* ステップ */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              {/* ステップ番号 */}
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-bold text-orange-500">{step.number}</span>
                </div>
                {/* 矢印（最後のステップ以外） */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-1/2 transform translate-x-8 w-16 h-0.5 bg-gray-300"></div>
                )}
              </div>

              {/* コンテンツ */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowToUseSection;