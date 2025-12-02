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
    <div className="mt-3 mb-2">
      <div
        style={{
          color: '#6A7282',
          fontSize: '12px',
          fontStyle: 'normal',
          fontWeight: 400,
          lineHeight: '16px',
          marginBottom: '8px'
        }}
      >
        Quick questions:
      </div>
      <div className="flex flex-wrap gap-2">
        {actions.map((action, index) => (
        <button
          key={index}
          onClick={() => handleActionClick(action.value)}
          disabled={isLoading}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
          style={{
            borderRadius: '33554400px',
            border: '1px solid rgba(174, 7, 117, 0.30)',
            background: '#FFF',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px -1px rgba(0, 0, 0, 0.10)',
            color: '#7A1959',
            textAlign: 'center',
            fontSize: '11px',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: '16px',
            minHeight: '36px'
          }}
        >
          {action.image && (
            <Image
              src={action.image}
              alt={action.title}
              width={14}
              height={14}
              className="object-contain sm:w-4 sm:h-4 shrink-0"
              unoptimized
            />
          )}
          <span className="whitespace-nowrap">{action.title}</span>
        </button>
        ))}
      </div>
    </div>
  );
}

