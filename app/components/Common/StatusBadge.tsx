interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'small';
}

const statusColors: Record<string, string> = {
  // 診断ステータス
  DESIGNATED: 'bg-purple-100 text-purple-800',
  RECRUITING: 'bg-blue-100 text-blue-800',
  COMPARING: 'bg-yellow-100 text-yellow-800',
  DECIDED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-gray-100 text-gray-800',

  // 受注ステータス
  ORDERED: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
  COMPLETED: 'bg-green-100 text-green-800',
  REVIEW_COMPLETED: 'bg-purple-100 text-purple-800',

  // 問い合わせステータス
  PENDING: 'bg-yellow-100 text-yellow-800',

  // 申請ステータス
  UNDER_REVIEW: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',

  // 加盟店ステータス
  ACTIVE: 'bg-green-100 text-green-800',
  INACTIVE: 'bg-gray-100 text-gray-800',
};

const statusLabels: Record<string, string> = {
  // 診断ステータス
  DESIGNATED: '業者指定',
  RECRUITING: '見積もり募集中',
  COMPARING: '見積もり比較中',
  DECIDED: '業者決定',
  CANCELLED: 'キャンセル',

  // 受注ステータス
  ORDERED: '受注',
  IN_PROGRESS: '施工中',
  COMPLETED: '施工完了',
  REVIEW_COMPLETED: '評価完了',

  // 問い合わせステータス
  PENDING: '未対応',

  // 申請ステータス
  UNDER_REVIEW: '審査中',
  APPROVED: '承認',
  REJECTED: '却下',

  // 加盟店ステータス
  ACTIVE: '表示',
  INACTIVE: '非表示',
};

export function StatusBadge({ status, variant = 'default' }: StatusBadgeProps) {
  const colorClass = statusColors[status] || 'bg-gray-100 text-gray-800';
  const label = statusLabels[status] || status;
  const sizeClass = variant === 'small' ? 'px-2 py-0.5 text-xs' : 'px-2 py-1 text-sm';

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${sizeClass} ${colorClass}`}>
      {label}
    </span>
  );
}