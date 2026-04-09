import { Linkedin, Mail, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const quickLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Ideas", href: "#ideas" },
  { label: "Contact", href: "#contact" },
];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavClick = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-border relative" data-testid="footer">
      <div className="absolute inset-0 bg-gradient-to-t from-card/50 to-background" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          {/* Left — Brand */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="font-heading text-xl font-bold text-foreground">
              Gerard <span className="text-primary">Kasza</span>
            </p>
            <p className="text-sm text-muted-foreground text-center md:text-left max-w-xs">
              I close enterprise deals and build the technology behind them.
            </p>
          </div>

          {/* Center — Quick Links */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {quickLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="text-sm text-muted-foreground/60 hover:text-primary transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right — Social */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              asChild
              data-testid="link-linkedin-footer"
            >
              <a href="https://www.linkedin.com/in/gerard-kasza-0x0/" target="_blank" rel="me noopener noreferrer" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
            </Button>
            <Button
              variant="outline"
              size="icon"
              asChild
              data-testid="button-email-footer"
            >
              <a href="mailto:gjkasza@gmail.com" aria-label="Email">
                <Mail className="w-4 h-4" />
              </a>
            </Button>
            <Button
              variant="default"
              size="icon"
              onClick={scrollToTop}
              aria-label="Scroll to top"
              data-testid="button-scroll-top"
            >
              <ArrowUp className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground/50">
            &copy; {currentYear} Gerard Kasza. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/40">
            Designed & built by Gerard Kasza
          </p>
        </div>
      </div>
    </footer>
  );
}
