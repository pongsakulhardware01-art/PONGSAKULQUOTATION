import React from 'react';

interface LogoEmblemProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'banner-sm' | 'banner-md' | 'banner-lg' | 'watermark';
  variant?: 'full-banner' | 'icon-only' | 'hardware-hex';
  customLogoUrl?: string;
  phone?: string;
}

export const LogoEmblem: React.FC<LogoEmblemProps> = ({
  className = '',
  size = 'banner-md',
  variant = 'full-banner',
  customLogoUrl,
  phone,
}) => {
  // If user has uploaded a custom image logo, display it
  if (customLogoUrl) {
    const imgHeight =
      size === 'sm' || size === 'banner-sm'
        ? 'h-9'
        : size === 'md' || size === 'banner-md'
        ? 'h-13'
        : size === 'lg' || size === 'banner-lg'
        ? 'h-18'
        : size === 'watermark'
        ? 'h-40 max-h-[220px]'
        : 'h-24';

    return (
      <div className={`flex items-center ${className}`}>
        <img
          src={customLogoUrl}
          alt="Company Logo"
          className={`${imgHeight} object-contain max-w-[480px] drop-shadow-xs`}
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  // 1. Official Graphic Mark (Icon Only: Red circle + Beige house + Black stepped structure)
  if (variant === 'icon-only') {
    const iconDim =
      size === 'sm'
        ? 36
        : size === 'md'
        ? 48
        : size === 'lg'
        ? 64
        : size === 'xl'
        ? 80
        : size === 'watermark'
        ? 210
        : 54;

    return (
      <div className={`flex-shrink-0 flex items-center justify-center ${className}`}>
        <svg
          width={iconDim}
          height={iconDim * 0.95}
          viewBox="0 0 156 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-2xs"
        >
          {/* Terracotta/Red Sun Circle (Back Layer) */}
          <circle
            cx="68"
            cy="52"
            r="42"
            fill="#DE5B47"
          />

          {/* Sand/Beige Concrete House Structure (Middle Layer) */}
          <path
            d="M60 160 L60 48 L110 16 L148 42 L148 160 Z"
            fill="#EFE2D3"
          />

          {/* Stepped Black Structure (Front Layer) */}
          <path
            d="M0 160 L0 48 L48 48 L48 98 L96 98 L96 160 Z"
            fill="#111111"
          />
        </svg>
      </div>
    );
  }

  // 2. Hardware Hexagon Variant (Alternative)
  if (variant === 'hardware-hex') {
    const hexDim = size === 'watermark' ? 200 : 44;
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <svg width={hexDim} height={hexDim} viewBox="0 0 100 100" className="drop-shadow-sm flex-shrink-0">
          <defs>
            <linearGradient id="redGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DC2626" />
              <stop offset="100%" stopColor="#991B1B" />
            </linearGradient>
          </defs>
          <polygon
            points="50,4 90,27 90,73 50,96 10,73 10,27"
            fill="url(#redGrad)"
            stroke="#7F1D1D"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <polygon
            points="50,14 82,32 82,68 50,86 18,68 18,32"
            fill="none"
            stroke="#EF4444"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M38 30 V70 M38 30 H56 C63 30, 68 35, 68 42 C68 49, 63 54, 56 54 H38 M54 54 L68 70"
            stroke="#FFFFFF"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
        {size !== 'watermark' && (
          <div>
            <span className="font-bold text-red-700 text-base leading-tight block">
              บจก. พงษ์สกุล ฮาร์ดแวร์
            </span>
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wide">
              Pongsakul Hardware
            </span>
          </div>
        )}
      </div>
    );
  }

  // 3. Official Full Horizontal Banner (Exact Replica from Uploaded Image: Pongsakul Hardware + construction materials)
  const dims =
    size === 'sm' || size === 'banner-sm'
      ? { w: 200, h: 59 }
      : size === 'lg' || size === 'banner-lg'
      ? { w: 320, h: 95 }
      : size === 'watermark'
      ? { w: 540, h: 160 }
      : { w: 260, h: 77 };

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      {/* SVG Vector Exact Reproduction of Official Pongsakul Hardware Logo */}
      <svg
        width={dims.w}
        height={dims.h}
        viewBox="0 0 540 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible drop-shadow-2xs"
      >
        {/* === LEFT EMBLEM GRAPHIC === */}
        <g id="Emblem">
          {/* Terracotta Red Sun Circle */}
          <circle
            cx="68"
            cy="52"
            r="42"
            fill="#DE5B47"
          />

          {/* Warm Beige Building with Pitched Roof */}
          <path
            d="M60 160 L60 48 L110 16 L148 42 L148 160 Z"
            fill="#EFE2D3"
          />

          {/* Solid Black Stepped Structure */}
          <path
            d="M0 160 L0 48 L48 48 L48 98 L96 98 L96 160 Z"
            fill="#111111"
          />
        </g>

        {/* === RIGHT BRAND TYPOGRAPHY === */}
        <g id="Typography">
          {/* Line 1: Pongsakul */}
          <text
            x="166"
            y="66"
            fill="#A62B1E"
            fontFamily="'Prompt', 'Inter', 'Montserrat', -apple-system, sans-serif"
            fontWeight="800"
            fontSize="68"
            letterSpacing="-0.5"
          >
            Pongsakul
          </text>

          {/* Line 2: Hardware */}
          <text
            x="166"
            y="130"
            fill="#A62B1E"
            fontFamily="'Prompt', 'Inter', 'Montserrat', -apple-system, sans-serif"
            fontWeight="800"
            fontSize="68"
            letterSpacing="-0.5"
          >
            Hardware
          </text>

          {/* Line 3: construction materials */}
          <text
            x="346"
            y="156"
            fill="#000000"
            fontFamily="'Prompt', 'Inter', 'Arial', sans-serif"
            fontWeight="700"
            fontSize="18.5"
            letterSpacing="0.2"
            textAnchor="middle"
          >
            construction materials
          </text>
        </g>
      </svg>
    </div>
  );
};
