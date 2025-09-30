'use client';

import { useState, useTransition, useRef } from 'react';
import { X, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Type, Palette, Image, Save, Eye, Maximize2, Upload } from 'lucide-react';

interface ColumnEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  column?: {
    id?: number;
    title?: string;
    category?: string;
    content?: string;
    thumbnail?: string;
    status?: string;
  };
  onSave: (data: {
    id?: number;
    title: string;
    category: string;
    content: string;
    thumbnail: string;
    status: string;
  }) => void;
}

const categories = [
  '外壁塗装の基礎知識',
  '塗料の種類と特徴',
  '施工事例',
  'メンテナンス',
  '業者選びのポイント',
  '費用・見積もり',
  'トラブル対処法',
  '季節・天候',
];

export default function ColumnEditorModal({ isOpen, onClose, column, onSave }: ColumnEditorModalProps) {
  const [title, setTitle] = useState(column?.title || '');
  const [category, setCategory] = useState(column?.category || categories[0]);
  const [content, setContent] = useState(column?.content || '');
  const [status, setStatus] = useState(column?.status || '表示');
  const [thumbnail, setThumbnail] = useState(column?.thumbnail || '');
  const [isPending, startTransition] = useTransition();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSize, setFontSize] = useState('16');
  const [textColor, setTextColor] = useState('#000000');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    startTransition(async () => {
      try {
        const data = {
          title,
          category,
          content,
          status,
          thumbnail,
        };

        // APIコール
        const response = await fetch('/api/admin/columns', {
          method: column ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...data,
            id: column?.id,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to save column');
        }

        alert('コラムを保存しました');
        onSave(data);
        onClose();
      } catch (error) {
        console.error('Error saving column:', error);
        alert('コラムの保存に失敗しました');
      }
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ファイルサイズチェック (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('ファイルサイズは5MB以下にしてください');
      return;
    }

    // ファイルタイプチェック
    if (!file.type.startsWith('image/')) {
      alert('画像ファイルのみアップロード可能です');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/columns/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'アップロードに失敗しました');
      }

      const data = await response.json();
      setThumbnail(data.url);
      alert('画像をアップロードしました');
    } catch (error) {
      console.error('Upload error:', error);
      alert(error instanceof Error ? error.message : '画像のアップロードに失敗しました');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const applyTextFormat = (format: string) => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        break;
      default:
        formattedText = selectedText;
    }

    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);
  };

  const modalClass = isFullscreen
    ? 'fixed inset-0 z-50 bg-white'
    : 'fixed inset-0 z-50 overflow-y-auto';

  const containerClass = isFullscreen
    ? 'h-full flex flex-col'
    : 'flex items-center justify-center min-h-screen px-4';

  return (
    <div className={modalClass}>
      {!isFullscreen && <div className="fixed inset-0 bg-black bg-opacity-30" onClick={onClose} />}

      <div className={containerClass}>
        <div className={isFullscreen ? 'flex-1 flex flex-col' : 'relative bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto'}>
          {/* ヘッダー */}
          <div className="sticky top-0 bg-white border-b px-6 py-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {column ? 'コラム編集' : '新規コラム作成'}
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
                <button
                  onClick={onClose}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* エディタツールバー */}
          <div className="bg-gray-50 border-b px-6 py-3">
            <div className="flex items-center space-x-2">
              {/* テキスト装飾 */}
              <div className="flex items-center space-x-1 border-r pr-2">
                <button
                  onClick={() => applyTextFormat('bold')}
                  className="p-2 hover:bg-gray-200 rounded"
                  title="太字"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  onClick={() => applyTextFormat('italic')}
                  className="p-2 hover:bg-gray-200 rounded"
                  title="斜体"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  onClick={() => applyTextFormat('underline')}
                  className="p-2 hover:bg-gray-200 rounded"
                  title="下線"
                >
                  <Underline className="w-4 h-4" />
                </button>
              </div>

              {/* 配置 */}
              <div className="flex items-center space-x-1 border-r pr-2">
                <button className="p-2 hover:bg-gray-200 rounded" title="左寄せ">
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-gray-200 rounded" title="中央寄せ">
                  <AlignCenter className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-gray-200 rounded" title="右寄せ">
                  <AlignRight className="w-4 h-4" />
                </button>
              </div>

              {/* フォント設定 */}
              <div className="flex items-center space-x-2">
                <Type className="w-4 h-4 text-gray-600" />
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  className="px-2 py-1 border rounded text-sm"
                >
                  <option value="14">14px</option>
                  <option value="16">16px</option>
                  <option value="18">18px</option>
                  <option value="20">20px</option>
                  <option value="24">24px</option>
                </select>

                <Palette className="w-4 h-4 text-gray-600" />
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-8 h-8 border rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* コンテンツエリア */}
          <div className={isFullscreen ? 'flex-1 overflow-y-auto p-6' : 'p-6 space-y-4'}>
            {/* 基本情報 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  タイトル
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                  placeholder="コラムのタイトルを入力"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  カテゴリ
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* サムネイル */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                サムネイル画像
              </label>
              <div className="space-y-3">
                {/* プレビュー */}
                {thumbnail && (
                  <div className="relative w-full h-48 border border-gray-300 rounded-md overflow-hidden">
                    <img
                      src={thumbnail}
                      alt="サムネイルプレビュー"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setThumbnail('')}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* URL入力とアップロード */}
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                    placeholder="画像のURLを入力または下のボタンからアップロード"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-1"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{isUploading ? 'アップロード中...' : '画像をアップロード'}</span>
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  対応形式: JPEG, PNG, WebP (最大5MB)
                </p>
              </div>
            </div>

            {/* 本文エディタ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                本文
              </label>
              <textarea
                id="content-editor"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 min-h-[300px]"
                style={{ fontSize: `${fontSize}px`, color: textColor }}
                placeholder="コラムの本文を入力してください..."
              />
            </div>

            {/* ステータス */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                公開ステータス
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-32 px-3 py-2 border border-gray-300 rounded-md text-gray-900"
              >
                <option value="表示">表示</option>
                <option value="非表示">非表示</option>
              </select>
            </div>
          </div>

          {/* フッター */}
          <div className="sticky bottom-0 bg-white border-t px-6 py-4">
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center space-x-1"
              >
                <Eye className="w-4 h-4" />
                <span>プレビュー</span>
              </button>
              <button
                onClick={handleSave}
                disabled={isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-1"
              >
                <Save className="w-4 h-4" />
                <span>{isPending ? '保存中...' : '保存'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}