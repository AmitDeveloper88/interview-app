import Link from 'next/link';
import { Topic } from '@/types';
import { promises as fs } from 'fs';
import path from 'path';

async function getTopics(): Promise<Topic[]> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'topics.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const topics: Topic[] = JSON.parse(data);

    const topicsWithCounts = await Promise.all(topics.map(async (topic) => {
      try {
        const topicFilePath = path.join(process.cwd(), 'public', 'data', `${topic.slug}.json`);
        const topicDataContent = await fs.readFile(topicFilePath, 'utf-8');
        const topicData = JSON.parse(topicDataContent);
        return { ...topic, count: topicData.questions.length };
      } catch (error) {
        console.error(`Error fetching data for topic ${topic.slug}:`, error);
        return { ...topic, count: 0 };
      }
    }));

    return topicsWithCounts;
  } catch (error) {
    console.error('Error fetching topics:', error);
    return [];
  }
}

export default async function Home() {
  const topics = await getTopics();

  // Map colors to full Tailwind class strings to ensure they are not purged
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
  
  // Border colors for the top strip
  const borderMap: Record<string, string> = {
    sky: 'bg-sky-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    rose: 'bg-rose-500',
    indigo: 'bg-indigo-500',
    gray: 'bg-zinc-500',
    orange: 'bg-orange-500',
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            Interview Questions & Answers
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Practice technical interview questions by topic
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <Link
              key={topic.slug}
              href={`/t/${topic.slug}`}
              className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-zinc-800"
            >
              <div className={`absolute inset-x-0 top-0 h-2 ${borderMap[topic.color] || 'bg-blue-500'}`} />
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {topic.name}
                  </h3>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorMap[topic.color] || 'bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-300'}`}>
                    {topic.count} Questions
                  </span>
                </div>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Practice {topic.name} interview questions
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/search"
            className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Search All Questions
          </Link>
        </div>
      </div>
    </main>
  );
}