'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Topic, TopicData, Question } from '@/types';
import { Save, Plus, Trash2, Download, Eye, Edit2 } from 'lucide-react';
import { saveTopicData } from '@/app/actions';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import MarkdownToolbar from '@/components/MarkdownToolbar';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

export default function AdminPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [topicData, setTopicData] = useState<TopicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewModes, setPreviewModes] = useState<Record<string, boolean>>({});

  // Load topics on mount
  useEffect(() => {
    fetch('/data/topics.json')
      .then(res => res.json())
      .then(data => {
        setTopics(data);
        if (data.length > 0) {
          setSelectedTopic(data[0].slug);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load topics:', err);
        setLoading(false);
      });
  }, []);

  // Load topic data when selection changes
  useEffect(() => {
    if (!selectedTopic) return;

    setLoading(true);
    fetch(`/data/${selectedTopic}.json`)
      .then(res => res.json())
      .then(data => {
        setTopicData(data);
        setUnsavedChanges(false);
        setLoading(false);
      })
      .catch(err => {
        console.error(`Failed to load data for ${selectedTopic}:`, err);
        setLoading(false);
      });
  }, [selectedTopic]);

  const handleSave = async () => {
    if (!topicData || !selectedTopic) return;

    setSaving(true);
    try {
      const result = await saveTopicData(selectedTopic, topicData);
      if (result.success) {
        setUnsavedChanges(false);
        alert('Changes saved successfully!');
      } else {
        alert('Failed to save changes: ' + result.error);
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('An error occurred while saving changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = () => {
    if (!topicData) return;
    
    const dataStr = JSON.stringify(topicData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedTopic}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddQuestion = () => {
    if (!topicData) return;
    
    const newQuestion: Question = {
      id: Date.now().toString(),
      q: 'New Question',
      a: 'Answer here (Markdown supported)...',
      difficulty: 'Easy',
      tags: []
    };
    
    setTopicData({
      ...topicData,
      questions: [...topicData.questions, newQuestion]
    });
    setUnsavedChanges(true);
  };

  const handleDeleteQuestion = (id: string) => {
    if (!topicData) return;
    if (!confirm('Are you sure you want to delete this question?')) return;
    
    setTopicData({
      ...topicData,
      questions: topicData.questions.filter(q => q.id !== id)
    });
    setUnsavedChanges(true);
  };

  const handleUpdateQuestion = (id: string, field: keyof Question, value: any) => {
    if (!topicData) return;
    
    setTopicData({
      ...topicData,
      questions: topicData.questions.map(q => 
        q.id === id ? { ...q, [field]: value } : q
      )
    });
    setUnsavedChanges(true);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>, id: string) => {
    // Get HTML content from clipboard
    const html = e.clipboardData.getData('text/html');
    
    // If no HTML, let default behavior happen (plain text paste)
    if (!html) return;

    e.preventDefault();
    
    const turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
      hr: '---',
      bulletListMarker: '-',
      emDelimiter: '*'
    });

    // Custom rule to ensure code blocks are handled nicely
    turndownService.addRule('pre', {
      filter: ['pre'],
      replacement: function (content, node: any) {
        // Try to detect language from class
        const className = node.getAttribute('class') || '';
        const languageMatch = className.match(/language-(\w+)/);
        const language = languageMatch ? languageMatch[1] : '';
        
        return '\n\n```' + language + '\n' + node.textContent + '\n```\n\n';
      }
    });

    // Use GFM plugin for tables, strikethrough, etc.
    turndownService.use(gfm);

    const markdown = turndownService.turndown(html);
    
    // Insert at cursor position
    const textarea = e.currentTarget;
    const { selectionStart, selectionEnd, value } = textarea;
    
    const newValue = 
      value.substring(0, selectionStart) +
      markdown +
      value.substring(selectionEnd);
      
    handleUpdateQuestion(id, 'a', newValue);
    
    // Restore cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        selectionStart + markdown.length,
        selectionStart + markdown.length
      );
    }, 0);
  };

  const togglePreview = (id: string) => {
    setPreviewModes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (loading && !topicData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <div className="text-zinc-600 dark:text-zinc-400">Loading admin panel...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-900 pb-24">
      <div className="mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/"
              className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              ← Back to site
            </Link>
            <h1 className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              Admin Panel
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            >
              {topics.map(topic => (
                <option key={topic.slug} value={topic.slug}>{topic.name}</option>
              ))}
            </select>
            
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 rounded-lg bg-zinc-200 px-4 py-2 font-medium text-zinc-700 transition-colors hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              title="Download JSON backup"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Backup</span>
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {topicData?.questions.map((question, index) => (
            <div key={question.id} className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-800">
              <div className="mb-4 flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-sm font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
                  {index + 1}
                </span>
                <button
                  onClick={() => handleDeleteQuestion(question.id)}
                  className="rounded p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  title="Delete Question"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Question */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Question
                  </label>
                  <textarea
                    value={question.q}
                    onChange={(e) => handleUpdateQuestion(question.id, 'q', e.target.value)}
                    rows={3}
                    className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                  />
                </div>

                {/* Difficulty & Tags */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Difficulty
                    </label>
                    <select
                      value={question.difficulty}
                      onChange={(e) => handleUpdateQuestion(question.id, 'difficulty', e.target.value)}
                      className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={question.tags.join(', ')}
                      onChange={(e) => handleUpdateQuestion(question.id, 'tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                      className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                    />
                  </div>
                </div>

                {/* Answer */}
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Answer (Markdown supported)
                    </label>
                    <button
                      onClick={() => togglePreview(question.id)}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      {previewModes[question.id] ? (
                        <>
                          <Edit2 className="h-3 w-3" />
                          Edit
                        </>
                      ) : (
                        <>
                          <Eye className="h-3 w-3" />
                          Preview
                        </>
                      )}
                    </button>
                  </div>
                  
                  {previewModes[question.id] ? (
                    <div className="min-h-[200px] rounded-md border border-zinc-300 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
                      <MarkdownRenderer content={question.a} />
                    </div>
                  ) : (
                    <div className="group">
                      <MarkdownToolbar 
                        textareaId={`answer-${question.id}`} 
                        onUpdate={(val) => handleUpdateQuestion(question.id, 'a', val)} 
                      />
                      <textarea
                        id={`answer-${question.id}`}
                        value={question.a}
                        onChange={(e) => handleUpdateQuestion(question.id, 'a', e.target.value)}
                        onPaste={(e) => {
                          // Allow default paste behavior (text/plain)
                          // If we want to support HTML to Markdown conversion, we can add a button for it
                        }}
                        rows={12}
                        className="w-full rounded-b-md border border-t-0 border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 font-mono focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                        placeholder="Type your answer here. Markdown is supported."
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={handleAddQuestion}
            className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-zinc-300 py-8 text-zinc-600 transition-colors hover:border-zinc-400 hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <Plus className="h-5 w-5" />
            Add New Question
          </button>
        </div>
      </div>

      {/* Floating Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-zinc-200 bg-white/80 p-4 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/80">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            {unsavedChanges ? (
              <span className="text-amber-600 dark:text-amber-500">● Unsaved changes</span>
            ) : (
              <span className="text-green-600 dark:text-green-500">● All changes saved</span>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleAddQuestion}
              className="flex items-center gap-2 rounded-lg bg-zinc-100 px-4 py-2 font-medium text-zinc-900 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
            >
              <Plus className="h-4 w-4" />
              Add Question
            </button>
            
            <button
              onClick={handleSave}
              disabled={saving || !unsavedChanges}
              className={`flex items-center gap-2 rounded-lg px-6 py-2 font-medium text-white transition-colors shadow-lg ${
                unsavedChanges
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                  : 'bg-zinc-400 cursor-not-allowed dark:bg-zinc-700'
              }`}
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
