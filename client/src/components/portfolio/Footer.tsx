import { Linkedin, Mail, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-border relative" data-testid="footer">
      <div className="absolute inset-0 bg-gradient-to-t from-card/50 to-background" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="font-heading text-xl font-bold text-foreground">
              Gerard <span className="text-primary">Kasza</span>
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="hidden md:inline">Enterprise GTM & Partnerships Executive <span className="text-primary/50">|</span> </span><span className="text-primary">Wealth • Banking • Fintech • Crypto</span>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              asChild
              data-testid="link-linkedin-footer"
            >
              <a href="https://www.linkedin.com/in/gerard-kasza-0x0/" target="_blank" rel="me noopener noreferrer">
                <Linkedin className="w-4 h-4" />
              </a>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              data-testid="button-email-footer"
            >
              <Mail className="w-4 h-4" />
            </Button>
            <Button
              variant="default"
              size="icon"
              onClick={scrollToTop}
              data-testid="button-scroll-top"
            >
              <ArrowUp className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/50 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} Gerard Kasza. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
