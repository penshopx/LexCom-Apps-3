import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

interface MarkdownRendererProps {
  content: string;
  className?: string;
  compact?: boolean;
}

function buildComponents(compact: boolean): Components {
  const gap = compact ? "mb-2" : "mb-3.5";
  const textSm = compact ? "text-xs" : "text-sm";
  const textBase = compact ? "text-sm" : "text-[14.5px]";

  return {
    h1: ({ children }) => (
      <h1 className={`font-display font-bold leading-tight text-foreground mt-6 mb-3 pb-2 border-b border-white/15 ${compact ? "text-lg" : "text-2xl"}`}>
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className={`font-display font-bold leading-tight text-foreground mt-5 mb-2.5 pb-1.5 border-b border-white/10 ${compact ? "text-base" : "text-xl"}`}>
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className={`font-semibold leading-snug text-primary mt-4 mb-2 ${compact ? "text-sm" : "text-base"}`}>
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className={`font-semibold text-foreground/90 mt-3 mb-1.5 ${compact ? "text-xs" : "text-sm"}`}>
        {children}
      </h4>
    ),
    p: ({ children }) => (
      <p className={`${textBase} text-foreground/90 leading-relaxed ${gap}`}>{children}</p>
    ),
    ul: ({ children }) => (
      <ul className={`ml-5 ${gap} space-y-1.5`} style={{ listStyleType: "disc" }}>{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className={`ml-5 ${gap} space-y-1.5`} style={{ listStyleType: "decimal" }}>{children}</ol>
    ),
    li: ({ children }) => (
      <li className={`${textBase} text-foreground/85 leading-relaxed`}>{children}</li>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic text-foreground/75">{children}</em>
    ),
    code: ({ className, children, ...props }) => {
      const isInline = !className;
      if (isInline) {
        return (
          <code
            className={`bg-primary/15 border border-primary/20 px-1.5 py-0.5 rounded-md ${textSm} text-primary font-mono`}
            {...props}
          >
            {children}
          </code>
        );
      }
      return (
        <code className={`${textSm} font-mono`} {...props}>{children}</code>
      );
    },
    pre: ({ children }) => (
      <pre className={`bg-white/5 border border-white/10 rounded-xl p-4 ${textSm} overflow-x-auto my-4 text-muted-foreground font-mono leading-relaxed`}>
        {children}
      </pre>
    ),
    blockquote: ({ children }) => (
      <blockquote className={`border-l-4 border-primary/60 bg-primary/5 pl-4 pr-3 py-2 my-3 rounded-r-lg ${textBase} text-muted-foreground italic`}>
        {children}
      </blockquote>
    ),
    hr: () => (
      <hr className="border-white/10 my-5" />
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),

    /* ── TABEL (gaya Excel/Sheets) ── */
    table: ({ children }) => (
      <div className="overflow-x-auto my-5 rounded-xl border border-white/20 shadow-xl">
        <table className="w-full text-sm border-collapse min-w-[400px]">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-gradient-to-r from-primary/25 to-secondary/15 border-b-2 border-primary/30">
        {children}
      </thead>
    ),
    tbody: ({ children }) => (
      <tbody className="divide-y divide-white/8">
        {children}
      </tbody>
    ),
    tr: ({ children }) => (
      <tr className="even:bg-white/[0.03] hover:bg-primary/5 transition-colors">
        {children}
      </tr>
    ),
    th: ({ children }) => (
      <th className={`text-left py-3 px-4 font-bold text-foreground ${textSm} uppercase tracking-wider border-r border-white/15 last:border-r-0 whitespace-nowrap bg-transparent`}>
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className={`py-2.5 px-4 ${textBase} text-foreground/85 border-r border-white/8 last:border-r-0 align-middle`}>
        {children}
      </td>
    ),
  };
}

export function MarkdownRenderer({ content, className = "", compact = false }: MarkdownRendererProps) {
  const components = buildComponents(compact);
  return (
    <div className={`markdown-content leading-relaxed ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
