'use client';

import { useState, useMemo, useEffect } from 'react';
import { Question } from '@/types';
import QuestionCard from './QuestionCard';
import { Search, ChevronLeft, ChevronRight, Filter, X } from 'lucide-react';

interface TopicQuestionsListProps {
  questions: Question[];
  topicName: string;
  topicColor: string;
}

const ITEMS_PER_PAGE = 100;

export default function TopicQuestionsList({ questions, topicName, topicColor }: TopicQuestionsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Extract unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    questions.forEach(q => q.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [questions]);

  // Filter questions
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const matchesSearch = 
        q.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
        q.a.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDifficulty = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
      
      const matchesTag = selectedTag === 'All' || q.tags.includes(selectedTag);

      return matchesSearch && matchesDifficulty && matchesTag;
    });
  }, [questions, searchQuery, selectedDifficulty, selectedTag]);

  // Pagination
  const totalPages = Math.ceil(filteredQuestions.length / ITEMS_PER_PAGE);
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedDifficulty, selectedTag]);

  // Pagination Controls Component
  const PaginationControls = () => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex items-center justify-center gap-2 py-4">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="rounded-md p-2 hover:bg-zinc-100 disabled:opacity-50 dark:hover:bg-zinc-800"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          Page {currentPage} of {totalPages}
        </span>
        
        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="rounded-md p-2 hover:bg-zinc-100 disabled:opacity-50 dark:hover:bg-zinc-800"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="sticky top-12 z-20 rounded-lg bg-white p-4 shadow-md dark:bg-zinc-800">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder={`Search in ${topicName}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-zinc-200 bg-zinc-50 py-2 pl-10 pr-10 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="flex gap-2">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="max-w-[150px] rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            >
              <option value="All">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Results Count and Top Pagination */}
        <div className="mt-2 flex flex-col items-center justify-between gap-2 sm:flex-row">
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            Showing {paginatedQuestions.length} of {filteredQuestions.length} questions
            {questions.length !== filteredQuestions.length && ` (filtered from ${questions.length})`}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-md p-1 hover:bg-zinc-100 disabled:opacity-50 dark:hover:bg-zinc-700"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded-md p-1 hover:bg-zinc-100 disabled:opacity-50 dark:hover:bg-zinc-700"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {paginatedQuestions.length > 0 ? (
          paginatedQuestions.map((question, index) => (
            <QuestionCard 
              key={question.id} 
              question={question} 
              index={(currentPage - 1) * ITEMS_PER_PAGE + index + 1} 
            />
          ))
        ) : (
          <div className="rounded-lg bg-zinc-50 p-8 text-center text-zinc-500 dark:bg-zinc-800/50">
            No questions found matching your criteria.
          </div>
        )}
      </div>

      {/* Bottom Pagination Controls */}
      <PaginationControls />
    </div>
  );
}
