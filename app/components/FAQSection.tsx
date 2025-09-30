"use client";

import { useState } from "react";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "外壁塗装の窓口って何？",
      answer: "外壁塗装の窓口は、全国の優良な外壁塗装業者と施工をお考えのお客様をマッチングするサービスです。厳しい審査基準をクリアした業者のみをご紹介し、お客様に最適な業者選びをサポートいたします。"
    },
    {
      question: "相談や、お見積りを依頼すると費用はかかるの？",
      answer: "ご相談、お見積りは完全無料です。外壁塗装の窓口へのご相談から業者のご紹介、お見積りまで一切費用はかかりません。安心してご利用ください。"
    },
    {
      question: "見積もりを依頼したら必ず契約しないといけないの？",
      answer: "いいえ、見積もりをご依頼いただいても契約の義務は一切ございません。複数社からお見積りを取って比較検討していただき、ご納得いただいた業者とご契約ください。"
    },
    {
      question: "見積もりを取得したけど断りたい。代わりに断ってもらえますか？",
      answer: "はい、お客様に代わって当社スタッフがお断りのご連絡をいたします。直接業者に断りづらい場合は、遠慮なくお申し付けください。"
    },
    {
      question: "外壁塗装以外の工事も依頼できる？",
      answer: "はい、屋根塗装、防水工事、雨樋工事など外壁塗装に関連する工事も承っております。詳しくはお気軽にご相談ください。"
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* タイトル */}
        <div className="mb-12">
          <div className="border-l-4 border-orange-500 pl-4 mb-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">よくある質問</h2>
          </div>
          <p className="text-lg text-gray-600">
            外壁塗装の窓口のよくある質問についてお答えします
          </p>
        </div>

        {/* FAQ リスト */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left bg-orange-50 hover:bg-orange-100 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center">
                  <span className="bg-orange-500 text-white text-sm font-bold px-2 py-1 rounded mr-4">
                    Q
                  </span>
                  <span className="font-medium text-gray-800">{faq.question}</span>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    openIndex === index ? "transform rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 bg-white border-t border-gray-100">
                  <div className="flex">
                    <span className="bg-gray-500 text-white text-sm font-bold px-2 py-1 rounded mr-4 flex-shrink-0">
                      A
                    </span>
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;