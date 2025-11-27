'use client';

import Image from 'next/image';
import { Message } from '@/store/chatStore';
import { format } from 'date-fns';
import MarkdownRenderer from './MarkdownRenderer';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === 'user';

  return (
    <div
      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-3 sm:mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300`}
    >
      <div className={`flex max-w-[85%] sm:max-w-[80%] md:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-1.5 sm:gap-2`}>
        {/* Avatar */}
        {isUser ? (
          <div className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs sm:text-sm font-semibold">
            U
          </div>
        ) : (
          <div
            className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center overflow-hidden"
            style={{ background: 'linear-gradient(180deg, #AE0775 0%, #7A1959 100%)' }}
          >
            <Image
              src="/aspire_logo.png"
              alt="Aspire Logo"
              width={18}
              height={18}
              className="object-contain sm:w-5 sm:h-5"
            />
          </div>
        )}

        {/* Message Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} min-w-0`}>
          <div
            className={`rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5 shadow-sm ${
              isUser
                ? 'bg-blue-600 text-white rounded-br-sm'
                : 'bg-white rounded-bl-sm border border-gray-200'
            }`}
            style={!isUser ? { color: '#111827' } : undefined}
          >
            <MarkdownRenderer content={message.text} isUser={isUser} />
          </div>
          <span className="text-[10px] sm:text-xs mt-0.5 sm:mt-1 px-1" style={{ color: '#6B7280' }} suppressHydrationWarning>
            {format(message.timestamp, 'HH:mm')}
          </span>
        </div>
      </div>
    </div>
  );
}

