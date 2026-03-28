import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const components: Components = {
  h1: ({ children }) => (
    <h1 className="text-2xl font-display font-bold mt-8 mb-4 text-foreground">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl font-display font-bold mt-7 mb-3 text-foreground border-b border-white/10 pb-2">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-base font-semibold mt-5 mb-2 text-primary">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-sm font-semibold mt-4 mb-2 text-foreground/80">{children}</h4>
  ),
  p: ({ children }) => (
    <p className="text-sm text-muted-foreground leading-relaxed mb-3">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc ml-5 mb-3 space-y-1">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal ml-5 mb-3 space-y-1">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-sm text-muted-foreground leading-relaxed">{children}</li>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-muted-foreground/80">{children}</em>
  ),
  code: ({ className, children, ...props }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs text-primary font-mono" {...props}>
          {children}
        </code>
      );
    }
    return (
      <code className="text-xs font-mono" {...props}>{children}</code>
    );
  },
  pre: ({ children }) => (
    <pre className="bg-white/5 border border-white/10 rounded-lg p-4 text-xs overflow-x-auto my-4 text-muted-foreground font-mono">
      {children}
    </pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-primary/50 pl-4 my-3 text-sm text-muted-foreground italic">
      {children}
    </blockquote>
  ),
  hr: () => (
    <hr className="border-white/10 my-6" />
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
  table: ({ children }) => (
    <div className="overflow-x-auto my-5 rounded-xl border border-white/15 shadow-lg">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-primary/15">{children}</thead>
  ),
  tbody: ({ children }) => (
    <tbody>{children}</tbody>
  ),
  tr: ({ children }) => (
    <tr className="border-t border-white/10 even:bg-white/5 hover:bg-white/8 transition-colors">
      {children}
    </tr>
  ),
  th: ({ children }) => (
    <th className="text-left py-3 px-4 font-semibold text-foreground text-xs uppercase tracking-wider border-b border-white/20 border-r border-white/10 last:border-r-0 whitespace-nowrap">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="py-2.5 px-4 text-muted-foreground text-sm border-r border-white/8 last:border-r-0 align-middle">
      {children}
    </td>
  ),
};

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
