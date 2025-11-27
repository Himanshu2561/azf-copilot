'use client';

import Image from 'next/image';
import type { HeroCardContent } from '@/lib/api/chat';

interface HeroCardProps {
  content: HeroCardContent;
}

export default function HeroCard({ content }: HeroCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm max-w-full sm:max-w-sm my-2">
      {/* Image */}
      {content.images && content.images.length > 0 && (
        <div className="relative w-full h-40 sm:h-48 bg-gray-100">
          <Image
            src={content.images[0].url}
            alt={content.title || 'Card image'}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}

      {/* Content */}
      <div className="p-3 sm:p-4">
        {content.title && (
          <h3 className="text-base sm:text-lg font-semibold mb-1" style={{ color: '#111827' }}>
            {content.title}
          </h3>
        )}
        {content.subtitle && (
          <p className="text-xs sm:text-sm mb-2" style={{ color: '#4B5563' }}>
            {content.subtitle}
          </p>
        )}
        {content.text && (
          <p className="text-xs sm:text-sm mb-3" style={{ color: '#374151' }}>
            {content.text}
          </p>
        )}

        {/* Buttons */}
        {content.buttons && content.buttons.length > 0 && (
          <div className="flex flex-col gap-2 mt-3">
            {content.buttons.map((button, index) => {
              // Handle different button types
              const isExternalLink = button.type === 'openUrl';
              const isCall = button.type === 'call';
              const isEmail = button.value.startsWith('mailto:');
              
              return (
                <a
                  key={index}
                  href={button.value}
                  target={isExternalLink ? '_blank' : undefined}
                  rel={isExternalLink ? 'noopener noreferrer' : undefined}
                  className="text-center px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors touch-manipulation"
                  style={{ minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {button.title}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

