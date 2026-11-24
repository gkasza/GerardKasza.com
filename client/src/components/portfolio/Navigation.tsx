import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Moon, Stars } from "lucide-react";
import { Button } from "@/components/ui/button";
import { applyTheme, getStoredTheme, nextTheme, type Theme } from "@/lib/theme";

const navItems = [
  { label: "Track Record", href: "#recognition", id: "recognition" },
  { label: "About", href: "#about", id: "about" },
  { label: "Experience", href: "#experience", id: "experience" },
  { label: "Projects", href: "#projects", id: "projects" },
  { label: "Ideas", href: "#ideas", id: "ideas" },
  { label: "Contact", href: "#contact", id: "contact" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(getStoredTheme);
  const closeMenuRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 50);
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? Math.min(1, Math.max(0, y / docHeight)) : 0);

      let current = "";
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= 160) current = item.id;
      }
      setActiveSection(current);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => applyTheme(theme), [theme]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const opener = document.activeElement as HTMLElement | null;
    closeMenuRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setIsMobileMenuOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      opener?.focus({ preventScroll: true });
    };
  }, [isMobileMenuOpen]);

  const toggleTheme = () => setTheme(nextTheme);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-lg border-b border-border"
            : "bg-transparent"
        }`}
        data-testid="navigation"
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="font-heading text-lg font-bold text-foreground hover:text-primary transition-colors p-1.5 -m-1.5"
                aria-label="Back to top"
                data-testid="link-logo"
              >
                G<span className="text-primary">K</span>
              </button>
              <button
                onClick={toggleTheme}
                className="text-muted-foreground/40 hover:text-primary transition-colors p-2.5 -m-1.5"
                aria-label={`Switch to ${nextTheme(theme) === "deep-space" ? "deep space" : "midnight"} theme`}
                data-testid="button-theme-toggle"
              >
                {theme === "midnight" ? <Stars className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="hidden md:flex items-center gap-1">
              {navItems.filter(item => item.label !== "Contact").map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item.href)}
                    className={`px-3.5 py-2 text-sm transition-colors rounded-md relative ${
                      isActive
                        ? "text-primary bg-primary/10 font-medium"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                    data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {item.label}
                  </button>
                );
              })}
              <Button
                onClick={() => handleNavClick("#contact")}
                className="ml-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-4"
                data-testid="button-lets-connect"
              >
                Get in Touch
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-foreground"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              data-testid="button-mobile-menu"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
        {/* Subtle cyberpunk reading progress trace */}
        <div
          className="h-[1.5px] bg-gradient-to-r from-primary via-neon-green to-primary transition-[width] duration-75 ease-out"
          style={{ width: `${scrollProgress * 100}%` }}
          aria-hidden="true"
        />
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/90 backdrop-blur-lg z-50"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-card border-l border-border z-50 p-6"
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              data-testid="mobile-menu"
            >
              <div className="flex justify-end mb-8">
                <Button
                  ref={closeMenuRef}
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close menu"
                  data-testid="button-close-menu"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex flex-col gap-2">
                {navItems.filter(item => item.label !== "Contact").map((item, index) => (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleNavClick(item.href)}
                    className="text-left px-4 py-3 text-foreground hover:text-primary hover:bg-primary/5 rounded-md transition-colors font-medium"
                    data-testid={`mobile-nav-${item.label.toLowerCase()}`}
                  >
                    {item.label}
                  </motion.button>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button
                    onClick={() => handleNavClick("#contact")}
                    className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                    data-testid="mobile-button-lets-connect"
                  >
                    Get in Touch
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
