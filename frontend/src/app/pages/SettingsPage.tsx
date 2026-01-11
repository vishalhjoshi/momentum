import { useAuth } from '@/features/auth/context/AuthContext';
import { useUserQuery, useUpdatePreferencesMutation } from '@/features/auth/hooks/useAuthQueries';
import { ArrowLeft, Moon, Sun, Bell, Volume2, Clock, Smartphone, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Toggle } from '@/components/ui/Toggle';
import { useToast } from '@/components/ui/ToastProvider';

export default function SettingsPage() {
  const { logout } = useAuth();
  const { addToast } = useToast();

  // Fetch latest user data using the shared key
  const { data: userData, isLoading } = useUserQuery();
  
  const updatePreferencesMutation = useUpdatePreferencesMutation();

  const handleToggle = (key: string, currentValue: boolean) => {
    updatePreferencesMutation.mutate(
      { [key]: !currentValue },
      {
        onSuccess: () => addToast('Settings saved', 'success'),
        onError: () => addToast('Failed to save settings', 'error')
      }
    );
  };

  const handleTimeChange = (key: string, value: string) => {
     updatePreferencesMutation.mutate(
      { [key]: value },
      {
        onSuccess: () => addToast('Time updated', 'success')
      }
    );
  };

  if (isLoading) return <div className="p-8 text-center">Loading settings...</div>;

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8 flex items-center gap-4">
            <Link to="/" className="p-2 hover:bg-surface-hover rounded-full transition-colors">
                <ArrowLeft size={20} className="text-text-secondary" />
            </Link>
            <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        </header>

        <div className="space-y-6">
            {/* Appearance Section */}
            <section>
                <h2 className="text-sm uppercase tracking-wider text-text-secondary font-semibold mb-3 ml-1">Appearance</h2>
                <div className="bg-surface rounded-2xl p-1 shadow-sm overflow-hidden">
                    <div className="p-4 flex items-center justify-between border-b border-surface-hover/50 last:border-0 hover:bg-surface-hover/30 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                                {userData?.darkModeEnabled ? <Moon size={18} /> : <Sun size={18} />}
                            </div>
                            <div>
                                <h3 className="font-medium text-text-primary">Dark Mode</h3>
                                <p className="text-xs text-text-secondary">Easy on the eyes</p>
                            </div>
                        </div>
                        <Toggle 
                            checked={userData?.darkModeEnabled ?? false}
                            onChange={() => handleToggle('darkModeEnabled', userData?.darkModeEnabled ?? false)}
                        />
                    </div>
                </div>
            </section>

            {/* Notifications Section */}
            <section>
                <h2 className="text-sm uppercase tracking-wider text-text-secondary font-semibold mb-3 ml-1">Notifications & Sound</h2>
                <div className="bg-surface rounded-2xl p-1 shadow-sm overflow-hidden">
                    {/* Notifications Toggle */}
                    <div className="p-4 flex items-center justify-between border-b border-surface-hover/50 hover:bg-surface-hover/30 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                <Bell size={18} />
                            </div>
                            <div>
                                <h3 className="font-medium text-text-primary">Push Notifications</h3>
                                <p className="text-xs text-text-secondary">Reminders for tasks and journals</p>
                            </div>
                        </div>
                        <Toggle 
                            checked={userData?.notificationsEnabled ?? true}
                            onChange={() => handleToggle('notificationsEnabled', userData?.notificationsEnabled ?? true)}
                        />
                    </div>

                    {/* Sound Toggle */}
                    <div className="p-4 flex items-center justify-between border-b border-surface-hover/50 hover:bg-surface-hover/30 transition-colors">
                         <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-500/10 text-green-400">
                                <Volume2 size={18} />
                            </div>
                            <div>
                                <h3 className="font-medium text-text-primary">Sound Effects</h3>
                                <p className="text-xs text-text-secondary">Play sounds on completion</p>
                            </div>
                        </div>
                        <Toggle 
                            checked={userData?.soundEnabled ?? true}
                            onChange={() => handleToggle('soundEnabled', userData?.soundEnabled ?? true)}
                        />
                    </div>

                     {/* Haptic Toggle */}
                     <div className="p-4 flex items-center justify-between hover:bg-surface-hover/30 transition-colors">
                         <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                                <Smartphone size={18} />
                            </div>
                            <div>
                                <h3 className="font-medium text-text-primary">Haptic Feedback</h3>
                                <p className="text-xs text-text-secondary">Vibrate on interactions</p>
                            </div>
                        </div>
                        <Toggle 
                            checked={userData?.hapticEnabled ?? true}
                            onChange={() => handleToggle('hapticEnabled', userData?.hapticEnabled ?? true)}
                        />
                    </div>
                </div>
            </section>

             {/* Schedule Section */}
             <section>
                <h2 className="text-sm uppercase tracking-wider text-text-secondary font-semibold mb-3 ml-1">Schedule</h2>
                <div className="bg-surface rounded-2xl p-1 shadow-sm overflow-hidden">
                    <div className="p-4 flex items-center justify-between border-b border-surface-hover/50 hover:bg-surface-hover/30 transition-colors">
                         <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
                                <Clock size={18} />
                            </div>
                            <div>
                                <h3 className="font-medium text-text-primary">Daily Reminder</h3>
                                <p className="text-xs text-text-secondary">When to plan your day</p>
                            </div>
                        </div>
                        <input 
                            type="time" 
                            className="bg-background-elevated text-text-primary rounded-md border-none focus:ring-1 focus:ring-secondary text-sm p-1"
                            value={userData?.dailyReminderTime || '09:00'}
                            onChange={(e) => handleTimeChange('dailyReminderTime', e.target.value)}
                        />
                    </div>
                     <div className="p-4 flex items-center justify-between hover:bg-surface-hover/30 transition-colors">
                         <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                                <Moon size={18} />
                            </div>
                            <div>
                                <h3 className="font-medium text-text-primary">Evening Check-in</h3>
                                <p className="text-xs text-text-secondary">When to reflect on your day</p>
                            </div>
                        </div>
                        <input 
                            type="time" 
                            className="bg-background-elevated text-text-primary rounded-md border-none focus:ring-1 focus:ring-secondary text-sm p-1"
                            value={userData?.eveningCheckInTime || '18:00'}
                            onChange={(e) => handleTimeChange('eveningCheckInTime', e.target.value)}
                        />
                    </div>
                </div>
            </section>

            <section className="pt-2">
                <div className="bg-surface rounded-2xl p-1 shadow-sm overflow-hidden">
                    <button 
                        onClick={logout}
                        className="w-full p-4 flex items-center justify-between hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-left group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-red-500/10 text-red-500 group-hover:bg-red-500/20 transition-colors">
                                <LogOut size={18} />
                            </div>
                            <div>
                                <h3 className="font-medium text-red-500">Sign Out</h3>
                                <p className="text-xs text-red-500/70">Securely log out of your account</p>
                            </div>
                        </div>
                    </button>
                </div>
            </section>

             <div className="text-center text-xs text-text-secondary pt-8 pb-4">
                App Version 0.1.0 • Built with ❤️ for ADHD brains
             </div>
        </div>
      </div>
    </div>
  );
}
