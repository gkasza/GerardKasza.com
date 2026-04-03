export function CircuitBackground() {
  const circuitPaths = [
    { id: 1, d: "M0,100 L150,100 L150,180 L280,180 L280,120 L400,120", dur: "3s", delay: "0s" },
    { id: 2, d: "M0,250 L100,250 L100,320 L200,320 L200,280 L350,280", dur: "3.5s", delay: "0.5s" },
    { id: 3, d: "M0,400 L80,400 L80,450 L180,450 L180,380 L300,380", dur: "2.8s", delay: "1s" },
    { id: 4, d: "M0,550 L120,550 L120,620 L240,620 L240,560 L380,560", dur: "3.2s", delay: "0.3s" },
    { id: 5, d: "M0,700 L90,700 L90,750 L200,750 L200,680 L340,680", dur: "3.8s", delay: "0.8s" },
    { id: 6, d: "M1200,80 L1050,80 L1050,150 L920,150 L920,100 L780,100", dur: "3.3s", delay: "0.2s" },
    { id: 7, d: "M1200,220 L1100,220 L1100,290 L970,290 L970,240 L820,240", dur: "2.9s", delay: "0.7s" },
    { id: 8, d: "M1200,380 L1080,380 L1080,440 L940,440 L940,400 L800,400", dur: "3.6s", delay: "0.4s" },
    { id: 9, d: "M1200,520 L1060,520 L1060,580 L920,580 L920,540 L780,540", dur: "3.1s", delay: "1.2s" },
    { id: 10, d: "M1200,680 L1100,680 L1100,740 L960,740 L960,700 L820,700", dur: "3.4s", delay: "0.6s" },
    { id: 11, d: "M200,0 L200,120 L260,120 L260,200", dur: "2.5s", delay: "0.1s" },
    { id: 12, d: "M400,0 L400,80 L460,80 L460,160 L520,160", dur: "2.8s", delay: "0.9s" },
    { id: 13, d: "M600,0 L600,100 L540,100 L540,180", dur: "2.6s", delay: "0.4s" },
    { id: 14, d: "M800,0 L800,90 L740,90 L740,170 L680,170", dur: "3s", delay: "1.1s" },
    { id: 15, d: "M1000,0 L1000,110 L940,110 L940,190", dur: "2.7s", delay: "0.5s" },
    { id: 16, d: "M180,800 L180,680 L240,680 L240,600", dur: "2.9s", delay: "0.3s" },
    { id: 17, d: "M380,800 L380,720 L440,720 L440,640 L500,640", dur: "3.2s", delay: "0.7s" },
    { id: 18, d: "M580,800 L580,700 L520,700 L520,620", dur: "2.6s", delay: "1s" },
    { id: 19, d: "M780,800 L780,710 L720,710 L720,630 L660,630", dur: "3.1s", delay: "0.2s" },
    { id: 20, d: "M980,800 L980,690 L920,690 L920,610", dur: "2.8s", delay: "0.8s" },
    { id: 21, d: "M450,300 L550,300 L550,380 L650,380 L650,320 L750,320", dur: "3.5s", delay: "0.4s" },
    { id: 22, d: "M420,480 L520,480 L520,540 L620,540 L620,500 L720,500", dur: "3.3s", delay: "0.6s" },
  ];

  const nodes = [
    { cx: 150, cy: 100 }, { cx: 280, cy: 180 }, { cx: 400, cy: 120 },
    { cx: 100, cy: 250 }, { cx: 200, cy: 320 }, { cx: 350, cy: 280 },
    { cx: 80, cy: 400 }, { cx: 180, cy: 450 }, { cx: 300, cy: 380 },
    { cx: 1050, cy: 80 }, { cx: 920, cy: 150 }, { cx: 780, cy: 100 },
    { cx: 1100, cy: 220 }, { cx: 970, cy: 290 }, { cx: 820, cy: 240 },
    { cx: 200, cy: 120 }, { cx: 400, cy: 80 }, { cx: 600, cy: 100 },
    { cx: 800, cy: 90 }, { cx: 550, cy: 300 }, { cx: 650, cy: 380 },
    { cx: 750, cy: 320 }, { cx: 520, cy: 480 }, { cx: 620, cy: 540 },
    { cx: 720, cy: 500 },
  ];

  return (
    <div className="circuit-background" aria-hidden="true">
      <svg
        className="circuit-svg"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          <filter id="glow-intense" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur1" />
            <feGaussianBlur stdDeviation="8" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g className="circuit-base" filter="url(#glow)">
          {circuitPaths.map((path) => (
            <path
              key={`base-${path.id}`}
              d={path.d}
              className="circuit-line-base"
            />
          ))}
          
          {nodes.map((node, i) => (
            <circle
              key={`node-${i}`}
              cx={node.cx}
              cy={node.cy}
              r="3"
              className="circuit-node"
            />
          ))}
        </g>

        <g className="circuit-energy" filter="url(#glow-intense)">
          {circuitPaths.map((path) => (
            <path
              key={`energy-${path.id}`}
              d={path.d}
              className="circuit-line-energy"
              style={{
                animationDuration: path.dur,
                animationDelay: path.delay,
              }}
            />
          ))}
        </g>

        <g className="circuit-junction-pulses">
          {[
            { cx: 400, cy: 120, delay: 0 },
            { cx: 780, cy: 100, delay: 1 },
            { cx: 300, cy: 380, delay: 2 },
            { cx: 820, cy: 400, delay: 1.5 },
            { cx: 550, cy: 300, delay: 0.5 },
            { cx: 720, cy: 500, delay: 2.5 },
          ].map((junction, i) => (
            <circle
              key={`junction-${i}`}
              cx={junction.cx}
              cy={junction.cy}
              r="6"
              className="junction-pulse"
              style={{ animationDelay: `${junction.delay}s` }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
