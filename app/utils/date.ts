export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return '今日 ' + date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    return '昨日 ' + date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays < 7) {
    return `${diffDays}日前`;
  } else {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }
}

export function formatDateShort(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('ja-JP', {
    month: 'short',
    day: 'numeric'
  });
}

export function formatDateTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}