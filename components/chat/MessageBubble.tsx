'use client';

import Image from 'next/image';
import { Message } from '@/store/chatStore';
import { format } from 'date-fns';
import MarkdownRenderer from './MarkdownRenderer';
import FeedbackButtons from './FeedbackButtons';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === 'user';
  const showFeedback = !isUser && message.activityId;

  return (
    <div
      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-3 sm:mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300`}
    >
      <div className={`flex max-w-[85%] sm:max-w-[80%] md:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'} ${isUser ? 'items-end' : 'items-start'} gap-1.5 sm:gap-2 min-w-0`}>
        {/* Avatar - Only show for bot messages */}
        {!isUser && (
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
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} min-w-0 flex-1`}>
          <div
            className={`px-3 py-2 sm:px-4 sm:py-2.5 wrap-break-word overflow-hidden ${isUser
                ? 'rounded-br-sm'
                : 'rounded-bl-sm'
              }`}
            style={{
              borderRadius: '16px',
              background: '#FFF',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px -1px rgba(0, 0, 0, 0.10)',
              color: '#111827',
              wordWrap: 'break-word',
              overflowWrap: 'anywhere'
            }}
          >
            <MarkdownRenderer content={message.text} isUser={isUser} />
            <span className="text-[10px] sm:text-xs mt-1.5 sm:mt-2 block" style={{ color: '#6B7280' }} suppressHydrationWarning>
              {format(message.timestamp, 'HH:mm')}
            </span>
          </div>

          {/* Feedback buttons for bot messages */}
          {showFeedback && (
            <FeedbackButtons
              messageId={message.id}
              feedbackState={message.feedbackState}
            />
          )}
        </div>
      </div>
    </div>
  );
}

