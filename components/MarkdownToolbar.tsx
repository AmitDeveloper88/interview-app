'use client';

import { Bold, Italic, Code, Terminal, List, Link as LinkIcon, Heading } from 'lucide-react';

interface MarkdownToolbarProps {
  textareaId: string;
  onUpdate: (value: string) => void;
}

export default function MarkdownToolbar({ textareaId, onUpdate }: MarkdownToolbarProps) {
  const insertMarkdown = (start: string, end: string = '') => {
    const textarea = document.getElementById(textareaId) as HTMLTextAreaElement;
    if (!textarea) return;

    const { selectionStart, selectionEnd, value } = textarea;
    const selectedText = value.substring(selectionStart, selectionEnd);
    
    const newValue = 
      value.substring(0, selectionStart) +
      start + selectedText + end +
      value.substring(selectionEnd);
      
    onUpdate(newValue);
    
    // Restore focus and selection (adjusted for inserted text)
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        selectionStart + start.length,
        selectionEnd + start.length
      );
    }, 0);
  };

  return (
    <div className="flex items-center gap-1 rounded-t-md border-x border-t border-zinc-300 bg-zinc-50 p-2 dark:border-zinc-700 dark:bg-zinc-800">
      <button
        onClick={() => insertMarkdown('**', '**')}
        className="rounded p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400"
        title="Bold"
      >
        <Bold className="h-4 w-4" />
      </button>
      <button
        onClick={() => insertMarkdown('*', '*')}
        className="rounded p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400"
        title="Italic"
      >
        <Italic className="h-4 w-4" />
      </button>
      <div className="mx-1 h-4 w-px bg-zinc-300 dark:bg-zinc-600" />
      <button
        onClick={() => insertMarkdown('## ')}
        className="rounded p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400"
        title="Heading 2"
      >
        <Heading className="h-4 w-4" />
      </button>
      <button
        onClick={() => insertMarkdown('- ')}
        className="rounded p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400"
        title="List"
      >
        <List className="h-4 w-4" />
      </button>
      <div className="mx-1 h-4 w-px bg-zinc-300 dark:bg-zinc-600" />
      <button
        onClick={() => insertMarkdown('`', '`')}
        className="rounded p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400"
        title="Inline Code"
      >
        <Code className="h-4 w-4" />
      </button>
      <button
        onClick={() => insertMarkdown('```\n', '\n```')}
        className="rounded p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400"
        title="Code Block"
      >
        <Terminal className="h-4 w-4" />
      </button>
      <div className="mx-1 h-4 w-px bg-zinc-300 dark:bg-zinc-600" />
      <button
        onClick={() => insertMarkdown('[', '](url)')}
        className="rounded p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400"
        title="Link"
      >
        <LinkIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
