import { useEffect, useRef, useCallback } from "react";

const SYMBOL_SETS = {
  crypto: {
    chars: [
      "\u20BF", "\u20BF", "\u20BF", "\u20BF",
      "\u039E", "\u039E", "\u039E", "\u039E",
      "\u25C8", "\u25C8", "\u25C8",
      "\u039B", "\u039B",
      "\u0394", "\u00D7", "\u221E", "\u26A1", "\u2B21", "\u2666", "\u03A3",
    ],
    css: "char-crypto",
  },
  finance: {
    chars: ["$", "$", "\u20AC", "\u00A3", "\u00A5", "%", "\u25B3"],
    css: "char-finance",
  },
  tech: {
    chars: ["{", "}", "<", ">", "#", "@", "|"],
    css: "char-tech",
  },
  binary: {
    chars: ["0", "1", "A", "B", "C", "D", "E", "F"],
    css: "char-binary",
  },
};

const ALL_CATEGORIES = Object.keys(SYMBOL_SETS) as (keyof typeof SYMBOL_SETS)[];

function randomSymbol() {
  const cat = ALL_CATEGORIES[Math.floor(Math.random() * ALL_CATEGORIES.length)];
  const set = SYMBOL_SETS[cat];
  const char = set.chars[Math.floor(Math.random() * set.chars.length)];
  return { char, css: set.css };
}

function particleColor(css: string) {
  if (css === "char-crypto") return "rgba(245,180,40,0.5)";
  if (css === "char-finance") return "rgba(80,230,140,0.4)";
  if (css === "char-tech") return "rgba(100,200,240,0.4)";
  return "rgba(100,200,240,0.2)";
}

interface DecodeNameProps {
  firstName: string;
  lastName: string;
}

export function DecodeName({ firstName, lastName }: DecodeNameProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const firstRef = useRef<HTMLSpanElement>(null);
  const lastRef = useRef<HTMLSpanElement>(null);
  const underlineRef = useRef<HTMLDivElement>(null);
  const effectComplete = useRef(false);
  const allLettersRef = useRef<HTMLSpanElement[]>([]);
  const microGlitchRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasRunRef = useRef(false);

  const createLetters = useCallback((container: HTMLSpanElement, word: string, wordClass: string) => {
    container.innerHTML = "";
    const letters: HTMLSpanElement[] = [];
    for (let i = 0; i < word.length; i++) {
      const span = document.createElement("span");
      span.className = "dn-letter";

      // Invisible sizing text
      const sizer = document.createElement("span");
      sizer.className = "dn-sizer";
      sizer.textContent = word[i];
      span.appendChild(sizer);

      // Scramble character (visible during decode)
      const scrambleEl = document.createElement("span");
      scrambleEl.className = "dn-scramble-char";
      const sym = randomSymbol();
      scrambleEl.textContent = sym.char;
      scrambleEl.classList.add(sym.css);
      span.appendChild(scrambleEl);

      // Real character (hidden until decoded)
      const realEl = document.createElement("span");
      realEl.className = "dn-real-char " + wordClass;
      realEl.textContent = word[i];
      span.appendChild(realEl);

      container.appendChild(span);
      letters.push(span);
    }
    return letters;
  }, []);

  const spawnParticle = useCallback((letter: HTMLSpanElement) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const sym = randomSymbol();
    const particle = document.createElement("span");
    particle.className = "dn-particle";
    particle.textContent = sym.char;
    particle.style.color = particleColor(sym.css);

    const rect = letter.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();
    particle.style.left = `${rect.left - wrapperRect.left + rect.width / 2}px`;
    particle.style.top = `${rect.top - wrapperRect.top}px`;
    particle.style.setProperty("--drift-x", `${(Math.random() - 0.5) * 30}px`);

    wrapper.appendChild(particle);
    setTimeout(() => particle.remove(), 1400);
  }, []);

  const scrambleLetter = useCallback(
    (letter: HTMLSpanElement, callback?: () => void) => {
      const scrambleEl = letter.querySelector(".dn-scramble-char") as HTMLSpanElement;
      const realEl = letter.querySelector(".dn-real-char") as HTMLSpanElement;
      const cycles = 5 + Math.floor(Math.random() * 6);
      const speed = 60 + Math.floor(Math.random() * 40);
      let count = 0;

      const interval = setInterval(() => {
        const sym = randomSymbol();
        scrambleEl.textContent = sym.char;
        scrambleEl.className = "dn-scramble-char " + sym.css;
        if (count % 2 === 0) spawnParticle(letter);
        count++;
        if (count >= cycles) {
          clearInterval(interval);
          letter.classList.add("decoded");
          scrambleEl.style.display = "none";
          realEl.classList.add("dn-show");
          if (callback) callback();
        }
      }, speed);
    },
    [spawnParticle]
  );

  const setupHoverScramble = useCallback((letter: HTMLSpanElement) => {
    let hoverInterval: ReturnType<typeof setInterval> | null = null;

    letter.addEventListener("mouseenter", () => {
      if (!letter.classList.contains("decoded") || !effectComplete.current) return;
      const scrambleEl = letter.querySelector(".dn-scramble-char") as HTMLSpanElement;
      const realEl = letter.querySelector(".dn-real-char") as HTMLSpanElement;
      scrambleEl.style.display = "";
      realEl.classList.remove("dn-show");

      hoverInterval = setInterval(() => {
        const sym = randomSymbol();
        scrambleEl.textContent = sym.char;
        scrambleEl.className = "dn-scramble-char " + sym.css;
      }, 70);
    });

    letter.addEventListener("mouseleave", () => {
      if (hoverInterval) {
        clearInterval(hoverInterval);
        hoverInterval = null;
      }
      const scrambleEl = letter.querySelector(".dn-scramble-char") as HTMLSpanElement;
      const realEl = letter.querySelector(".dn-real-char") as HTMLSpanElement;
      let resolveCount = 0;
      const resolveInterval = setInterval(() => {
        const sym = randomSymbol();
        scrambleEl.textContent = sym.char;
        scrambleEl.className = "dn-scramble-char " + sym.css;
        resolveCount++;
        if (resolveCount >= 3) {
          clearInterval(resolveInterval);
          scrambleEl.style.display = "none";
          realEl.classList.add("dn-show");
        }
      }, 50);
    });
  }, []);

  const drawUnderline = useCallback((onComplete?: () => void) => {
    const underline = underlineRef.current;
    if (!underline) return;
    underline.style.width = "0";
    const duration = 600;
    const start = performance.now();

    function animate(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      underline!.style.width = `${eased * 100}%`;
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        if (onComplete) onComplete();
      }
    }
    requestAnimationFrame(animate);
  }, []);

  const runScanLine = useCallback((onComplete?: () => void) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const scanLine = wrapper.querySelector(".dn-scan-line") as HTMLElement;
    if (!scanLine) return;
    scanLine.style.opacity = "1";
    scanLine.style.left = "-2%";
    const duration = 900;
    const start = performance.now();

    function animate(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      scanLine.style.left = `${-2 + eased * 104}%`;
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        scanLine.style.opacity = "0";
        if (onComplete) onComplete();
      }
    }
    requestAnimationFrame(animate);
  }, []);

  const runCircuitTrace = useCallback(
    (allLetters: HTMLSpanElement[], onComplete?: () => void) => {
      let i = 0;
      function traceNext() {
        if (i > 0) {
          const prevReal = allLetters[i - 1].querySelector(".dn-real-char") as HTMLElement;
          if (prevReal) prevReal.classList.remove("trace-active");
        }
        if (i < allLetters.length) {
          const curReal = allLetters[i].querySelector(".dn-real-char") as HTMLElement;
          if (curReal) curReal.classList.add("trace-active");
          i++;
          setTimeout(traceNext, 90);
        } else {
          setTimeout(() => {
            const lastReal = allLetters[allLetters.length - 1].querySelector(".dn-real-char") as HTMLElement;
            if (lastReal) lastReal.classList.remove("trace-active");
            allLetters.forEach((l, idx) => {
              const real = l.querySelector(".dn-real-char") as HTMLElement;
              if (real) {
                real.classList.add("idle-glow");
                real.style.animationDelay = `${idx * 0.25}s`;
              }
            });
            if (onComplete) onComplete();
          }, 150);
        }
      }
      traceNext();
    },
    []
  );

  const startMicroGlitch = useCallback(() => {
    if (microGlitchRef.current) clearInterval(microGlitchRef.current);
    microGlitchRef.current = setInterval(() => {
      if (!effectComplete.current || allLettersRef.current.length === 0) return;
      const idx = Math.floor(Math.random() * allLettersRef.current.length);
      const letter = allLettersRef.current[idx];
      const scrambleEl = letter.querySelector(".dn-scramble-char") as HTMLSpanElement;
      const realEl = letter.querySelector(".dn-real-char") as HTMLSpanElement;
      const glitchSets = [SYMBOL_SETS.crypto, SYMBOL_SETS.finance];
      const set = glitchSets[Math.floor(Math.random() * glitchSets.length)];
      const char = set.chars[Math.floor(Math.random() * set.chars.length)];
      scrambleEl.textContent = char;
      scrambleEl.className = "dn-scramble-char " + set.css;
      scrambleEl.style.display = "";
      realEl.classList.remove("dn-show");
      setTimeout(() => {
        scrambleEl.style.display = "none";
        realEl.classList.add("dn-show");
      }, 120);
    }, 8000 + Math.random() * 4000);
  }, []);

  const runEffect = useCallback(() => {
    const firstEl = firstRef.current;
    const lastEl = lastRef.current;
    const wrapper = wrapperRef.current;
    if (!firstEl || !lastEl || !wrapper) return;

    effectComplete.current = false;
    if (underlineRef.current) underlineRef.current.style.width = "0";
    if (microGlitchRef.current) clearInterval(microGlitchRef.current);
    wrapper.querySelectorAll(".dn-particle").forEach((p) => p.remove());

    const firstLetters = createLetters(firstEl, firstName, "dn-gradient-first");
    const lastLetters = createLetters(lastEl, lastName, "dn-gradient-last");
    const allLetters = [...firstLetters, ...lastLetters];
    allLettersRef.current = allLetters;

    // Phase 1: Decode first name
    setTimeout(() => {
      let firstDecoded = 0;
      firstLetters.forEach((letter, index) => {
        setTimeout(() => {
          scrambleLetter(letter, () => {
            firstDecoded++;
            if (firstDecoded === firstLetters.length) {
              // Beat pause, then decode last name
              setTimeout(() => {
                let lastDecoded = 0;
                lastLetters.forEach((letter2, index2) => {
                  setTimeout(() => {
                    scrambleLetter(letter2, () => {
                      lastDecoded++;
                      if (lastDecoded === lastLetters.length) {
                        setTimeout(() => {
                          runScanLine(() => {
                            runCircuitTrace(allLetters, () => {
                              drawUnderline(() => {
                                effectComplete.current = true;
                                allLetters.forEach((l) => setupHoverScramble(l));
                                startMicroGlitch();
                              });
                            });
                          });
                        }, 200);
                      }
                    });
                  }, index2 * 130);
                });
              }, 280);
            }
          });
        }, index * 130);
      });
    }, 500);
  }, [
    firstName,
    lastName,
    createLetters,
    scrambleLetter,
    runScanLine,
    runCircuitTrace,
    drawUnderline,
    setupHoverScramble,
    startMicroGlitch,
  ]);

  useEffect(() => {
    if (!hasRunRef.current) {
      hasRunRef.current = true;
      const timer = setTimeout(runEffect, 300);
      return () => clearTimeout(timer);
    }
  }, [runEffect]);

  useEffect(() => {
    return () => {
      if (microGlitchRef.current) clearInterval(microGlitchRef.current);
    };
  }, []);

  return (
    <div className="dn-name-wrapper" ref={wrapperRef}>
      <span className="dn-word" ref={firstRef} />
      <span className="dn-word-space" />
      <span className="dn-word" ref={lastRef} />
      <div className="dn-scan-line" />
      <div className="dn-underline-trace" ref={underlineRef} />
    </div>
  );
}
