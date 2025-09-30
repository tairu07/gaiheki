"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const Header = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const getLinkClass = (path: string) => {
    const baseClass = "px-2 py-2 text-sm font-medium transition-colors";
    const activeClass = "text-orange-500 border-b-2 border-orange-500";
    const inactiveClass = "text-gray-700 hover:text-orange-500";

    return `${baseClass} ${isActive(path) ? activeClass : inactiveClass}`;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* ロゴ */}
          <div className="flex-shrink-0">
            <Link href="/">
              <h1 className="text-xl font-bold text-orange-500 cursor-pointer">外壁塗装の窓口</h1>
            </Link>
          </div>

          {/* ナビゲーションメニュー */}
          <nav className="hidden md:flex items-center space-x-6 whitespace-nowrap">
            <Link href="/#service-areas" className={getLinkClass('/#service-areas')}>
              施工店舗一覧
            </Link>
            <Link href="/columns" className={getLinkClass('/columns')}>
              外壁塗装コラム
            </Link>
            <Link href="/contact" className={getLinkClass('/contact')}>
              お問い合わせ
            </Link>
            <Link href="/partner-registration" className={getLinkClass('/partner-registration')}>
              加盟店様はこちら（登録）
            </Link>
            <div className="flex items-center space-x-2">
              <Link href="/auth/admin-login" className="text-gray-700 hover:text-orange-500 text-sm">
                管理者
              </Link>
              <span className="text-gray-400">/</span>
              <Link href="/auth/partner-login" className="text-gray-700 hover:text-orange-500 text-sm">
                加盟店様
              </Link>
            </div>
          </nav>

          {/* 電話番号と相談ボタン */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="text-right">
              <p className="text-xs text-gray-500">お電話でのご相談はこちら</p>
              <div className="flex items-center">
                <svg className="w-4 h-4 text-orange-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <a href="tel:0120-945-990" className="text-lg font-bold text-orange-500 hover:text-orange-600">
                  0120-945-990
                </a>
              </div>
            </div>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
              今すぐ相談する
            </button>
          </div>

          {/* モバイルメニューボタン */}
          <div className="md:hidden">
            <button className="text-gray-700 hover:text-orange-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;