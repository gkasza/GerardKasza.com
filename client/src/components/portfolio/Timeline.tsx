import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Briefcase, Building, TrendingUp, Award } from "lucide-react";
import { profile } from "@shared/profile";

const icons = [TrendingUp, TrendingUp, Building, Briefcase, Award];

const experiences = profile.experiences.map((e, i) => ({ ...e, id: i + 1, icon: icons[i] ?? Briefcase }));

function renderAchievement(text: string) {
  // Bold key metrics: $amounts, percentages, and counts with units (e.g. "73 new advisors", "50+ enterprise")
  const bolded = text.replace(
    /(\$[\d.]+[MBK]*\+?(?:\s*over\s*\d+\s*years)?|[\d,]+%(?:\s*of\s*target)?|\d+%?\s*and\s*\d+%?\s*YoY|[\d,]+\+\s*enterprise|\$[\d,]+K|\d+\s+new\s+advisors|\d+\s+months)/g,
    '**$1**'
  );

  // Split on **...** markers and bold/link segments
  const parts = bolded.split(/\*\*(.+?)\*\*/g);
  const elements = parts.map((part, i) => {
    if (i % 2 === 1) {
      return <strong key={i} className="text-foreground/90 font-semibold">{part}</strong>;
    }
    if (part.includes("held-away.com")) {
      const [before, after] = part.split("held-away.com");
      return (
        <span key={i}>
          {before}
          <a
            href="https://held-away.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-neon-green transition-colors underline underline-offset-2 inline"
          >
            held-away.com
          </a>
          {after}
        </span>
      );
    }
    return part;
  });

  return <span>{elements}</span>;
}

function TimelineItem({ experience, index }: { experience: typeof experiences[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const Icon = experience.icon;
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      className={`relative flex items-center gap-6 ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
      data-testid={`timeline-item-${experience.id}`}
    >
      <div className={`hidden lg:block w-1/2 ${isEven ? 'text-right pr-8' : 'text-left pl-8'}`}>
        <div className={`backdrop-blur-md bg-card/60 border border-border rounded-lg p-6 hover:border-primary/50 transition-colors duration-300 inline-block text-left ${isEven ? 'ml-auto' : 'mr-auto'}`}>
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span className="text-xs font-mono text-neon-green bg-neon-green/10 px-2 py-1 rounded">{experience.period}</span>
            <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">{experience.location}</span>
          </div>
          <h3 className="font-heading text-xl font-semibold text-foreground mb-1">{experience.title}</h3>
          <div className="text-primary font-medium mb-4 flex items-center gap-2">
            <Building className="w-4 h-4" />
            {experience.companyUrl ? (
              <a href={experience.companyUrl} target="_blank" rel="noopener noreferrer" className="hover:text-neon-green transition-colors underline underline-offset-2">
                {experience.company}
              </a>
            ) : (
              experience.company
            )}
          </div>
          <ul className="space-y-2">
            {experience.achievements.map((achievement, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4 text-neon-green flex-shrink-0 mt-0.5" />
                <span className="flex-1">{renderAchievement(achievement)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative z-10 flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-card border-2 border-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-primary/20 rounded-full blur-md -z-10 animate-pulse" />
      </div>

      <div className="lg:hidden flex-1">
        <div className="backdrop-blur-md bg-card/60 border border-border rounded-lg p-6 hover:border-primary/50 transition-colors duration-300">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span className="text-xs font-mono text-neon-green bg-neon-green/10 px-2 py-1 rounded">{experience.period}</span>
            <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">{experience.location}</span>
          </div>
          <h3 className="font-heading text-xl font-semibold text-foreground mb-1">{experience.title}</h3>
          <div className="text-primary font-medium mb-4 flex items-center gap-2">
            <Building className="w-4 h-4" />
            {experience.companyUrl ? (
              <a href={experience.companyUrl} target="_blank" rel="noopener noreferrer" className="hover:text-neon-green transition-colors underline underline-offset-2">
                {experience.company}
              </a>
            ) : (
              experience.company
            )}
          </div>
          <ul className="space-y-2">
            {experience.achievements.map((achievement, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4 text-neon-green flex-shrink-0 mt-0.5" />
                <span className="flex-1">{renderAchievement(achievement)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={`hidden lg:block w-1/2 ${isEven ? 'pl-8' : 'pr-8'}`} />
    </motion.div>
  );
}

export function Timeline() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="experience"
      className="py-20 md:py-32 relative"
      data-testid="section-experience"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Professional <span className="text-primary">Journey</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            15+ years driving growth across wealth management, banking, fintech, and crypto
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          <div className="absolute left-6 lg:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-b from-primary via-neon-green to-primary" />
            <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-white/30 to-transparent animate-timeline-pulse" />
          </div>
          
          <div className="space-y-12">
            {experiences.map((experience, index) => (
              <TimelineItem key={experience.id} experience={experience} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
