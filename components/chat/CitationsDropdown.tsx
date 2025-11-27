'use client';

import { useState } from 'react';
import { Citation } from '@/lib/api/chat';

interface CitationsDropdownProps {
  citations: Citation[];
}

export default function CitationsDropdown({ citations }: CitationsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!citations || citations.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 ml-8 sm:ml-10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-500 hover:text-gray-700 transition-colors"
        aria-label="Toggle citations"
        aria-expanded={isOpen}
      >
        <span className="font-medium">
          {citations.length} {citations.length === 1 ? 'Reference' : 'References'}
        </span>
        <svg
          className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="mt-2 space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
          {citations.map((citation, index) => (
            <a
              key={index}
              href={citation.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-2.5 py-1.5 text-[10px] sm:text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors border border-gray-200"
            >
              <div className="flex items-start gap-2">
                <span className="text-gray-400 font-medium shrink-0">{index + 1}.</span>
                <span className="line-clamp-2">{citation.title}</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

