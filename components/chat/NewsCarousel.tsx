'use client';

import type { NewsItem } from '@/lib/api/chat';
import NewsCard from './NewsCard';
import Carousel from './Carousel';

interface NewsCarouselProps {
  news: NewsItem[];
}

export default function NewsCarousel({ news }: NewsCarouselProps) {
  if (!news || news.length === 0) return null;

  return (
    <div className="mb-4">
      <Carousel>
        {news.map((newsItem, index) => (
          <NewsCard key={index} news={newsItem} />
        ))}
      </Carousel>
    </div>
  );
}

