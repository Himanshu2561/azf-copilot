'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  isUser?: boolean;
}

export default function MarkdownRenderer({ content, isUser = false }: MarkdownRendererProps) {
  const textColor = isUser ? 'text-white' : 'text-gray-900';
  const linkColor = isUser ? 'text-blue-200 hover:text-blue-100' : 'text-blue-600 hover:text-blue-700';
  const codeBg = isUser ? 'bg-blue-500/30' : 'bg-gray-100';
  const codeTextColor = isUser ? 'text-blue-100' : 'text-gray-800';
  const borderColor = isUser ? 'border-blue-400/30' : 'border-gray-300';
  const blockquoteBorder = isUser ? 'border-blue-300/50' : 'border-gray-300';
  const blockquoteBg = isUser ? 'bg-blue-500/10' : 'bg-gray-50';

  return (
    <div className={`markdown-content ${textColor} text-xs sm:text-sm leading-relaxed`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
        // Headings
        h1: ({ ...props }) => (
          <h1 className={`text-base sm:text-lg font-bold mt-3 mb-2 first:mt-0 ${textColor}`} {...props} />
        ),
        h2: ({ ...props }) => (
          <h2 className={`text-sm sm:text-base font-bold mt-3 mb-2 first:mt-0 ${textColor}`} {...props} />
        ),
        h3: ({ ...props }) => (
          <h3 className={`text-xs sm:text-sm font-semibold mt-2 mb-1.5 first:mt-0 ${textColor}`} {...props} />
        ),
        h4: ({ ...props }) => (
          <h4 className={`text-xs sm:text-sm font-semibold mt-2 mb-1.5 first:mt-0 ${textColor}`} {...props} />
        ),
        h5: ({ ...props }) => (
          <h5 className={`text-xs font-semibold mt-2 mb-1.5 first:mt-0 ${textColor}`} {...props} />
        ),
        h6: ({ ...props }) => (
          <h6 className={`text-xs font-semibold mt-2 mb-1.5 first:mt-0 ${textColor}`} {...props} />
        ),

        // Paragraphs
        p: ({ ...props }) => (
          <p className="mb-2 last:mb-0 wrap-break-word" {...props} />
        ),

        // Links
        a: ({ ...props }) => (
          <a
            className={`${linkColor} underline underline-offset-2 transition-colors`}
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          />
        ),

        // Lists
        ul: ({ ...props }) => (
          <ul className="list-disc list-inside mb-2 space-y-1 ml-2" {...props} />
        ),
        ol: ({ ...props }) => (
          <ol className="list-decimal list-inside mb-2 space-y-1 ml-2" {...props} />
        ),
        li: ({ ...props }) => (
          <li className="pl-1" {...props} />
        ),

        // Code blocks
        code: (props) => {
          const { className, children, ...rest } = props;
          const isInline = !className;
          if (isInline) {
            return (
              <code
                className={`${codeBg} ${codeTextColor} px-1.5 py-0.5 rounded text-[0.85em] font-mono`}
                {...rest}
              >
                {children}
              </code>
            );
          }
          return (
            <code
              className={`block ${codeBg} ${codeTextColor} p-2.5 rounded-md text-[0.85em] font-mono overflow-x-auto mb-2 ${borderColor} border`}
              {...rest}
            >
              {children}
            </code>
          );
        },
        pre: ({ ...props }) => (
          <pre className="mb-2 overflow-x-auto" {...props} />
        ),

        // Blockquotes
        blockquote: ({ ...props }) => (
          <blockquote
            className={`border-l-4 ${blockquoteBorder} ${blockquoteBg} pl-3 py-1.5 my-2 italic`}
            {...props}
          />
        ),

        // Horizontal rule
        hr: ({ ...props }) => (
          <hr className={`my-3 ${borderColor} border-t`} {...props} />
        ),

        // Tables (from remark-gfm)
        table: ({ ...props }) => (
          <div className="overflow-x-auto my-2">
            <table className={`min-w-full border-collapse ${borderColor} border rounded-md`} {...props} />
          </div>
        ),
        thead: ({ ...props }) => (
          <thead className={codeBg} {...props} />
        ),
        tbody: ({ ...props }) => (
          <tbody {...props} />
        ),
        tr: ({ ...props }) => (
          <tr className={`${borderColor} border-b`} {...props} />
        ),
        th: ({ ...props }) => (
          <th className={`px-3 py-2 text-left font-semibold ${textColor} ${borderColor} border-r last:border-r-0`} {...props} />
        ),
        td: ({ ...props }) => (
          <td className={`px-3 py-2 ${textColor} ${borderColor} border-r last:border-r-0`} {...props} />
        ),

        // Images
        img: (props) => {
          const { alt, ...rest } = props;
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="max-w-full h-auto rounded-md my-2"
              loading="lazy"
              alt={alt || ''}
              {...rest}
            />
          );
        },

        // Strong and emphasis
        strong: ({ ...props }) => (
          <strong className="font-semibold" {...props} />
        ),
        em: ({ ...props }) => (
          <em className="italic" {...props} />
        ),

        // Line breaks
        br: ({ ...props }) => <br {...props} />,
      }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

