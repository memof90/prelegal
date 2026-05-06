'use client';

import { forwardRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { NdaFormData } from '@/types/nda';
import { renderNda } from '@/lib/nda-renderer';

interface NdaPreviewProps {
  data: NdaFormData;
}

export const NdaPreview = forwardRef<HTMLDivElement, NdaPreviewProps>(function NdaPreview({ data }, ref) {
  const { coverPageHtml, standardTermsMarkdown } = renderNda(data);

  return (
    <div ref={ref} className="bg-white rounded-lg shadow-sm border">
      {/* Preview badge */}
      <div className="no-print flex items-center justify-between px-6 py-3 border-b bg-gray-50 rounded-t-lg">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Preview</span>
        <span className="text-xs text-gray-400">Mutual Non-Disclosure Agreement</span>
      </div>

      <div className="preview-content px-8 py-8 text-sm text-gray-900 font-serif">
        {/* Cover page rendered as HTML */}
        <div dangerouslySetInnerHTML={{ __html: coverPageHtml }} />

        {/* Page break visual separator */}
        <div className="my-8 border-t-2 border-dashed border-gray-300 relative">
          <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-white px-3 text-xs text-gray-400 no-print">
            — Standard Terms —
          </span>
        </div>

        {/* Standard terms rendered via react-markdown, with inline HTML enabled */}
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              // Render raw HTML for our highlight spans
              p: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
              h1: ({ children }) => <h1 className="text-xl font-bold mb-4">{children}</h1>,
              ol: ({ children }) => <ol className="list-decimal pl-5 space-y-3 mb-4">{children}</ol>,
              li: ({ children }) => <li className="leading-relaxed">{children}</li>,
              strong: ({ children }) => <strong className="font-bold">{children}</strong>,
              a: ({ href, children }) => (
                <a href={href} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              ),
            }}
          >
            {standardTermsMarkdown}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
});
