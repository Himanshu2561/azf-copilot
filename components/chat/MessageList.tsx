'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useChatStore } from '@/store/chatStore';
import MessageBubble from './MessageBubble';
import HeroCard from './HeroCard';
import AdaptiveCard from './AdaptiveCard';
import ReceiptCard from './ReceiptCard';
import SuggestedActions from './SuggestedActions';
import EventCarousel from './EventCarousel';
import NewsCarousel from './NewsCarousel';
import CitationsDropdown from './CitationsDropdown';

export default function MessageList() {
  const messages = useChatStore((state) => state.messages);
  const isTyping = useChatStore((state) => state.isTyping);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6 space-y-2 min-h-0">
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center px-3 sm:px-4">
          <div 
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 p-4 sm:p-6"
            style={{ background: 'linear-gradient(180deg, #AE0775 0%, #023D82 100%)' }}
          >
            <Image
              src="/aspire_logo.png"
              alt="Aspire Logo"
              width={60}
              height={60}
              className="object-contain sm:w-20 sm:h-20"
            />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 px-2" style={{ color: '#111827' }}>
            Welcome to the Chat Assistant
          </h3>
          <p className="text-xs sm:text-sm max-w-md px-2" style={{ color: '#374151' }}>
            Start a conversation by typing a message below. I'm here to help you with any questions you might have.
          </p>
        </div>
      )}

      {messages.map((message) => (
        <div key={message.id}>
          <MessageBubble message={message} />
          
          {/* Render citations */}
          {message.secondaryOutput?.citations && message.secondaryOutput.citations.length > 0 && (
            <CitationsDropdown citations={message.secondaryOutput.citations} />
          )}
          
          {/* Render attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mb-4 ml-8 sm:ml-10">
              {message.attachments.map((attachment, index) => {
                // Handle hero cards
                if (attachment.contentType === 'application/vnd.microsoft.card.hero' && attachment.content) {
                  return (
                    <HeroCard key={index} content={attachment.content} />
                  );
                }
                // Handle adaptive cards
                if (attachment.contentType === 'application/vnd.microsoft.card.adaptive' && attachment.content) {
                  return (
                    <AdaptiveCard key={index} content={attachment.content} />
                  );
                }
                // Handle receipt cards
                if (attachment.contentType === 'application/vnd.microsoft.card.receipt' && attachment.content) {
                  return (
                    <ReceiptCard key={index} content={attachment.content} />
                  );
                }
                // Handle other attachments (images, PDFs, etc.)
                if (attachment.contentUrl) {
                  if (attachment.contentType?.startsWith('image/')) {
                    return (
                      <div key={index} className="my-2">
                        <Image
                          src={attachment.contentUrl}
                          alt={attachment.name || 'Attachment'}
                          width={400}
                          height={300}
                          className="rounded-lg object-cover max-w-full"
                          unoptimized
                        />
                      </div>
                    );
                  } else {
                    return (
                      <div key={index} className="my-2">
                        <a
                          href={attachment.contentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          {attachment.name || 'View Attachment'}
                        </a>
                      </div>
                    );
                  }
                }
                return null;
              })}
            </div>
          )}

          {/* Render secondary_output (events and news) */}
          {message.secondaryOutput && (
            <div className="mb-4 ml-8 sm:ml-10">
              {/* Render events */}
              {message.secondaryOutput.events && message.secondaryOutput.events.length > 0 && (
                <EventCarousel events={message.secondaryOutput.events} />
              )}

              {/* Render news */}
              {message.secondaryOutput.news && message.secondaryOutput.news.length > 0 && (
                <NewsCarousel news={message.secondaryOutput.news} />
              )}
            </div>
          )}

          {/* Render suggested actions */}
          {message.suggestedActions && message.suggestedActions.length > 0 && (
            <div className="mb-4 ml-8 sm:ml-10">
              <SuggestedActions actions={message.suggestedActions} />
            </div>
          )}
        </div>
      ))}

      {isTyping && (
        <div className="flex w-full justify-start mb-3 sm:mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex max-w-[85%] sm:max-w-[80%] md:max-w-[70%] flex-row items-end gap-1.5 sm:gap-2">
            {/* Bot Avatar */}
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

            {/* Loading Animation */}
            <div className="flex flex-col items-start min-w-0">
              <div className="bg-white rounded-2xl rounded-bl-sm px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-200">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ animationDelay: '0ms', backgroundColor: '#6B7280' }}></div>
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ animationDelay: '150ms', backgroundColor: '#6B7280' }}></div>
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ animationDelay: '300ms', backgroundColor: '#6B7280' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}

