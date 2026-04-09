import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Lightbulb, Sparkles, Zap, Brain, Shield, TrendingUp, Flame } from "lucide-react";

const ideas = [
  {
    id: 1,
    title: "Aether Advisor",
    oneliner: "Ethereal, all-seeing intelligent AI financial advisor replacing the need for human advisors.",
    icon: Brain,
    status: "Concept",
    accent: "primary" as const,
  },
  {
    id: 2,
    title: "Echo Extract",
    oneliner: "Real-time social radar + deep-research engine + emotionless execution bot: finds, confirms, enters, rides, and exits high-conviction moves faster than any human ever could.",
    icon: Zap,
    status: "Researching",
    accent: "neon" as const,
  },
  {
    id: 3,
    title: "Nexus Guardian",
    oneliner: "Autonomous AI risk manager that scans your entire portfolio in real-time, predicts personal financial threats, auto-adjusts hedges/allocations, and alerts only when human override is needed.",
    icon: Shield,
    status: "Concept",
    accent: "primary" as const,
  },
  {
    id: 4,
    title: "Phantom Yield",
    oneliner: "AI that hunts yield opportunities across DeFi, CeFi, bonds, dividend stocks, and options by aggregating obscure social/on-chain signals, then auto-compounds via smart contracts for passive income maxxing.",
    icon: Sparkles,
    status: "Concept",
    accent: "neon" as const,
  },
  {
    id: 5,
    title: "Rift Forecaster",
    oneliner: "Predictive AI for macro event trading: aggregates geopolitical/social/news whispers, forecasts volatility spikes, auto-deploys options/futures positions, focused on black-swan style edges.",
    icon: TrendingUp,
    status: "Concept",
    accent: "primary" as const,
  },
  {
    id: 6,
    title: "Oblivion Debt",
    oneliner: "Ruthless debt-eradication AI: scans credit reports, loans, subscriptions; negotiates rates via API integrations; auto-allocates windfalls; predicts and prevents future debt traps using behavioral + economic signals.",
    icon: Flame,
    status: "Concept",
    accent: "neon" as const,
  },
];

const statusColors = {
  Concept: "bg-primary/10 text-primary/70 border-primary/20",
  Researching: "bg-neon-green/10 text-neon-green/70 border-neon-green/20",
  "In Development": "bg-yellow-500/10 text-yellow-500/70 border-yellow-500/20",
};

export function Ideas() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="ideas"
      className="py-20 md:py-32 relative"
      data-testid="section-ideas"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Ideas for <span className="text-primary">New Projects</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-neon-green mx-auto rounded-full mb-4" />
          <p className="text-muted-foreground">
            Concepts I'm exploring and building toward
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {ideas.map((idea, index) => {
            const Icon = idea.icon;
            const statusClass = statusColors[idea.status as keyof typeof statusColors];
            const iconBg = idea.accent === "neon"
              ? "bg-neon-green/[0.08] border-neon-green/20"
              : "bg-primary/[0.08] border-primary/20";
            const iconColor = idea.accent === "neon" ? "text-neon-green" : "text-primary";

            return (
              <motion.div
                key={idea.id}
                initial={{ opacity: 0, y: 25 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                className="group backdrop-blur-md bg-card/50 border border-border rounded-lg p-5 relative overflow-hidden hover:border-primary/40 transition-all duration-300 hover:-translate-y-0.5"
                data-testid={`idea-item-${idea.id}`}
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-[10px] ${iconBg} border flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4.5 h-4.5 ${iconColor}`} />
                  </div>
                  <span className={`text-[0.65rem] font-medium px-2 py-0.5 rounded-full border ${statusClass}`}>
                    {idea.status}
                  </span>
                </div>

                <h3 className="font-heading text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {idea.title}
                </h3>
                <p className="text-sm text-muted-foreground/70 leading-relaxed">
                  {idea.oneliner}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
