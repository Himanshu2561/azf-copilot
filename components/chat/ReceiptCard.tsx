'use client';

import Image from 'next/image';
import type { ReceiptCardContent } from '@/lib/api/chat';

interface ReceiptCardProps {
  content: ReceiptCardContent;
}

export default function ReceiptCard({ content }: ReceiptCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm max-w-full sm:max-w-sm my-2">
      {content.title && (
        <div className="px-3 sm:px-4 pt-3 sm:pt-4 pb-2 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold" style={{ color: '#111827' }}>
            {content.title}
          </h3>
        </div>
      )}

      <div className="p-3 sm:p-4">
        {content.items && content.items.length > 0 && (
          <div className="space-y-4">
            {content.items.map((item, index) => (
              <div key={index} className="flex gap-2 sm:gap-3">
                {item.image && (
                  <div className="relative w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image.url}
                      alt={item.image.alt || item.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  {item.title && (
                    <h4 className="font-semibold text-xs sm:text-sm mb-1" style={{ color: '#111827' }}>
                      {item.title}
                    </h4>
                  )}
                  {item.subtitle && (
                    <p className="text-[10px] sm:text-xs mb-1" style={{ color: '#6B7280' }}>
                      {item.subtitle}
                    </p>
                  )}
                  {item.text && (
                    <p className="text-[10px] sm:text-xs" style={{ color: '#374151' }}>
                      {item.text}
                    </p>
                  )}
                  <div className="flex justify-between items-center mt-1">
                    {item.price && (
                      <span className="text-[10px] sm:text-xs font-medium" style={{ color: '#059669' }}>
                        {item.price}
                      </span>
                    )}
                    {item.quantity && (
                      <span className="text-[10px] sm:text-xs" style={{ color: '#6B7280' }}>
                        {item.quantity}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {content.total && (
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
            <p className="text-xs sm:text-sm font-semibold" style={{ color: '#111827' }}>
              {content.total}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

