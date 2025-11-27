'use client';

import type { EventItem } from '@/lib/api/chat';
import EventCard from './EventCard';
import Carousel from './Carousel';

interface EventCarouselProps {
  events: EventItem[];
}

export default function EventCarousel({ events }: EventCarouselProps) {
  if (!events || events.length === 0) return null;

  return (
    <div className="mb-4">
      <Carousel>
        {events.map((event, index) => (
          <EventCard key={index} event={event} />
        ))}
      </Carousel>
    </div>
  );
}

