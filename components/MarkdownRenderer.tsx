'use client';

import ReactMarkdown from 'react-markdown';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

// Register languages
import ts from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import js from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown';

SyntaxHighlighter.registerLanguage('typescript', ts);
SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('markdown', markdown);

interface MarkdownRendererProps {
  content: string;
}

const CodeBlock = ({ language, children, ...props }: any) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(String(children));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group my-6 overflow-hidden rounded-xl bg-[#1e1e1e] border border-zinc-700/50 shadow-lg ring-1 ring-white/5">
      <div className="flex items-center justify-between bg-[#2d2d2d] px-4 py-2 text-xs text-zinc-400 border-b border-zinc-700/50">
        <span className="font-mono font-medium text-zinc-300">{language || 'text'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded px-2 py-1 hover:bg-zinc-700 hover:text-zinc-100 transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>
      <div className="relative">
        <SyntaxHighlighter
          {...props}
          style={oneDark}
          language={language}
          PreTag="div"
          customStyle={{
            margin: 0,
            padding: '1.25rem',
            background: 'transparent',
            fontSize: '0.9rem',
            lineHeight: '1.6',
            fontFamily: 'var(--font-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          }}
          wrapLongLines={true}
          showLineNumbers={false} 
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-zinc max-w-none dark:prose-invert prose-p:leading-relaxed prose-li:leading-relaxed prose-code:before:content-none prose-code:after:content-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          // Typography overrides for cleaner, more spacious look
          p({ children, className, ...props }) {
            return <div className={`mb-6 leading-7 text-zinc-800 dark:text-zinc-200 ${className || ''}`} {...props}>{children}</div>;
          },
          h1({ children, className, ...props }) {
            return <h1 className={`mt-10 mb-6 text-3xl font-bold text-zinc-900 dark:text-zinc-100 ${className || ''}`} {...props}>{children}</h1>;
          },
          h2({ children, className, ...props }) {
            return <h2 className={`mt-10 mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-800 pb-2 ${className || ''}`} {...props}>{children}</h2>;
          },
          h3({ children, className, ...props }) {
            return <h3 className={`mt-8 mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100 ${className || ''}`} {...props}>{children}</h3>;
          },
          ul({ children, className, ...props }) {
            return <ul className={`mb-6 list-disc pl-6 space-y-2 ${className || ''}`} {...props}>{children}</ul>;
          },
          ol({ children, className, ...props }) {
            return <ol className={`mb-6 list-decimal pl-6 space-y-2 ${className || ''}`} {...props}>{children}</ol>;
          },
          li({ children, className, ...props }) {
            return <li className={`leading-7 text-zinc-800 dark:text-zinc-200 ${className || ''}`} {...props}>{children}</li>;
          },
          blockquote({ children, className, ...props }) {
            return <blockquote className={`my-6 border-l-4 border-zinc-300 pl-4 italic text-zinc-600 dark:border-zinc-700 dark:text-zinc-400 ${className || ''}`} {...props}>{children}</blockquote>;
          },
          pre({ children }) {
            return <>{children}</>;
          },
          a({ children, className, href, ...props }) {
             return <a href={href} className={`text-blue-600 hover:underline dark:text-blue-400 ${className || ''}`} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
          },
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const content = String(children).replace(/\n$/, '');
            
            // Heuristic: If it's marked as a block (!inline) but has no language and is single line,
            // it's likely intended as inline code or a very short snippet that looks better inline.
            // However, we strictly respect 'inline=true' from react-markdown.
            const isCodeBlock = !inline && (!!match || content.includes('\n'));
            
            return isCodeBlock ? (
              <CodeBlock language={match ? match[1] : 'text'} children={children} {...props} />
            ) : (
              <code {...props} className={`${className || ''} rounded bg-zinc-100 px-1.5 py-0.5 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 font-mono text-sm border border-zinc-200 dark:border-zinc-700`}>
                {children}
              </code>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
