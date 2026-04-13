import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useEffect, useState, useCallback } from "react";
import { Trophy, Newspaper, DollarSign, Activity } from "lucide-react";

const stats = [
  { target: 42, suffix: "%", label: "YoY Revenue Growth" },
  { target: 124, suffix: "%", label: "Quota Attainment" },
  { target: 50, suffix: "+", label: "Enterprise Projects" },
  { target: 17, suffix: "", label: "Years in FinServ" },
];

const achievements = [
  {
    label: "Record Client Migration",
    meta: "2026 · Envestnet Yodlee",
    icon: Activity,
    color: "deal" as const,
  },
  {
    label: "2nd-Largest Wealth Deal Ever",
    meta: "2025 · Envestnet Yodlee",
    icon: DollarSign,
    color: "deal" as const,
  },
  {
    label: "Employee of the Year",
    meta: "2018 · Envestnet Tamarac",
    icon: Trophy,
    color: "trophy" as const,
  },
  {
    label: "Historic Recruiting Record",
    meta: "2014 · Mutual of Omaha",
    icon: Trophy,
    color: "trophy" as const,
  },
];

function CountUp({
  target,
  suffix,
  inView,
}: {
  target: number;
  suffix: string;
  inView: boolean;
}) {
  const [value, setValue] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;
    const duration = 1500;
    const start = performance.now();

    function update(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }, [inView, target]);

  const display =
    suffix === "%" ? `${value}%` : suffix === "+" ? `${value}+` : `${value}`;

  return <span>{display}</span>;
}

export function Recognition() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-50px" });

  return (
    <section
      id="recognition"
      className="py-20 md:py-32 relative"
      data-testid="section-recognition"
      ref={sectionRef}
    >
      {/* Top/bottom border lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-[0.7rem] md:text-[0.65rem] font-medium tracking-[0.35em] uppercase text-primary/50 mb-3">
            Track Record
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold">
            Recognition & <span className="text-primary">Results</span>
          </h2>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex justify-center gap-8 md:gap-12 flex-wrap mb-14"
        >
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-8 md:gap-12">
              {i > 0 && (
                <div className="hidden md:block w-px h-12 bg-gradient-to-b from-transparent via-primary/25 to-transparent" />
              )}
              <div className="text-center min-w-[120px] group/stat">
                <div className="font-heading text-4xl md:text-5xl font-bold bg-gradient-to-br from-primary to-neon-green bg-clip-text text-transparent leading-none mb-1.5 transition-transform duration-300 group-hover/stat:scale-110">
                  <CountUp
                    target={stat.target}
                    suffix={stat.suffix}
                    inView={statsInView}
                  />
                </div>
                <div className="text-xs font-medium text-muted-foreground/75 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Featured Cards */}
        <div className="grid md:grid-cols-2 gap-5 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="group backdrop-blur-md bg-card/50 border border-border rounded-lg p-8 relative overflow-hidden hover:border-primary/40 transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="w-11 h-11 rounded-[10px] bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-5">
              <Trophy className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-[0.7rem] md:text-[0.65rem] font-semibold tracking-[0.12em] uppercase text-primary/50 mb-2.5">
              2023 & 2024
            </p>
            <h3 className="font-heading text-xl font-semibold text-foreground mb-2.5 leading-tight">
              Back-to-Back Sales Leader of the Year
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Two years running. Named 2023 Wealth Sales Leader of the Year, then
              2024 Yodlee Sales Leader of the Year — recognized for consistent top
              performance across enterprise banking, wealth, and fintech accounts.
            </p>
            <span className="inline-flex items-center gap-1.5 mt-4 text-xs font-medium text-primary/60">
              Envestnet / Yodlee
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="group backdrop-blur-md bg-card/50 border border-border rounded-lg p-8 relative overflow-hidden hover:border-primary/40 transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="w-11 h-11 rounded-[10px] bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
              <Newspaper className="w-5 h-5 text-primary" />
            </div>
            <p className="text-[0.7rem] md:text-[0.65rem] font-semibold tracking-[0.12em] uppercase text-primary/50 mb-2.5">
              2025 — Press Feature
            </p>
            <h3 className="font-heading text-xl font-semibold text-foreground mb-2.5 leading-tight">
              Featured on WealthManagement.com
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Advisor Signals — a concept I originated and prototyped, later developed
              into Yodlee Advisor Insights — was recognized by the industry's leading
              wealth management publication for innovation in held-away asset intelligence.
            </p>
            <a
              href="https://www.wealthmanagement.com/financial-technology/the-future-of-advice-intelligent-signals-for-home-offices-advisors-and-consumers"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-4 text-xs font-medium text-primary/60 hover:text-primary transition-colors"
            >
              WealthManagement.com
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
          </motion.div>
        </div>

        {/* Achievement Strip */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-primary/[0.06] rounded-[10px] overflow-hidden"
        >
          {achievements.map((item, i) => {
            const Icon = item.icon;
            const iconClasses =
              item.color === "trophy"
                ? "bg-yellow-500/[0.08] text-yellow-500/70"
                : "bg-neon-green/[0.08] text-neon-green/70";

            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                className="bg-background hover:bg-card/40 transition-colors duration-300 p-4 md:p-5 flex flex-col items-center text-center md:flex-row md:text-left gap-2.5 md:gap-4"
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${iconClasses}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-heading text-[0.8rem] md:text-sm font-semibold text-foreground/85 leading-tight">
                    {item.label}
                  </p>
                  <p className="text-[0.65rem] md:text-[0.7rem] text-muted-foreground/75 mt-0.5">
                    {item.meta}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
