import { CopyButton } from "@/components/copy-button";
import type { ContentBlock } from "@/lib/content-blocks";

export function ContentBody({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="flex flex-col gap-4">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            return (
              <h3 key={index} className="mt-2 text-base font-medium text-foreground">
                {block.text}
              </h3>
            );
          case "paragraph":
            return (
              <p key={index} className="text-sm leading-relaxed text-foreground-muted">
                {block.text}
              </p>
            );
          case "code":
            return (
              <div key={index} className="relative">
                <pre className="overflow-x-auto rounded-lg border border-border bg-background-subtle px-3.5 py-3 pr-20 font-mono text-xs leading-relaxed text-foreground">
                  <code>{block.code}</code>
                </pre>
                <CopyButton value={block.code} className="absolute right-2 top-2" />
              </div>
            );
          case "list":
            return (
              <ul key={index} className="list-disc flex flex-col gap-1.5 pl-5 text-sm leading-relaxed text-foreground-muted">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
