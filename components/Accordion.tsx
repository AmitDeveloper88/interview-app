'use client';

import { useState } from 'react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <details
      open={isOpen}
      onToggle={(e) => setIsOpen((e.target as HTMLDetailsElement).open)}
      className="group rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-800"
    >
      <summary className="flex cursor-pointer items-center justify-between list-none">
        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">{title}</h3>
        <span className={`ml-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </summary>
      <div className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-700">
        {children}
      </div>
    </details>
  );
}