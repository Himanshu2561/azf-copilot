'use client';

import Image from 'next/image';
import type { EventItem } from '@/lib/api/chat';
import { format } from 'date-fns';

interface EventCardProps {
  event: EventItem;
}

export default function EventCard({ event }: EventCardProps) {
  const formatDate = (dateString: string) => {
    if (!dateString || !dateString.trim()) return null;
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return format(date, 'MMM dd, yyyy');
      }
    } catch (e) {
      // Invalid date
    }
    return null;
  };

  const formattedDate = formatDate(event.event_date);

  return (
    <a
      href={event.event_link}
      target="_blank"
      rel="noopener noreferrer"
      className="h-full bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow max-w-full sm:max-w-sm my-2 touch-manipulation flex flex-col"
    >
      {/* Image */}
      {event.event_image_url && (
        <div className="relative w-full h-40 sm:h-48 bg-gray-100">
          <Image
            src={event.event_image_url}
            alt={event.event_name}
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
          {event.is_upcoming && (
            <span className="px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded-full bg-green-100 text-green-800 shrink-0">
              Upcoming
            </span>
          )}
        </div>
        <h3 className="text-base sm:text-lg font-semibold mb-2" style={{ color: '#111827' }}>
          {event.event_name}
        </h3>
        {event.event_location && (
          <p className="text-[10px] sm:text-xs mb-2 flex items-center gap-1" style={{ color: '#6B7280' }}>
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{event.event_location}</span>
          </p>
        )}
        {event.event_summary && (
          <p className="text-xs sm:text-sm line-clamp-3 flex-1" style={{ color: '#374151' }}>
            {event.event_summary}
          </p>
        )}
      </div>
    </a>
  );
}

