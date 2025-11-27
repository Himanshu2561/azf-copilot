'use client';

import Image from 'next/image';
import type { NewsItem } from '@/lib/api/chat';
import { format } from 'date-fns';

interface NewsCardProps {
  news: NewsItem;
}

export default function NewsCard({ news }: NewsCardProps) {
  const formatDate = (dateString: string) => {
    if (!dateString || !dateString.trim()) return null;
    try {
      // Try parsing the date - handles both "YYYY-MM-DD" and "DD MMM YYYY" formats
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return format(date, 'MMM dd, yyyy');
      }
    } catch (e) {
      // Invalid date - return original string if it looks like a formatted date
      if (dateString.match(/\d{1,2}\s+\w{3}\s+\d{4}/)) {
        return dateString;
      }
    }
    return null;
  };

  const formattedDate = formatDate(news.news_date);

  return (
    <a
      href={news.news_link}
      target="_blank"
      rel="noopener noreferrer"
      className="h-full bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow max-w-full sm:max-w-sm my-2 touch-manipulation flex flex-col"
    >
      {/* Image */}
      {news.news_image_url && (
        <div className="relative w-full h-40 sm:h-48 bg-gray-100">
          <Image
            src={news.news_image_url}
            alt={news.news_name}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}

      {/* Content */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2 gap-2">
          {formattedDate && (
            <p className="text-[10px] sm:text-xs" style={{ color: '#6B7280' }}>
              {formattedDate}
            </p>
          )}
          {news.news_category && (
            <span className="px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded-full bg-blue-100 text-blue-800 flex-shrink-0">
              {news.news_category}
            </span>
          )}
        </div>
        <h3 className="text-base sm:text-lg font-semibold mb-2" style={{ color: '#111827' }}>
          {news.news_name}
        </h3>
        {news.news_summary && (
          <p className="text-xs sm:text-sm line-clamp-3 flex-1" style={{ color: '#374151' }}>
            {news.news_summary}
          </p>
        )}
      </div>
    </a>
  );
}

