import React from "react";

interface LogoSVGProps {
  className?: string;
  fillColor?: string;
  showText?: boolean;
}

export function LogoSVG({ className = "w-10 h-10", fillColor = "currentColor", showText = false }: LogoSVGProps) {
  // Dynamically set viewBox depending on whether the wordmarks are active or not
  const viewBox = showText ? "0 0 200 280" : "0 0 200 220";

  return (
    <svg
      viewBox={viewBox}
      className={`${className} select-none`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ shapeRendering: "geometricPrecision" }}
    >
      {/* 
        Pruned and highly optimized custom vector path data representing 
        the "Qalbiya" (قلبية) teardrop calligraphy. 
        Engineered for high performance, fast DOM rendering, and flawless scalability.
      */}
      <g fill={fillColor} stroke="none" style={{ vectorEffect: "non-scaling-stroke" }}>
        
        {/* Central vertical calligraphy stem (Alif/Lam) */}
        <path d="M98,22c0,0,10,26,10,51s-11,50-16,70c-4,15-2,30,8,40s27,7,37-5s13-35,7-55s-20-45-22-65c-2-15,4-25,4-25s-8,17-10,30c-2,20,11,40,16,60s2,40-8,50s-24,10-28-5c-4-20,6-45,8-65s-6-60-6-81Z" />

        {/* Left flame boundary stroke */}
        <path d="M98,25c-6,12-21,32-34,47S40,112,40,132s20,55,54,63c-10-6-18-16-26-26s-18-42-14-62S74,62,98,25Z" />
        
        {/* Right flame boundary stroke */}
        <path d="M102,25c6,12,21,32,34,47s24,40,24,60s-20,55-54,63c10-6,18-16,26-26s18-42,14-62s-18-45-42-82Z" />

        {/* Left inner calligraphy glyph loop */}
        <path d="M74,129c6-12,18-17,23-7s-5,27-20,33s-23-3-23-16s8-20,16-24c-3,4-8,10-8,17s8,15,18,10s14-15,10-21s-12-8-16,2Z" />
        
        {/* Underneath sweeping connection stroke */}
        <path d="M54,137c0,0-7,20,3,38s35,27,55,27s42-15,42-35s-7-18-17-18s-17,8-12,16s15,10,15,17s-13,13-28,13s-38-8-45-23s-13-35-13-35Z" />

        {/* Right inner calligraphy loop */}
        <path d="M127,122c7-10,20-13,27-5s6,22-4,32s-26,13-33,3s-5-17,1-23c-3,3-6,10-3,16s15,7,23,0s10-16,4-22s-14-8-17-5Z" />

        {/* Clean, scalable letter-diacritic dots */}
        <circle cx="82" cy="97" r="4.5" />
        <circle cx="94" cy="95" r="4.5" />
        <circle cx="96" cy="179" r="4" />
        <circle cx="108" cy="177" r="4" />
        <circle cx="134" cy="107" r="3.5" />
        <circle cx="144" cy="103" r="3.5" />

        {/* High-fidelity decorative Shaddah indicator */}
        <path d="M104,82c-2-4-1-7,2-7s6,3,4,7c2-4,4-7,7-7s4,3,2,7c2,4,0,7-4,7s-6-3-9-7Z" />

        {/* High-fidelity elegant Fatha glyph accent */}
        <path d="M74,79c8-7,16-10,22-10s4,4-2,10s-14,10-20,10s0-4,4-10Z" />

      </g>

      {/* Elegant Serif Wordmarks rendering */}
      {showText && (
        <g style={{ userSelect: "none" }}>
          <text
            x="100"
            y="242"
            textAnchor="middle"
            fill={fillColor}
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "23px",
              fontWeight: "bold",
              letterSpacing: "0.14em"
            }}
          >
            QALBIYA
          </text>
          <text
            x="100"
            y="266"
            textAnchor="middle"
            fill={fillColor}
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "8px",
              fontWeight: "500",
              letterSpacing: "0.24em"
            }}
          >
            — ISLAMIC INSTITUTE —
          </text>
        </g>
      )}
    </svg>
  );
}
