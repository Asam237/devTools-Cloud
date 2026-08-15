import { ToolShell } from "@/components/tool-shell";
import { Base64Tool } from "@/components/tools/base64-tool";
import { ColorConverterTool } from "@/components/tools/color-converter-tool";
import { CronGeneratorTool } from "@/components/tools/cron-generator-tool";
import { CsvJsonTool } from "@/components/tools/csv-json-tool";
import { HashGeneratorTool } from "@/components/tools/hash-generator-tool";
import { HtmlEncoderTool } from "@/components/tools/html-encoder-tool";
import { JsonDiffTool } from "@/components/tools/json-diff-tool";
import { JsonFormatterTool } from "@/components/tools/json-formatter-tool";
import { JsonToTypeScriptTool } from "@/components/tools/json-to-typescript-tool";
import { JsonToZodTool } from "@/components/tools/json-to-zod-tool";
import { JwtDecoderTool } from "@/components/tools/jwt-decoder-tool";
import { PasswordGeneratorTool } from "@/components/tools/password-generator-tool";
import { RegexTesterTool } from "@/components/tools/regex-tester-tool";
import { SqlFormatterTool } from "@/components/tools/sql-formatter-tool";
import { TimestampConverterTool } from "@/components/tools/timestamp-converter-tool";
import { ToolSeoSection } from "@/components/tools/tool-seo-section";
import { ToolUsageTracker } from "@/components/tools/tool-usage-tracker";
import { UrlEncoderTool } from "@/components/tools/url-encoder-tool";
import { UuidGeneratorTool } from "@/components/tools/uuid-generator-tool";
import { XmlJsonConverterTool } from "@/components/tools/xml-json-converter-tool";
import { YamlJsonConverterTool } from "@/components/tools/yaml-json-converter-tool";
import { TOOL_SEO } from "@/lib/tool-seo";
import { TOOLS, getToolBySlug } from "@/lib/tools-registry";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";

const TOOL_COMPONENTS: Record<string, ComponentType> = {
  "json-formatter": JsonFormatterTool,
  "json-diff": JsonDiffTool,
  "json-to-typescript": JsonToTypeScriptTool,
  "json-to-zod": JsonToZodTool,
  "jwt-decoder": JwtDecoderTool,
  "uuid-generator": UuidGeneratorTool,
  "regex-tester": RegexTesterTool,
  "cron-generator": CronGeneratorTool,
  "timestamp-converter": TimestampConverterTool,
  "base64-encoder": Base64Tool,
  "url-encoder": UrlEncoderTool,
  "sql-formatter": SqlFormatterTool,
  "html-encoder": HtmlEncoderTool,
  "yaml-json-converter": YamlJsonConverterTool,
  "xml-json-converter": XmlJsonConverterTool,
  "hash-generator": HashGeneratorTool,
  "color-converter": ColorConverterTool,
  "csv-json-converter": CsvJsonTool,
  "password-generator": PasswordGeneratorTool,
};

export function generateStaticParams() {
  return TOOLS.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};
  const seo = TOOL_SEO[slug];
  const title = seo?.title ?? tool.name;
  const description = seo?.description ?? tool.shortDescription;
  const url = `/devtools/${tool.slug}`;

  return {
    title,
    description,
    keywords: seo?.keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "DevTools Cloud",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  const Component = TOOL_COMPONENTS[slug];
  if (!tool || !Component) notFound();
  const seo = TOOL_SEO[slug];

  return (
    <ToolShell tool={tool}>
      <ToolUsageTracker slug={tool.slug} name={tool.name} />
      <Component />
      {seo ? <ToolSeoSection seo={seo} /> : null}
    </ToolShell>
  );
}
