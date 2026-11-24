import { useState } from "react";
import { ChevronDown, Linkedin, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import headshotImage from "@assets/image_1768867819908.webp";
import { profile } from "@shared/profile";
import { DecodeName } from "./DecodeName";
import { MarketTicker } from "./MarketTicker";

export function Hero() {
  const [copied, setCopied] = useState(false);

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText(profile.email).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 lg:pt-24"
      data-testid="section-hero"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 217, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 217, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>
      <div className="absolute top-1/4 left-1/4 w-48 h-48 md:w-96 md:h-96 bg-primary/10 rounded-full blur-2xl md:blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-40 h-40 md:w-80 md:h-80 bg-neon-green/5 rounded-full blur-2xl md:blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center gap-7"
        >
          {/* Subtle live role status badge */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/25 bg-card/65 backdrop-blur-md text-xs text-muted-foreground"
          >
            <span className="w-2 h-2 rounded-full bg-neon-green shadow-[0_0_8px_hsl(var(--neon-green)/0.8)]" aria-hidden="true" />
            <span>
              Strategic Partnerships @ <strong className="text-foreground font-semibold">Array</strong> · Raleigh, NC
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
            className="headshot-container"
          >
            <div className="pulse-ring" />
            <div className="headshot-glow" style={{ width: '100%', height: '100%' }} />
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-neon-green to-primary rounded-full blur-md opacity-50 animate-pulse" />
            <Avatar className="relative w-40 h-40 md:w-52 md:h-52 border-2 border-primary/50 bg-background z-10">
              <AvatarImage
                src={headshotImage}
                alt="Gerard Kasza"
                width={208}
                height={208}
                fetchPriority="high"
              />
              <AvatarFallback className="bg-card text-4xl md:text-5xl font-heading font-bold text-primary">
                GK
              </AvatarFallback>
            </Avatar>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="space-y-4"
          >
            <h1 className="font-heading text-fluid-hero font-bold tracking-tight whitespace-nowrap" aria-label="Gerard Kasza">
              <DecodeName firstName="Gerard" lastName="Kasza" />
            </h1>
            {/* Differentiating tagline */}
            <p className="text-sm sm:text-base md:text-lg font-medium text-[#c1cbd5] max-w-lg mx-auto leading-relaxed">
              I close enterprise deals <span className="text-primary">and</span> build the technology behind them.
            </p>
            {/* Role + verticals */}
            <div className="space-y-1.5">
              <p className="text-xs sm:text-sm md:text-base font-medium text-muted-foreground/70 tracking-wide uppercase">
                Enterprise GTM & Partnerships Executive
              </p>
              <p className="text-sm sm:text-base font-medium">
                <span className="text-primary">Wealth</span>
                <span className="text-muted-foreground/50"> • </span>
                <span className="text-primary">Banking</span>
                <span className="text-muted-foreground/50"> • </span>
                <span className="text-primary">Fintech</span>
                <span className="text-muted-foreground/50"> • </span>
                <span className="text-primary">Crypto</span>
                <span className="text-muted-foreground/50"> • </span>
                <span className="text-primary">Credit</span>
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="w-full max-w-xs sm:max-w-md mx-auto"
          >
            <MarketTicker />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10"
          >
            <Button
              variant="default"
              size="lg"
              className="font-heading min-h-[44px] px-7 text-base shadow-lg shadow-primary/20"
              onClick={() => document.getElementById("recognition")?.scrollIntoView({ behavior: "smooth" })}
              data-testid="button-explore-hero"
            >
              See My Track Record
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              type="button"
              onClick={handleCopyEmail}
              className="min-h-[44px] px-5 bg-card/50 backdrop-blur-sm border-primary/30 hover:border-primary/70 text-foreground"
              data-testid="button-copy-email-hero"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2 text-neon-green" />
                  Copied Email
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2 text-primary" />
                  Copy Email
                </>
              )}
            </Button>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="me noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary/80 hover:text-primary transition-colors min-h-[44px] px-2"
              data-testid="link-linkedin-hero"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </a>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.5 }}
            onClick={scrollToAbout}
            className="text-primary hover:text-neon-green transition-colors duration-300 cursor-pointer"
            aria-label="Scroll to About section"
            data-testid="button-scroll-down"
          >
            <ChevronDown className="w-9 h-9 animate-bounce" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
