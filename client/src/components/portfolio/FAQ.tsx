import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { profile } from "@shared/profile";

export function FAQ() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      ref={ref}
      className="py-16 md:py-24 relative"
      data-testid="section-faq"
    >
      <div className="container mx-auto px-6 relative z-10 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="text-[0.7rem] md:text-[0.65rem] font-medium tracking-[0.35em] uppercase text-primary/80 mb-3">
            Quick Answers
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-3">
            Executive <span className="text-primary">Overview</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-neon-green mx-auto rounded-full" />
        </motion.div>

        <div className="space-y-3">
          {profile.faq.map((item, idx) => {
            const isOpen = openIndex === idx;
            const panelId = `faq-panel-${idx}`;
            return (
              <motion.div
                key={item.question}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.08 * idx, duration: 0.45 }}
                className={`backdrop-blur-md bg-card/50 border rounded-lg transition-colors duration-200 ${
                  isOpen ? "border-primary/45" : "border-border hover:border-primary/30"
                }`}
              >
                <h3 className="m-0">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-heading text-sm sm:text-base font-semibold text-foreground hover:text-primary transition-colors"
                    data-testid={`faq-toggle-${idx}`}
                  >
                    <span>{item.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-primary flex-shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  hidden={!isOpen}
                  className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-3"
                >
                  {item.answer}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
