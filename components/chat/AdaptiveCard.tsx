'use client';

import Image from 'next/image';
import type { AdaptiveCardContent } from '@/lib/api/chat';

interface AdaptiveCardProps {
  content: AdaptiveCardContent;
}

export default function AdaptiveCard({ content }: AdaptiveCardProps) {
  // Render adaptive card - simplified version
  // For full adaptive card support, consider using @microsoft/adaptivecards-react
  const renderBody = (body: any[]) => {
    return body.map((item, index) => {
      switch (item.type) {
        case 'TextBlock':
          return (
            <div
              key={index}
              className={`mb-2 ${
                item.weight === 'bolder' ? 'font-bold' : 'font-normal'
              } ${item.size === 'medium' ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}
              style={{ color: '#111827' }}
            >
              {item.text}
            </div>
          );
        case 'Image':
          return (
            <div key={index} className="relative w-full h-40 sm:h-48 bg-gray-100 rounded-lg overflow-hidden mb-2">
              <Image
                src={item.url}
                alt={item.alt || 'Card image'}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          );
        case 'ColumnSet':
          return (
            <div key={index} className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-2">
              {item.columns?.map((column: any, colIndex: number) => (
                <div key={colIndex} className="flex-1 min-w-0">
                  {renderBody(column.items || [])}
                </div>
              ))}
            </div>
          );
        default:
          return null;
      }
    });
  };

  const renderActions = (actions: any[]) => {
    return actions.map((action, index) => {
      if (action.type === 'Action.OpenUrl') {
        return (
          <a
            key={index}
            href={action.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors touch-manipulation text-center"
            style={{ minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {action.title}
          </a>
        );
      }
      return null;
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm max-w-full sm:max-w-sm my-2 p-3 sm:p-4">
      {content.body && renderBody(content.body)}
      {content.actions && content.actions.length > 0 && (
        <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-2">{renderActions(content.actions)}</div>
      )}
    </div>
  );
}

