'use client';

import Image from 'next/image';
import type { SuggestedAction } from '@/lib/api/chat';
import { useChatStore } from '@/store/chatStore';

interface SuggestedActionsProps {
  actions: SuggestedAction[];
}

export default function SuggestedActions({ actions }: SuggestedActionsProps) {
  const sendMessage = useChatStore((state) => state.sendMessage);
  const isLoading = useChatStore((state) => state.isLoading);

  const handleActionClick = async (value: string) => {
    if (isLoading) return;
    await sendMessage(value);
  };

  if (!actions || actions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-3 mb-2">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={() => handleActionClick(action.value)}
          disabled={isLoading}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-xs sm:text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 touch-manipulation"
          style={{ color: '#1F2937', minHeight: '36px' }}
        >
          {action.image && (
            <Image
              src={action.image}
              alt={action.title}
              width={14}
              height={14}
              className="object-contain sm:w-4 sm:h-4 flex-shrink-0"
              unoptimized
            />
          )}
          <span className="whitespace-nowrap">{action.title}</span>
        </button>
      ))}
    </div>
  );
}

