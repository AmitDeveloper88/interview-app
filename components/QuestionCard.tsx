'use client';

import { Question } from '@/types';
import CopyButton from '@/components/CopyButton';
import MarkdownRenderer from '@/components/MarkdownRenderer';

interface QuestionCardProps {
  question: Question;
  index: number;
}

export default function QuestionCard({ question, index }: QuestionCardProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-800">
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
          <span className="mr-2 text-zinc-400 dark:text-zinc-500">{index}.</span>
          {question.q}
        </h3>
      </div>
      <div className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-700">
        <MarkdownRenderer content={question.a} />
        
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {question.difficulty}
          </span>
          {question.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200"
            >
              {tag}
            </span>
          ))}
          <div className="ml-auto flex gap-2">
            <CopyButton text={question.a} />
          </div>
        </div>
      </div>
    </div>
  );
}
