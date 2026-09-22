// Original vector artwork: a connected landscape, not a photograph or impact evidence.
export function HeroLandscape() {
  return (
    <div className="hero-landscape" aria-hidden="true">
      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <linearGradient
            id="land-sky"
            x1="0"
            y1="100"
            x2="1600"
            y2="700"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#07396E" />
            <stop offset=".52" stopColor="#116AB4" />
            <stop offset="1" stopColor="#82B6DD" />
          </linearGradient>
          <linearGradient
            id="land-hill"
            x1="870"
            y1="200"
            x2="1200"
            y2="950"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#5CA0CD" />
            <stop offset="1" stopColor="#0E5693" />
          </linearGradient>
          <linearGradient id="land-shade">
            <stop stopColor="#063465" stopOpacity=".88" />
            <stop offset=".55" stopColor="#063465" stopOpacity=".32" />
            <stop offset="1" stopColor="#063465" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="land-glow">
            <stop stopColor="#DBEEFF" stopOpacity=".45" />
            <stop offset="1" stopColor="#DBEEFF" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path d="M0 0h1600v900H0z" fill="url(#land-sky)" />
        <ellipse cx="1290" cy="190" rx="430" ry="360" fill="url(#land-glow)" />
        <path
          d="M400 900C650 620 725 585 916 386S1280 276 1600 508V900Z"
          fill="#8CBBDD"
          fillOpacity=".45"
        />
        <path
          d="M-100 900C440 710 769 206 1030 446S1400 650 1710 262V900Z"
          fill="url(#land-hill)"
        />
        <path
          d="M400 900C710 622 967 406 1180 581S1510 728 1700 536V900Z"
          fill="#17649E"
        />
        <path
          d="M-100 900C276 647 532 573 782 717S1307 845 1670 680V940Z"
          fill="#104B80"
        />
        <g stroke="#B7D9F2" strokeOpacity=".18" strokeWidth="1.5">
          <path d="M678 901C898 579 1101 518 1294 673S1510 728 1650 629" />
          <path d="M630 901C882 558 1094 490 1302 646S1505 700 1650 601" />
          <path d="M576 901C868 538 1086 462 1310 619S1500 672 1650 573" />
          <path d="M524 901C852 518 1078 434 1318 592S1495 644 1650 545" />
          <path d="M470 901C836 498 1070 406 1326 565S1490 616 1650 517" />
        </g>
        <g stroke="#D3EAFE" strokeOpacity=".4" strokeWidth="1.5">
          <path d="m1000 470 156 126 170-142 158 131" />
          <path d="m1156 596 57 172 271-183" />
        </g>
        <g fill="#EAF5FF">
          <circle cx="1000" cy="470" r="5" />
          <circle cx="1156" cy="596" r="6" />
          <circle cx="1326" cy="454" r="5" />
          <circle cx="1484" cy="585" r="5" />
          <circle cx="1213" cy="768" r="4" />
        </g>
        <g stroke="#D3EAFE" strokeOpacity=".35">
          <circle cx="1156" cy="596" r="19" />
          <circle cx="1326" cy="454" r="17" />
        </g>
        <path d="M0 0h1600v900H0z" fill="url(#land-shade)" />
      </svg>
      <span className="landscape-caption">
        Local understanding. Connected possibilities.
      </span>
    </div>
  );
}
