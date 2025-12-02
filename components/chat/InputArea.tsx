'use client';

import { useState, KeyboardEvent, useRef, useEffect, ChangeEvent } from 'react';
import Image from 'next/image';
import { useChatStore } from '@/store/chatStore';

export default function InputArea() {
  const [input, setInput] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const isLoading = useChatStore((state) => state.isLoading);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if ((!trimmedInput && selectedFiles.length === 0) || isLoading) return;

    const messageText = trimmedInput || '';
    const filesToSend = [...selectedFiles];
    
    setInput('');
    setSelectedFiles([]);
    
    await sendMessage(messageText, filesToSend.length > 0 ? filesToSend : undefined);
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);
    // Reset input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  return (
    <div className="border-t border-gray-200 p-3 sm:p-4 shrink-0" style={{ background: '#FFFFFF' }}>
      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div className="max-w-4xl mx-auto mb-2 flex flex-wrap gap-2">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-100 rounded-lg text-xs sm:text-sm"
              style={{ color: '#374151' }}
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className="truncate max-w-[120px] sm:max-w-[200px]">{file.name}</span>
              <button
                onClick={() => removeFile(index)}
                className="shrink-0 p-0.5 hover:bg-gray-200 rounded transition-colors touch-manipulation"
                aria-label="Remove file"
                style={{ minWidth: '24px', minHeight: '24px' }}
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-1.5 sm:gap-2 max-w-4xl mx-auto">
        {/* Paperclip Icon */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors touch-manipulation"
          aria-label="Attach file"
          disabled={isLoading}
          style={{ minHeight: '40px', minWidth: '40px' }}
        >
          <Image
            src="/paper_clip.svg"
            alt="Attach"
            width={18}
            height={16}
            className="opacity-70 sm:w-[21px] sm:h-[19px]"
            style={{ filter: 'brightness(0) saturate(100%)' }}
          />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={isLoading}
        />

        <div className="flex-1 relative min-w-0 flex items-center">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={isLoading}
            rows={1}
            className="w-full px-3 py-2.5 sm:px-4 sm:py-3 pr-10 sm:pr-12 rounded-2xl border border-gray-300 bg-gray-50 focus:outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-gray-500 text-sm sm:text-base scrollbar-hide"
            style={{ 
              minHeight: '40px', 
              maxHeight: '120px',
              color: '#111827',
              fontSize: '14px'
            }}
          />
        </div>
        <button
          onClick={handleSend}
          disabled={(!input.trim() && selectedFiles.length === 0) || isLoading}
          className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full disabled:opacity-50 disabled:cursor-not-allowed text-white flex items-center justify-center transition-opacity shadow-sm touch-manipulation"
          style={{ background: 'linear-gradient(180deg, #AE0775 0%, #023D82 100%)', minHeight: '40px', minWidth: '40px' }}
          aria-label="Send message"
        >
          {isLoading ? (
            <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <Image
              src="/send_icon.svg"
              alt="Send"
              width={14}
              height={14}
              className="sm:w-4 sm:h-4"
            />
          )}
        </button>
      </div>
    </div>
  );
}

