import React from 'react';
import { WatermarkStyle } from '../types';

interface WatermarkOverlayProps {
  style?: WatermarkStyle;
  opacity?: number;
  customLogoUrl?: string;
  companyNameEn?: string;
}

export const WatermarkOverlay: React.FC<WatermarkOverlayProps> = ({
  style = 'logo-diagonal',
  opacity = 0.055,
  customLogoUrl,
  companyNameEn = 'Pongsakul Hardware',
}) => {
  if (style === 'none' || opacity <= 0) {
    return null;
  }

  // Safe bounded opacity for full-bleed watermark paper aesthetic
  const safeOpacity = Math.max(0.01, Math.min(0.25, opacity));

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none flex items-center justify-center overflow-hidden z-30"
      style={{ opacity: safeOpacity }}
      aria-hidden="true"
    >
      {/* 1. Custom Logo Upload (Edge-to-edge bleed across page) */}
      {customLogoUrl ? (
        <div
          className={`flex items-center justify-center transition-transform shrink-0 ${
            style === 'logo-center'
              ? 'scale-100'
              : 'transform -rotate-[31deg] -translate-y-8 sm:-translate-y-12'
          }`}
        >
          <img
            src={customLogoUrl}
            alt="Watermark Logo"
            className="w-[920px] sm:w-[980px] max-w-none max-h-[440px] object-contain drop-shadow-none shrink-0"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : style === 'emblem-diagonal' ? (
        /* 2. Emblem Only (Red Sun + Beige Building + Black Steps) */
        <div className="transform -rotate-[24deg] -translate-y-8 flex flex-col items-center shrink-0">
          <svg
            width="420"
            height="420"
            viewBox="0 0 156 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible max-w-none shrink-0"
          >
            {/* Terracotta/Red Sun Circle */}
            <circle cx="68" cy="52" r="42" fill="#DE5B47" />
            {/* Sand/Beige Concrete House Structure */}
            <path d="M60 160 L60 48 L110 16 L148 42 L148 160 Z" fill="#EFE2D3" />
            {/* Stepped Black Structure */}
            <path d="M0 160 L0 48 L48 48 L48 98 L96 98 L96 160 Z" fill="#111111" />
          </svg>
          <span className="mt-4 font-mono font-extrabold tracking-widest text-2xl uppercase text-red-950">
            {companyNameEn}
          </span>
        </div>
      ) : style === 'text-diagonal' ? (
        /* 3. Text Security Ribbon (Edge-to-edge full bleed) */
        <div className="transform -rotate-[31deg] -translate-y-8 border-y-4 border-red-900/40 py-5 px-16 text-center w-[980px] max-w-none shrink-0">
          <div className="text-5xl font-extrabold tracking-[0.25em] font-mono text-stone-900 uppercase">
            PONGSAKUL HARDWARE
          </div>
          <div className="text-sm font-bold tracking-[0.35em] text-red-900 mt-2 uppercase">
            CONSTRUCTION MATERIALS • OFFICIAL DOCUMENT
          </div>
        </div>
      ) : (
        /* 4. Official Full Logo Diagonal - Grand oversized bleed (~980px - 1020px) piercing through edges */
        <div
          className={`flex items-center justify-center transition-transform shrink-0 ${
            style === 'logo-center'
              ? 'scale-100'
              : 'transform -rotate-[31deg] -translate-y-8 sm:-translate-y-12'
          }`}
        >
          {/* Oversized Full-Bleed Pongsakul Hardware Logo Watermark */}
          <svg
            width="1000"
            height="318"
            viewBox="0 0 520 165"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[940px] sm:w-[1000px] max-w-none h-auto overflow-visible shrink-0"
          >
            {/* === LEFT EMBLEM GRAPHIC === */}
            <g id="WatermarkEmblem">
              {/* Terracotta Red Sun Circle */}
              <circle cx="60" cy="50" r="38" fill="#DE5B47" />

              {/* Warm Beige Building with Pitched Roof */}
              <path d="M52 155 L52 46 L96 16 L132 40 L132 155 Z" fill="#EFE2D3" />

              {/* Solid Black Stepped Structure */}
              <path d="M0 155 L0 48 L42 48 L42 94 L84 94 L84 155 Z" fill="#111111" />
            </g>

            {/* === RIGHT BRAND TYPOGRAPHY === */}
            <g id="WatermarkTypography">
              {/* Line 1: Pongsakul */}
              <text
                x="152"
                y="62"
                fill="#A62B1E"
                fontFamily="'Prompt', 'Inter', 'Montserrat', -apple-system, sans-serif"
                fontWeight="800"
                fontSize="58"
                letterSpacing="-0.5"
              >
                Pongsakul
              </text>

              {/* Line 2: Hardware */}
              <text
                x="152"
                y="120"
                fill="#A62B1E"
                fontFamily="'Prompt', 'Inter', 'Montserrat', -apple-system, sans-serif"
                fontWeight="800"
                fontSize="58"
                letterSpacing="-0.5"
              >
                Hardware
              </text>

              {/* Line 3: construction materials */}
              <text
                x="315"
                y="148"
                fill="#111111"
                fontFamily="'Prompt', 'Inter', 'Arial', sans-serif"
                fontWeight="700"
                fontSize="16"
                letterSpacing="0.2"
                textAnchor="middle"
              >
                construction materials
              </text>
            </g>
          </svg>
        </div>
      )}
    </div>
  );
};
