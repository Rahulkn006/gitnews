"use client";

import Link from "next/link";

interface NewsItem {
  _id?: string;
  id?: string;
  title: string;
  summary: string;
  category: string;
  url: string;
}

interface AiNewsBriefProps {
  items: NewsItem[];
}

export function AiNewsBrief({ items }: AiNewsBriefProps) {
  return (
    <div className="border border-border bg-card/50 p-4">
      <h3 className="mb-4 flex items-center justify-between border-b border-primary/20 pb-2 text-xs font-bold uppercase tracking-widest text-primary">
        <span>📡 AI News Brief</span>
        <span className="h-2 w-2 animate-ping rounded-full bg-primary" />
      </h3>
      <div className="flex flex-col gap-4">
        {items.slice(0, 5).map((story) => (
          <div
            key={story._id || story.id}
            className="border-b border-border/60 pb-3 last:border-0 last:pb-0"
          >
            <span className="mb-1 block w-max rounded border border-border bg-muted px-1.5 py-0.5 text-[8px] font-mono uppercase tracking-wider text-muted-foreground">
              {story.category}
            </span>
            <h4 className="mb-1 text-xs font-bold leading-tight text-foreground transition-colors hover:text-primary">
              <a href={story.url} target="_blank" rel="noreferrer">
                {story.title}
              </a>
            </h4>
            <p className="line-clamp-2 font-sans text-[10px] leading-relaxed text-muted-foreground">
              {story.summary}
            </p>
          </div>
        ))}
      </div>
      <Link
        href="/news"
        className="mt-4 flex items-center gap-1 text-[10px] font-mono text-primary transition-colors hover:underline"
      >
        Read the full AI magazine →
      </Link>
    </div>
  );
}
