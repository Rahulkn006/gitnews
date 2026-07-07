"use client";

export function NewsCard({ article, isLead = false }: { article: any; isLead?: boolean }) {
  return (
    <article className={`group border-b border-border py-8 transition-all duration-200 ${isLead ? "pb-10 pt-4" : ""}`}>
      <a href={article.url} className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-6 items-start">
        <div className="flex flex-col gap-2">
          <div className="aspect-[16/10] border border-border bg-muted/40 rounded-md flex items-center justify-center p-3 text-[10px] font-mono text-muted-foreground select-none group-hover:border-primary/40 transition-colors">
            {article.category.toUpperCase()}
          </div>
          <div className="flex flex-col gap-0.5 font-mono text-[9px] text-muted-foreground">
            <span>{article.date}</span>
            <span>{article.source}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 min-w-0">
          <div className="text-[10px] font-mono text-primary uppercase tracking-widest font-bold">
            {article.category} · {isLead ? "Lead Story" : "1 min"}
          </div>
          <h2 className={`font-serif leading-tight tracking-normal text-foreground group-hover:text-primary transition-colors ${
            isLead ? "text-xl md:text-3xl font-extrabold" : "text-lg md:text-xl font-bold"
          }`}>
            {article.title}
          </h2>
          <p className="text-muted-foreground text-xs md:text-sm leading-relaxed font-sans max-w-4xl">
            {article.summary}
          </p>
        </div>
      </a>
    </article>
  );
}
