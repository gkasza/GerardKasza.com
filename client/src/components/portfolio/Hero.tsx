import { ChevronDown, Linkedin, Mail, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import headshotImage from "@assets/image_1768867819908.webp";
import { DecodeName } from "./DecodeName";

export function Hero() {
  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
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
          transition={{ duration: 1.0 }}
          className="flex flex-col items-center gap-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            className="headshot-container"
          >
            <div className="pulse-ring" />
            <div className="headshot-glow" style={{ width: '100%', height: '100%' }} />
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-neon-green to-primary rounded-full blur-md opacity-50 animate-pulse" />
            <Avatar className="relative w-40 h-40 md:w-52 md:h-52 border-2 border-primary/50 bg-background z-10">
              <AvatarImage src={headshotImage} alt="Gerard Kasza" />
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
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.5, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-16"
          >
            <Button
              variant="default"
              size="lg"
              className="font-heading min-h-[44px] px-8 text-base shadow-lg shadow-primary/20"
              onClick={() => document.getElementById("recognition")?.scrollIntoView({ behavior: "smooth" })}
              data-testid="button-explore-hero"
            >
              See My Track Record
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
            <a
              href="https://www.linkedin.com/in/gerard-kasza-0x0/"
              target="_blank"
              rel="me noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary/70 hover:text-primary transition-colors min-h-[44px]"
              data-testid="link-linkedin-hero"
            >
              <Linkedin className="w-4 h-4" />
              Connect on LinkedIn
            </a>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4.0, duration: 0.6 }}
            onClick={scrollToAbout}
            className="text-primary hover:text-neon-green transition-colors duration-300 cursor-pointer"
            aria-label="Scroll to About section"
            data-testid="button-scroll-down"
          >
            <ChevronDown className="w-10 h-10 animate-bounce" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
