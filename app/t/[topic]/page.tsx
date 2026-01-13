import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Topic, TopicData } from '@/types';
import TopicQuestionsList from '@/components/TopicQuestionsList';

async function getTopics(): Promise<Topic[]> {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    const filePath = path.join(process.cwd(), 'public', 'data', 'topics.json');
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error fetching topics:', error);
    return [];
  }
}

async function getTopicData(slug: string): Promise<TopicData | null> {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    const filePath = path.join(process.cwd(), 'public', 'data', `${slug}.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error fetching topic data for ${slug}:`, error);
    return null;
  }
}

export async function generateStaticParams() {
  const topics = await getTopics();
  return topics.map((topic) => ({
    topic: topic.slug,
  }));
}

export default async function TopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic: slug } = await params;
  const topicData = await getTopicData(slug);
  const topics = await getTopics();
  const topic = topics.find(t => t.slug === slug);

  if (!topicData || !topic) {
    notFound();
  }

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

  console.log(`Loaded ${topicData.questions.length} questions for topic: ${slug}`);

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
            {topic.name} Interview Questions
          </h1>
          <div className={`mt-2 h-1 w-20 ${borderMap[topic.color] || 'bg-blue-500'}`} />
        </div>

        <div className="pb-12">
          <TopicQuestionsList 
            questions={topicData.questions}
            topicName={topic.name}
            topicColor={topic.color}
          />
        </div>
      </div>
    </main>
  );
}