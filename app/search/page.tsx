'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Topic, Question } from '@/types';
import ScrollToTop from '@/components/ScrollToTop';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 100;

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Array<{ topic: Topic; question: Question }>>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const colorMap: Record<string, string> = {
    sky: 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200',
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    rose: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
    indigo: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    gray: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-300',
    orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  };

  useEffect(() => {
    async function loadAll() {
      try {
        const topicsRes = await fetch('/data/topics.json');
        const topicsData: Topic[] = await topicsRes.json();
        setTopics(topicsData);

        const allResults: Array<{ topic: Topic; question: Question }> = [];
        
        for (const topic of topicsData) {
          const topicRes = await fetch(`/data/${topic.slug}.json`);
          const topicData = await topicRes.json();
          
          for (const question of topicData.questions) {
            allResults.push({ topic, question });
          }
        }
        
        setResults(allResults);
      } catch (error) {
        console.error('Failed to load questions:', error);
      } finally {
        setLoading(false);
      }
    }

    loadAll();
  }, []);

  const filteredResults = useMemo(() => {
    return results.filter(({ topic, question }) => {
      const searchTerm = query.toLowerCase();
      return (
        question.q.toLowerCase().includes(searchTerm) ||
        question.a.toLowerCase().includes(searchTerm) ||
        question.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        topic.name.toLowerCase().includes(searchTerm)
      );
    });
  }, [results, query]);

  const totalPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE);
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="sticky top-0 z-30 mb-2 bg-zinc-50/95 py-4 backdrop-blur transition-all dark:bg-zinc-900/95 border-b border-zinc-200 dark:border-zinc-800">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            ← Back to topics
          </Link>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Search Questions
          </h1>
        </div>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Search questions, answers, or tags..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-400"
          />
        </div>

        {loading ? (
          <div className="text-center text-zinc-600 dark:text-zinc-400">Loading questions...</div>
        ) : filteredResults.length === 0 && query ? (
          <div className="text-center text-zinc-600 dark:text-zinc-400">No questions found for "{query}"</div>
        ) : (
          <div className="space-y-4">
            {paginatedResults.map(({ topic, question }, index) => (
              <div key={`${topic.slug}-${question.id}`} className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-800">
                <div className="flex items-center justify-between mb-2">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorMap[topic.color] || 'bg-zinc-100 text-zinc-800'}`}>
                    {topic.name}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {question.difficulty}
                  </span>
                </div>
                <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50 mb-2">
                  <span className="mr-2 text-zinc-400 dark:text-zinc-500">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}.</span>
                  {question.q}
                </h3>
                <p className="text-zinc-700 dark:text-zinc-300 mb-4">{question.a}</p>
                <div className="flex flex-wrap gap-2">
                  {question.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
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
            )}
          </div>
        )}
      </div>
    </main>
  );
}