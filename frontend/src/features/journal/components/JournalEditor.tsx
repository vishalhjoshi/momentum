
import { useState, useEffect, useRef } from 'react';
import { useSaveJournalMutation, useDeleteJournalMutation } from '../hooks/useJournalQueries';
import { Mood } from '../types';
import { MoodSelector } from './MoodSelector';
import { useToast } from '@/components/ui/ToastProvider';
import { JOURNAL_PROMPTS } from '../data/prompts';
import { Trash2, Lightbulb } from 'lucide-react';
import { Slider } from '@/components/ui/slider-number-flow';

interface JournalEditorProps {
  initialContent?: string;
  initialMood?: Mood | null;
  initialEnergy?: number | null;
  date: string;
}

export function JournalEditor({ initialContent = '', initialMood, initialEnergy, date }: JournalEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [mood, setMood] = useState<Mood | undefined>(initialMood || undefined);
  const [energy, setEnergy] = useState(initialEnergy || 5);
  const [isSaving, setIsSaving] = useState(false);
  
  // Ref to track if it's the first render to avoid auto-saving on mount
  const isFirstRender = useRef(true);
  const { mutateAsync: saveEntry } = useSaveJournalMutation();
  const { mutateAsync: deleteEntry } = useDeleteJournalMutation();
  const { addToast } = useToast();

  const handleGetPrompt = () => {
    const randomPrompt = JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)];
    const newContent = content ? `${content}\n\n${randomPrompt}\n` : `${randomPrompt}\n`;
    setContent(newContent);
  };

  const handleDelete = async () => {
    if (!content && !mood) return; // Nothing to delete really, or maybe just clear
    
    if (window.confirm('Are you sure you want to delete this entry? This cannot be undone.')) {
      try {
        await deleteEntry(date);
        setContent('');
        setMood(undefined);
        setEnergy(5);
        addToast('Journal entry deleted', 'success');
      } catch (error) {
        addToast('Failed to delete entry', 'error');
      }
    }
  };

  // Handle auto-save for content
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(async () => {
      // Only save if there is content or mood
       if (!content && !mood) return;
       
      setIsSaving(true);
      try {
        await saveEntry({ content, mood, energy, date });
        // Don't toast on every auto-save, it's annoying. Maybe a small indicator.
      } catch (error) {
        addToast('Failed to save journal', 'error');
      } finally {
        setIsSaving(false);
      }
    }, 1000); // Debounce 1s

    return () => clearTimeout(timer);
  }, [content, mood, energy, date, saveEntry, addToast]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-text-primary">How are you feeling?</label>
        <MoodSelector value={mood} onChange={setMood} />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
           <label className="text-sm font-medium text-text-primary">Energy Level</label>
           {/* <span className="text-sm text-text-secondary">{energy}/10</span> */}
        </div>
        <Slider 
            value={[energy]}
            onValueChange={(values: number[]) => setEnergy(values[0])}
            min={1}
            max={10}
            step={1}
            aria-label="Energy Level"
        />
      </div>

      <div className="space-y-2">
         <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-text-primary">Daily Reflection</label>
            <div className="flex items-center gap-2">
                 {isSaving && <span className="text-xs text-text-secondary animate-pulse">Saving...</span>}
                 <button
                    onClick={handleGetPrompt}
                    className="p-1.5 text-text-secondary hover:text-primary-500 hover:bg-surface-hover rounded-md transition-colors"
                    title="Get a writing prompt"
                 >
                    <Lightbulb size={16} />
                 </button>
                 {(content || mood) && (
                     <button
                        onClick={handleDelete}
                        className="p-1.5 text-text-secondary hover:text-red-500 hover:bg-surface-hover rounded-md transition-colors"
                        title="Delete entry"
                     >
                        <Trash2 size={16} />
                     </button>
                 )}
            </div>
         </div>
         <textarea
            className="w-full h-64 p-3 bg-surface text-text-primary border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none transition-shadow"
            placeholder="Write your thoughts here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
         />
      </div>
    </div>
  );
}
