'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useChatStore } from '@/store/chatStore';
import MessageList from './MessageList';
import InputArea from './InputArea';
import { chatApi } from '@/lib/api/chat';

export default function ChatContainer() {
  const error = useChatStore((state) => state.error);
  const setError = useChatStore((state) => state.setError);
  const initializeConversation = useChatStore((state) => state.initializeConversation);
  const isInitialized = useChatStore((state) => state.isInitialized);

  // Health check and initialize conversation on mount
  useEffect(() => {
    const initialize = async () => {
      // First check health
      try {
        await chatApi.checkHealth();
      } catch (err) {
        setError('Unable to connect to chat service. Please check if the API is running.');
        return;
      }

      // Then initialize conversation if not already initialized
      if (!isInitialized) {
        await initializeConversation();
      }
    };
    
    initialize();
  }, [setError, initializeConversation, isInitialized]);

  return (
    <div className="flex flex-col h-full w-full" style={{ background: '#F9FAFB', minHeight: 0 }}>
      {/* Header */}
      <div 
        className="px-3 sm:px-4 py-3 sm:py-4 shadow-sm shrink-0"
        style={{ background: 'linear-gradient(180deg, #AE0775 0%, #023D82 100%)' }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div 
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center overflow-hidden shrink-0"
              style={{ background: 'linear-gradient(180deg, #AE0775 0%, #7A1959 100%)' }}
            >
              <Image
                src="/aspire_logo.png"
                alt="Aspire Logo"
                width={20}
                height={20}
                className="object-contain sm:w-6 sm:h-6"
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-semibold text-white truncate">
                Aspire Zone
              </h1>
              <p className="text-xs text-white/80">
                Online
              </p>
            </div>
          </div>
          <button
            onClick={() => useChatStore.getState().clearChat()}
            className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-white/90 hover:text-white hover:bg-white/20 rounded-lg transition-colors shrink-0 touch-manipulation"
            style={{ minHeight: '36px' }}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Error Banner - Only show in development */}
      {error && process.env.NODE_ENV === 'development' && (
        <div className="border-b px-3 sm:px-4 py-2 sm:py-3 shrink-0" style={{ backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' }}>
          <div className="max-w-4xl mx-auto flex items-center gap-2 sm:gap-3">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#DC2626' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs sm:text-sm font-medium flex-1 min-w-0 wrap-break-word" style={{ color: '#991B1B' }}>
              {error}
            </p>
            <button
              onClick={() => setError(null)}
              className="shrink-0 p-1 rounded hover:bg-red-200 transition-colors touch-manipulation"
              aria-label="Dismiss error"
              style={{ minWidth: '32px', minHeight: '32px' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#DC2626' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <MessageList />

      {/* Input */}
      <InputArea />
    </div>
  );
}

