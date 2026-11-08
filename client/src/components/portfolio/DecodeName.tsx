import { useEffect, useRef } from "react";

const SYMBOL_SETS = {
  crypto: {
    chars: [
      "₿", "₿", "₿", "₿", "₿", "₿",
      "Ξ", "Ξ", "Ξ", "Ξ",
      "◈", "◈",
      "Λ",
      "Δ", "×", "∞", "⚡", "⬡", "♦", "Σ",
    ],
    css: "char-crypto",
  },
  finance: {
    chars: ["$", "$", "$", "$", "€", "£", "¥", "%", "△"],
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

// Crypto and finance appear ~3x more often than tech/binary
const WEIGHTED_CATEGORIES: (keyof typeof SYMBOL_SETS)[] = [
  "crypto", "crypto", "crypto",
  "finance", "finance", "finance",
  "tech",
  "binary",
];

const WEIGHTED_SETS = WEIGHTED_CATEGORIES.map((c) => SYMBOL_SETS[c]);
const GLITCH_SETS = [SYMBOL_SETS.crypto, SYMBOL_SETS.finance];

const pick = <T,>(items: readonly T[]) => items[Math.floor(Math.random() * items.length)];

function randomSymbol(sets: readonly { chars: string[]; css: string }[] = WEIGHTED_SETS) {
  const set = pick(sets);
  return { char: pick(set.chars), css: set.css };
}

function particleColor(css: string) {
  if (css === "char-crypto") return "rgba(245,180,40,0.5)";
  if (css === "char-finance") return "rgba(80,230,140,0.4)";
  if (css === "char-tech") return "rgba(100,200,240,0.4)";
  return "rgba(100,200,240,0.2)";
}

/** Phases run in this order; the current one is mirrored to `data-phase` on the wrapper. */
export type DecodePhase =
  | "pending"
  | "decoding-first"
  | "decoding-last"
  | "scanning"
  | "tracing"
  | "underlining"
  | "complete";

interface Letter {
  el: HTMLSpanElement;
  scramble: HTMLSpanElement;
  real: HTMLSpanElement;
}

interface Elements {
  wrapper: HTMLDivElement;
  first: HTMLSpanElement;
  last: HTMLSpanElement;
  scanLine: HTMLDivElement;
  underline: HTMLDivElement;
}

function onAbort(signal: AbortSignal, cleanup: () => void, reject: (reason: unknown) => void) {
  const handler = () => {
    cleanup();
    reject(signal.reason);
  };
  signal.addEventListener("abort", handler, { once: true });
  return () => signal.removeEventListener("abort", handler);
}

function wait(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) return reject(signal.reason);
    const id = setTimeout(() => {
      detach();
      resolve();
    }, ms);
    const detach = onAbort(signal, () => clearTimeout(id), reject);
  });
}

/** Calls `tick` every `ms` until it returns true. */
function repeat(ms: number, signal: AbortSignal, tick: () => boolean) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) return reject(signal.reason);
    const id = setInterval(() => {
      if (!tick()) return;
      clearInterval(id);
      detach();
      resolve();
    }, ms);
    const detach = onAbort(signal, () => clearInterval(id), reject);
  });
}

/** Runs `onFrame(progress)` on each animation frame for `duration` ms. */
function animate(duration: number, signal: AbortSignal, onFrame: (progress: number) => void) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) return reject(signal.reason);
    const start = performance.now();
    let id = requestAnimationFrame(function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      onFrame(progress);
      if (progress < 1) {
        id = requestAnimationFrame(frame);
      } else {
        detach();
        resolve();
      }
    });
    const detach = onAbort(signal, () => cancelAnimationFrame(id), reject);
  });
}

const ignoreAbort = () => {};

function setScramble(letter: Letter, sym = randomSymbol()) {
  letter.scramble.dataset.c = sym.char;
  letter.scramble.className = "dn-scramble-char " + sym.css;
}

function showReal(letter: Letter) {
  letter.scramble.style.display = "none";
  letter.real.classList.add("dn-show");
}

function showScramble(letter: Letter) {
  letter.scramble.style.display = "";
  letter.real.classList.remove("dn-show");
}

function createLetters(container: HTMLSpanElement, word: string, wordClass: string): Letter[] {
  container.innerHTML = "";
  return Array.from(word, (c) => {
    const el = document.createElement("span");
    el.className = "dn-letter";

    const sizer = document.createElement("span");
    sizer.className = "dn-sizer";
    sizer.dataset.c = c;

    const scramble = document.createElement("span");
    const real = document.createElement("span");
    real.className = "dn-real-char " + wordClass;
    real.textContent = c;

    el.append(sizer, scramble, real);
    container.appendChild(el);
    const letter = { el, scramble, real };
    setScramble(letter);
    return letter;
  });
}

function spawnParticle(wrapper: HTMLDivElement, letter: Letter) {
  const sym = randomSymbol();
  const particle = document.createElement("span");
  particle.className = "dn-particle";
  particle.dataset.c = sym.char;
  particle.style.color = particleColor(sym.css);

  const rect = letter.el.getBoundingClientRect();
  const wrapperRect = wrapper.getBoundingClientRect();
  particle.style.left = `${rect.left - wrapperRect.left + rect.width / 2}px`;
  particle.style.top = `${rect.top - wrapperRect.top}px`;
  particle.style.setProperty("--drift-x", `${(Math.random() - 0.5) * 30}px`);

  wrapper.appendChild(particle);
  setTimeout(() => particle.remove(), 1400);
}

async function decodeLetter(wrapper: HTMLDivElement, letter: Letter, signal: AbortSignal) {
  const cycles = 5 + Math.floor(Math.random() * 6);
  const speed = 60 + Math.floor(Math.random() * 40);
  let count = 0;
  await repeat(speed, signal, () => {
    setScramble(letter);
    if (count % 2 === 0) spawnParticle(wrapper, letter);
    return ++count >= cycles;
  });
  letter.el.classList.add("decoded");
  showReal(letter);
}

function decodeWord(wrapper: HTMLDivElement, letters: Letter[], signal: AbortSignal) {
  return Promise.all(
    letters.map(async (letter, i) => {
      await wait(i * 130, signal);
      await decodeLetter(wrapper, letter, signal);
    }),
  );
}

function enableIdleEffects(letters: Letter[], signal: AbortSignal) {
  const hovered = new Set<Letter>();

  for (const letter of letters) {
    // One controller per hover transition, so enter/leave cancel each other and unmount cancels both.
    let hover = new AbortController();
    signal.addEventListener("abort", () => hover.abort(), { once: true });
    const nextHover = () => {
      hover.abort();
      hover = new AbortController();
      return hover.signal;
    };

    letter.el.addEventListener(
      "mouseenter",
      () => {
        const hoverSignal = nextHover();
        hovered.add(letter);
        showScramble(letter);
        repeat(70, hoverSignal, () => (setScramble(letter), false)).catch(ignoreAbort);
      },
      { signal },
    );

    letter.el.addEventListener(
      "mouseleave",
      () => {
        const hoverSignal = nextHover();
        let count = 0;
        repeat(50, hoverSignal, () => (setScramble(letter), ++count >= 3))
          .then(() => {
            hovered.delete(letter);
            showReal(letter);
          })
          .catch(ignoreAbort);
      },
      { signal },
    );
  }

  repeat(8000 + Math.random() * 4000, signal, () => {
    const letter = pick(letters);
    if (hovered.has(letter)) return false;
    setScramble(letter, randomSymbol(GLITCH_SETS));
    showScramble(letter);
    wait(120, signal).then(() => showReal(letter), ignoreAbort);
    return false;
  }).catch(ignoreAbort);
}

async function playDecode(
  els: Elements,
  firstName: string,
  lastName: string,
  signal: AbortSignal,
  reduceMotion: boolean,
) {
  const setPhase = (phase: DecodePhase) => {
    els.wrapper.dataset.phase = phase;
  };

  setPhase("pending");
  els.underline.style.width = "0";
  els.wrapper.querySelectorAll(".dn-particle").forEach((p) => p.remove());

  if (reduceMotion) {
    const letters = [
      ...createLetters(els.first, firstName, "dn-gradient-first"),
      ...createLetters(els.last, lastName, "dn-gradient-last"),
    ];
    letters.forEach((l) => {
      l.el.classList.add("decoded");
      showReal(l);
    });
    els.underline.style.width = "100%";
    setPhase("complete");
    return;
  }

  await wait(300, signal);
  const firstLetters = createLetters(els.first, firstName, "dn-gradient-first");
  const lastLetters = createLetters(els.last, lastName, "dn-gradient-last");
  const letters = [...firstLetters, ...lastLetters];

  await wait(500, signal);
  setPhase("decoding-first");
  await decodeWord(els.wrapper, firstLetters, signal);

  await wait(280, signal);
  setPhase("decoding-last");
  await decodeWord(els.wrapper, lastLetters, signal);

  await wait(200, signal);
  setPhase("scanning");
  els.scanLine.style.opacity = "1";
  await animate(900, signal, (p) => {
    const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    els.scanLine.style.left = `${-2 + eased * 104}%`;
  });
  els.scanLine.style.opacity = "0";

  setPhase("tracing");
  for (let i = 0; i < letters.length; i++) {
    if (i > 0) letters[i - 1].real.classList.remove("trace-active");
    letters[i].real.classList.add("trace-active");
    await wait(90, signal);
  }
  letters[letters.length - 1].real.classList.remove("trace-active");
  await wait(150, signal);
  letters.forEach((l, i) => {
    l.real.classList.add("idle-glow");
    l.real.style.animationDelay = `${i * 0.25}s`;
  });

  setPhase("underlining");
  await animate(600, signal, (p) => {
    els.underline.style.width = `${(1 - Math.pow(1 - p, 3)) * 100}%`;
  });

  setPhase("complete");
  enableIdleEffects(letters, signal);
}

interface DecodeNameProps {
  firstName: string;
  lastName: string;
}

export function DecodeName({ firstName, lastName }: DecodeNameProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const firstRef = useRef<HTMLSpanElement>(null);
  const lastRef = useRef<HTMLSpanElement>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = {
      wrapper: wrapperRef.current,
      first: firstRef.current,
      last: lastRef.current,
      scanLine: scanLineRef.current,
      underline: underlineRef.current,
    };
    if (!els.wrapper || !els.first || !els.last || !els.scanLine || !els.underline) return;

    const controller = new AbortController();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    playDecode(els as Elements, firstName, lastName, controller.signal, reduceMotion).catch(ignoreAbort);
    return () => controller.abort();
  }, [firstName, lastName]);

  return (
    <>
      <span className="sr-only">{`${firstName} ${lastName}`}</span>
      <div className="dn-name-wrapper" ref={wrapperRef} data-phase="pending" aria-hidden="true">
        <span className="dn-word" ref={firstRef} />
        <span className="dn-word-space">{" "}</span>
        <span className="dn-word" ref={lastRef} />
        <div className="dn-scan-line" ref={scanLineRef} />
        <div className="dn-underline-trace" ref={underlineRef} />
      </div>
    </>
  );
}
