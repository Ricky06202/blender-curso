import React, { useState, useEffect } from 'react';
import { getUserProgress, markChapterAsWatched, removeChapterProgress } from '../lib/api';

interface Chapter {
  id: number;
  slug: string;
  title: string;
}

interface ChapterProgressProps {
  chapters: Chapter[];
  currentChapterId: number;
}

export default function ChapterProgress({ chapters, currentChapterId }: ChapterProgressProps) {
  const [completedChapters, setCompletedChapters] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setError(null);
        
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        
        if (!token) {
          return;
        }
        
        const progress = await getUserProgress();
        setCompletedChapters(Array.isArray(progress) ? progress : []);
      } catch (error) {
        console.error('Failed to fetch user progress:', error);
        setError('Error loading progress');
        // Continue without progress data - chapters will still be visible
      }
    };

    fetchProgress();
  }, []);

  const markAsCompleted = async (chapterId: number) => {
    try {
      await markChapterAsWatched(chapterId);
      setCompletedChapters([...completedChapters, chapterId]);
    } catch (error) {
      console.error('Failed to mark chapter as completed:', error);
    }
  };

  const unmarkAsCompleted = async (chapterId: number) => {
    try {
      await removeChapterProgress(chapterId);
      setCompletedChapters(completedChapters.filter(id => id !== chapterId));
    } catch (error) {
      console.error('Failed to unmark chapter:', error);
    }
  };

  const isCompleted = (chapterId: number) => {
    return completedChapters.includes(chapterId);
  };

  // Validate chapters data
  if (!Array.isArray(chapters) || chapters.length === 0) {
    return (
      <nav>
        <ol className="m-0 pl-4 grid gap-1">
          <li className="text-slate-400 text-sm">No hay capítulos disponibles</li>
        </ol>
      </nav>
    );
  }

  return (
    <nav>
      <ol className="m-0 pl-4 grid gap-1">
        {chapters.map((c) => {
          // Validate chapter data
          if (!c || !c.id || !c.title || !c.slug) {
            return null; // Skip invalid chapters
          }

          return (
            <li key={c.id} data-chapter-id={c.id}>
              <div className="flex items-center gap-2">
                <a
                  className={`hover:underline flex-1 ${
                    c.id === currentChapterId ? 'font-semibold text-indigo-700' : 'text-slate-900'
                  }`}
                  href={`/capitulos/${c.slug}#top`}
                >
                  {c.title}
                </a>
                {c.id === currentChapterId && !isCompleted(c.id) && (
                  <button
                    onClick={() => markAsCompleted(c.id)}
                    className="text-xs px-2 py-1 rounded border border-slate-300 hover:bg-slate-50 transition"
                  >
                    Completar
                  </button>
                )}
                {c.id === currentChapterId && isCompleted(c.id) && (
                  <button
                    onClick={() => unmarkAsCompleted(c.id)}
                    className="text-xs px-2 py-1 rounded border border-green-300 text-green-600 hover:bg-green-50 transition"
                  >
                    Desmarcar
                  </button>
                )}
                {c.id !== currentChapterId && isCompleted(c.id) && (
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
