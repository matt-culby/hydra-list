'use client';

interface ViewToggleProps {
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
}

export default function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="inline-flex rounded-lg shadow-sm" role="group">
      <button
        type="button"
        className={`px-4 py-2.5 text-sm font-medium rounded-l-lg border focus:ring-2 focus:z-10 focus:ring-primary/30 transition-colors ${
          view === 'grid'
            ? 'bg-primary text-white border-primary shadow-sm'
            : 'bg-color-surface text-color-text border-color-border hover:bg-gray-50'
        }`}
        onClick={() => onViewChange('grid')}
        aria-pressed={view === 'grid'}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 inline-block mr-1.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
        Grid
      </button>
      <button
        type="button"
        className={`px-4 py-2.5 text-sm font-medium rounded-r-lg border focus:ring-2 focus:z-10 focus:ring-primary/30 transition-colors ${
          view === 'list'
            ? 'bg-primary text-white border-primary shadow-sm'
            : 'bg-color-surface text-color-text border-color-border hover:bg-gray-50'
        }`}
        onClick={() => onViewChange('list')}
        aria-pressed={view === 'list'}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 inline-block mr-1.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
        List
      </button>
    </div>
  );
}