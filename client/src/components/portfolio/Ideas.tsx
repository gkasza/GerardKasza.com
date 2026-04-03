import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Lightbulb } from "lucide-react";

const ideas = [
  {
    id: 1,
    title: "Aether Advisor",
    oneliner: "Ethereal, all-seeing intelligent AI financial advisor replacing the need for human advisors.",
  },
  {
    id: 2,
    title: "Echo Extract",
    oneliner: "Real-time social radar + deep-research engine + emotionless execution bot: finds, confirms, enters, rides, and exits high-conviction moves faster than any human ever could.",
  },
  {
    id: 3,
    title: "Nexus Guardian",
    oneliner: "Autonomous AI risk manager that scans your entire portfolio (investments, debts, insurance, credit) in real-time, predicts personal financial threats, auto-adjusts hedges/allocations, and alerts only when human override is needed.",
  },
  {
    id: 4,
    title: "Phantom Yield",
    oneliner: "AI that hunts yield opportunities across DeFi, CeFi, bonds, dividend stocks, and options by aggregating obscure social/on-chain signals, runs multi-scenario simulations, then auto-compounds via smart contracts or broker APIs for passive income maxxing.",
  },
  {
    id: 5,
    title: "Rift Forecaster",
    oneliner: "Predictive AI for macro event trading: aggregates geopolitical/social/news whispers, forecasts volatility spikes or sector rotations, auto-deploys options/futures positions, exits on predefined profit/risk bands, focused on black-swan style edges.",
  },
  {
    id: 6,
    title: "Oblivion Debt",
    oneliner: "Ruthless debt-eradication AI: scans credit reports, loans, subscriptions; negotiates rates via API integrations or bots; auto-allocates windfalls/extra payments; predicts and prevents future debt traps using behavioral + economic signals.",
  },
];

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
            Concepts I'm working on and exploring
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="border-l-2 border-primary/30 bg-card/50 backdrop-blur-sm rounded-r-lg p-6">
            <ul className="space-y-4">
              {ideas.map((idea, index) => (
                <motion.li
                  key={idea.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  className="flex items-start gap-3"
                  data-testid={`idea-item-${idea.id}`}
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Lightbulb className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <span className="font-heading font-semibold text-foreground">
                      {idea.title}
                    </span>
                    <span className="text-muted-foreground"> / </span>
                    <span className="text-muted-foreground text-sm">
                      {idea.oneliner}
                    </span>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
