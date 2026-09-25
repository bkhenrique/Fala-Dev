import Link from "next/link";
import ReactMarkdown, { type Components, type ExtraProps } from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { resolverLink } from "@/lib/conteudo/links";
import { ItemTrilha } from "./ItemTrilha";

const schema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), "details", "summary", "sub"],
  attributes: {
    ...defaultSchema.attributes,
    input: [...(defaultSchema.attributes?.input ?? []), ["type", "checkbox"], "checked", "disabled"],
  },
};

type NoHast = { type: string; tagName?: string; properties?: Record<string, unknown>; children?: NoHast[] };

function primeiroHref(no: NoHast | undefined): string | undefined {
  if (!no) return undefined;
  if (no.tagName === "a" && typeof no.properties?.href === "string") return no.properties.href;
  for (const filho of no.children ?? []) {
    const href = primeiroHref(filho);
    if (href) return href;
  }
}

function criarComponentes(arquivo: string): Components {
  return {
    a({ href = "", children, node, ...props }) {
      const destino = resolverLink(href, arquivo);
      if (destino.startsWith("/")) return <Link href={destino} {...props}>{children}</Link>;
      const externo = /^https?:/.test(destino);
      return (
        <a href={destino} {...props} {...(externo ? { target: "_blank", rel: "noreferrer" } : {})}>
          {children}
        </a>
      );
    },
    li({ className, children, node, ...props }: React.ComponentProps<"li"> & ExtraProps) {
      const href = className?.includes("task-list-item") ? primeiroHref(node as NoHast) : undefined;
      if (href) return <ItemTrilha rota={resolverLink(href, arquivo)}>{children}</ItemTrilha>;
      return <li className={className} {...props}>{children}</li>;
    },
    // o checkbox desabilitado do GFM é trocado pelo ItemTrilha
    input: () => null,
    table: ({ node, ...props }) => (
      <div className="overflow-x-auto">
        <table {...props} />
      </div>
    ),
  };
}

export function Markdown({ markdown, arquivo }: { markdown: string; arquivo: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, [rehypeSanitize, schema], rehypeSlug]}
      components={criarComponentes(arquivo)}
    >
      {markdown}
    </ReactMarkdown>
  );
}
