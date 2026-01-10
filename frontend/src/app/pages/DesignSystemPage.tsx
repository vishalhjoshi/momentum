
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/ToastProvider';
import { useTheme } from '@/components/ui/ThemeProvider';
import { Toggle } from '@/components/ui/Toggle';

export default function DesignSystemPage() {
  const { theme, setTheme } = useTheme();
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary p-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Design System Showcase</h1>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setTheme('light')} className={theme === 'light' ? 'bg-neutral-200 dark:bg-neutral-700' : ''}>Light</Button>
            <Button variant="ghost" onClick={() => setTheme('dark')} className={theme === 'dark' ? 'bg-neutral-200 dark:bg-neutral-700' : ''}>Dark</Button>
            <Button variant="ghost" onClick={() => setTheme('system')} className={theme === 'system' ? 'bg-neutral-200 dark:bg-neutral-700' : ''}>System</Button>
          </div>
        </div>

        {/* Buttons */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border-color pb-2">Buttons</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="primary" isLoading>Loading</Button>
            <Button variant="primary" disabled>Disabled</Button>
            <Button variant="primary" leftIcon={<span>←</span>}>Left Icon</Button>
            <Button variant="primary" rightIcon={<span>→</span>}>Right Icon</Button>
          </div>
        </section>

        {/* Inputs */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border-color pb-2">Inputs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Default Input" placeholder="Type something..." />
            <Input label="With Helper Text" placeholder="Enter email" helperText="We'll never share your email." />
            <Input label="With Error" placeholder="Invalid input" error="This field is required" />
            <Input label="Disabled" disabled placeholder="Can't type here" />
          </div>
        </section>

        {/* Cards */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border-color pb-2">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>Default Card</Card>
            <Card padding="lg">Large Padding</Card>
            <Card hover>Hover Effect</Card>
          </div>
        </section>

        {/* Toasts */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border-color pb-2">Toasts</h2>
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => addToast('This is an info toast', 'info')}>Info Toast</Button>
            <Button onClick={() => addToast('Success! Operation completed.', 'success', { title: 'Great job' })}>Success Toast</Button>
            <Button onClick={() => addToast('Something went wrong.', 'error', { title: 'Error' })}>Error Toast</Button>
            <Button onClick={() => addToast('Warning: Check this out.', 'warning')}>Warning Toast</Button>
          </div>
        </section>

        {/* Modals */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border-color pb-2">Modals</h2>
          <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
          
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Example Modal">
            <div className="space-y-4">
              <p>This is a modal component. It traps focus and handles escape key.</p>
              <Input label="Modal Input" placeholder="Type inside modal" />
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button onClick={() => { addToast('Action confirmed!', 'success'); setIsModalOpen(false); }}>Confirm</Button>
              </div>
            </div>
          </Modal>
        </section>

        {/* Toggles */}
        <section className="space-y-4">
            <h2 className="text-xl font-semibold border-b border-border-color pb-2">Toggles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Toggle label="Basic Toggle" />
                <Toggle label="Checked State" defaultChecked />
                <Toggle label="With Description" description="This includes helpful context." />
                <Toggle label="Disabled" disabled />
            </div>
        </section>

      </div>
    </div>
  );
}
