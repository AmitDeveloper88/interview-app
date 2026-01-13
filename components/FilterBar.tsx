'use client';

interface FilterBarProps {
  difficulties: string[];
  selectedDifficulty: string;
  onDifficultyChange: (difficulty: string) => void;
  tags: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export default function FilterBar({
  difficulties,
  selectedDifficulty,
  onDifficultyChange,
  tags,
  selectedTags,
  onTagsChange,
}: FilterBarProps) {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-2">Difficulty</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onDifficultyChange('')}
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              selectedDifficulty === ''
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600'
            }`}
          >
            All
          </button>
          {difficulties.map((difficulty) => (
            <button
              key={difficulty}
              onClick={() => onDifficultyChange(difficulty)}
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                selectedDifficulty === difficulty
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600'
              }`}
            >
              {difficulty}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-2">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                selectedTags.includes(tag)
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}