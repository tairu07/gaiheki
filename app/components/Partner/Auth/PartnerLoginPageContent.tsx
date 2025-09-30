"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const PartnerLoginPageContent = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // デモ用ログイン認証
    if (loginData.email === "partner@example.com" && loginData.password === "partner123") {
      // 加盟店ダッシュボードへリダイレクト
      router.push("/partner-dashboard");
    } else {
      alert("ログイン情報が正しくありません。\nデモ用ログイン情報:\nメール: partner@example.com\nパスワード: partner123");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* ビルアイコン */}
          <div className="flex justify-center mb-6">
            <svg className="w-16 h-16 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">加盟店ログイン</h1>
          <p className="text-gray-600">登録済みのメールアドレスとパスワードでログインしてください</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* メールアドレス */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                メールアドレス
              </label>
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleInputChange}
                placeholder="例: company@example.com"
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>

            {/* パスワード */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                パスワード
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={loginData.password}
                  onChange={handleInputChange}
                  placeholder="パスワードを入力"
                  className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464a11.996 11.996 0 00-5.641 3.047m4.969-4.969l1.414-1.414a11.996 11.996 0 005.641 3.047M15.12 9.12l4.242 4.242" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* ログインボタン */}
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-md transition-colors"
            >
              ログイン
            </button>

            {/* または */}
            <div className="text-center">
              <p className="text-gray-500">または</p>
            </div>

            {/* トップページに戻る */}
            <Link
              href="/"
              className="w-full block text-center bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-4 rounded-md transition-colors"
            >
              トップページに戻る
            </Link>
          </form>

          {/* デモ用ログイン情報（隠しエリア） */}
          <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-md">
            <h3 className="font-medium text-orange-800 mb-2">デモ用ログイン情報:</h3>
            <p className="text-sm text-orange-700">メール: partner@example.com</p>
            <p className="text-sm text-orange-700">パスワード: partner123</p>
            <button
              type="button"
              onClick={() => setLoginData({ email: "partner@example.com", password: "partner123" })}
              className="text-xs text-orange-600 hover:text-orange-800 underline mt-1"
            >
              デモ情報を入力
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerLoginPageContent;