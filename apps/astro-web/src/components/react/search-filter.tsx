"use client";

interface SearchFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
  filters: string[];
}

export function SearchFilter({
  searchQuery,
  setSearchQuery,
  selectedFilter,
  setSelectedFilter,
  filters,
}: SearchFilterProps) {
  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="relative">
        <input
          type="text"
          placeholder="Search repositories, AI tools, projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-card border border-border hover:border-border/80 focus:border-primary rounded-lg py-2.5 pl-10 pr-4 text-xs font-mono text-foreground placeholder:text-muted-foreground/60 focus:outline-none transition-colors"
        />
        <svg
          className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        {filters.map((filter) => {
          const isSelected = selectedFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-mono border transition-all ${
                isSelected
                  ? "bg-primary text-primary-foreground border-primary font-bold"
                  : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>
    </div>
  );
}
