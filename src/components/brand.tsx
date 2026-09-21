import Link from "next/link";

export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 42 42"
      fill="none"
      aria-hidden="true"
    >
      <path d="M2 6h38v10H26v24H16V16H2V6Z" fill="currentColor" />
      <path d="M30 22h10v10H30V22Z" fill="#F2B040" />
    </svg>
  );
}

export function Wordmark() {
  return (
    <Link href="/" className="wordmark">
      <BrandMark />
      <span>
        <strong>
          tunga<span className="brand-dot">.</span>
        </strong>
        <span className="wordmark-caption">TECHNOLOGIES</span>
        <span className="sr-only"> home</span>
      </span>
    </Link>
  );
}

export function ProgressVisual({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`progress-visual ${compact ? "progress-visual-compact" : ""}`}
    >
      <div className="visual-topline">
        <span>ROOTED IN RWANDA</span>
        <span>
          BUILT FOR POSSIBILITY <span aria-hidden="true">↗</span>
        </span>
      </div>
      <svg
        className="landscape-art"
        viewBox="0 0 600 560"
        fill="none"
        role="img"
        aria-label="Original illustration of connected blue terraces, inspired by Rwanda’s hills, rising toward a Tunga monogram."
      >
        <defs>
          <pattern
            id="grid"
            width="36"
            height="36"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-30)"
          >
            <path
              d="M 36 0 L 0 0 0 36"
              stroke="#196ECC"
              strokeWidth=".5"
              opacity=".13"
            />
          </pattern>
          <linearGradient
            id="terrace"
            x1="100"
            y1="200"
            x2="480"
            y2="500"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#196ECC" />
            <stop offset="1" stopColor="#0B315E" />
          </linearGradient>
          <linearGradient
            id="plate"
            x1="160"
            y1="140"
            x2="420"
            y2="350"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#4A94E2" />
            <stop offset="1" stopColor="#196ECC" />
          </linearGradient>
        </defs>
        <path fill="url(#grid)" d="M0 0h600v560H0z" />
        <ellipse
          cx="305"
          cy="410"
          rx="224"
          ry="96"
          fill="#0B315E"
          opacity=".04"
        />
        <path
          d="m62 360 206-117q30-18 61 0l214 123v36q0 15-20 27L331 539q-28 16-56 0L79 426q-17-10-17-25Z"
          fill="#C8DDF4"
        />
        <path
          d="m77 346 191-110q30-18 61 0l198 114q31 18 0 36L331 499q-28 16-56 0L77 384q-32-19 0-38Z"
          fill="#E0EBF7"
          stroke="#AACBED"
        />
        <path
          d="m101 301 169-98q28-16 57 0l175 101v41q0 11-18 22l-154 89q-27 16-54 0l-156-91q-19-11-19-23Z"
          fill="#175EAA"
        />
        <path
          d="m116 283 154-89q28-16 57 0l160 92q29 17 0 34l-157 91q-27 16-54 0l-160-93q-29-17 0-35Z"
          fill="url(#terrace)"
        />
        <path
          d="m147 241 126-72q26-16 54 0l129 74v38q0 10-15 19l-111 64q-27 16-54 0l-114-66q-15-9-15-21Z"
          fill="#0B315E"
        />
        <path
          d="m162 218 111-64q26-16 54 0l115 66q26 15 0 30l-112 65q-27 16-54 0l-114-66q-26-15 0-31Z"
          fill="url(#plate)"
        />
        <path
          d="m187 231 86-49q27-16 54 0l87 50-111 64-116-65Z"
          stroke="white"
          strokeOpacity=".25"
        />
        <path
          d="m219 229 83-48 35 20-28 16 76 44-28 16-76-44-28 16-34-20Z"
          fill="white"
        />
        <path d="m333 220 24-14 24 14-24 14-24-14Z" fill="#F2B040" />
        <path
          d="M304 121V72M160 272l-49 28-59-34M425 307l64-37 58 33M303 408v57"
          stroke="#196ECC"
          strokeWidth="1.5"
          strokeDasharray="4 5"
        />
        <circle cx="304" cy="65" r="7" fill="#F2B040" />
        <circle
          cx="51"
          cy="265"
          r="6"
          fill="white"
          stroke="#196ECC"
          strokeWidth="2"
        />
        <circle
          cx="549"
          cy="303"
          r="6"
          fill="white"
          stroke="#196ECC"
          strokeWidth="2"
        />
        <circle cx="303" cy="472" r="7" fill="#196ECC" />
        <path
          d="m182 110 27-15 27 15v30l-27 16-27-16v-30Z"
          stroke="#196ECC"
          strokeOpacity=".35"
        />
        <path
          d="m182 110 27 16 27-16m-27 16v30"
          stroke="#196ECC"
          strokeOpacity=".35"
        />
        <path
          d="M421 130v28m-14-14h28M91 195v16m-8-8h16"
          stroke="#196ECC"
          strokeOpacity=".45"
        />
      </svg>
      <div className="visual-note">
        <span className="visual-note-icon" aria-hidden="true">
          ↗
        </span>
        <div>
          <strong>Real challenges. Practical progress.</strong>
          <span>People at the heart of every solution.</span>
        </div>
      </div>
      <div className="visual-bottomline">
        <span>LOCAL UNDERSTANDING</span>
        <span className="visual-line" />
        <span>LASTING POSSIBILITY</span>
      </div>
    </div>
  );
}

export function HillsVisual() {
  return (
    <div className="hills-visual" aria-hidden="true">
      <svg viewBox="0 0 650 430" fill="none">
        <circle cx="480" cy="106" r="31" fill="#F2B040" />
        <path d="M0 284Q150 82 325 244T650 199V430H0Z" fill="#DBE9F8" />
        <path d="M0 358Q196 94 390 296T650 288V430H0Z" fill="#6DA5DF" />
        <path d="M0 419Q245 169 480 338T650 349V430H0Z" fill="#196ECC" />
        <path d="M84 430q211-182 566-40v40Z" fill="#0B315E" />
        <g stroke="white" strokeOpacity=".35">
          <path d="M0 381Q196 117 390 319T650 311" />
          <path d="M0 403Q196 139 390 341T650 333" />
          <path d="M62 429Q245 203 480 372T650 383" />
        </g>
      </svg>
      <span>Inspired by a country moving forward.</span>
    </div>
  );
}
