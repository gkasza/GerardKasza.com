import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { CircuitBackground } from "@/components/CircuitBackground";
import { privacy } from "@shared/privacy";

const URL_PATTERN = /(https:\/\/\S+?)(?=[.,]?(\s|$))/g;

function withLinks(text: string) {
  return text.split(URL_PATTERN).map((part, i) =>
    part.startsWith("https://") ? (
      <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
        {part}
      </a>
    ) : (
      part
    ),
  );
}

export default function Privacy() {
  useEffect(() => {
    const previous = document.title;
    document.title = `${privacy.title} | Gerard Kasza`;
    window.scrollTo(0, 0);
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <CircuitBackground />
      <main className="relative z-10 container mx-auto px-6 py-16 max-w-3xl" data-testid="page-privacy">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to gerardkasza.com
        </Link>
        <h1 className="font-heading text-4xl font-bold mt-8 mb-2">{privacy.title}</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: {privacy.updated}</p>
        <p className="text-muted-foreground leading-relaxed mb-10">{privacy.intro}</p>
        {privacy.sections.map((section) => (
          <section key={section.heading} className="mb-8">
            <h2 className="font-heading text-xl font-semibold mb-3 text-foreground">{section.heading}</h2>
            {section.paragraphs.map((p) => (
              <p key={p} className="text-muted-foreground leading-relaxed">
                {withLinks(p)}
              </p>
            ))}
          </section>
        ))}
      </main>
    </div>
  );
}
