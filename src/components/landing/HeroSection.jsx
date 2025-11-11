import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import LandingPageHeroImage from '../../assets/landing-hero.png';
import TryWorldPreviewPng from '../../assets/preview.png';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [ctaEngaged, setCtaEngaged] = useState(false);
  const [ctaTextLeft, setCtaTextLeft] = useState(false);
  const [ctaLatched, setCtaLatched] = useState(false);
  const disengageTimeoutRef = useRef(null);
  const alignTimeoutRef = useRef(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const styleId = 'hero-try-world-enhancements';
    const existingStyle = document.getElementById(styleId);
    const styleEl = existingStyle || document.createElement('style');
    styleEl.id = styleId;
    styleEl.innerHTML = `
        @keyframes tryWorldPulse {
          0%   { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 193, 120, 0.45); }
          45%  { transform: scale(1.035); box-shadow: 0 0 40px 0 rgba(255, 193, 120, 0.65); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 193, 120, 0); }
        }

        @keyframes nudgeFloat {
          0%   { transform: translate(-50%, 0); }
          50%  { transform: translate(-50%, -6px); }
          100% { transform: translate(-50%, 0); }
        }

        @keyframes heroLightSweep {
          0%   { transform: translateX(-60%); opacity: 0; }
          20%  { opacity: 1; }
          50%  { transform: translateX(60%); opacity: 0; }
          100% { transform: translateX(60%); opacity: 0; }
        }

        .try-world-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.65rem;
          padding: 1.1rem 2.85rem;
          border-radius: 16px;
          font-size: 1.15rem;
          font-weight: 600;
          letter-spacing: 0.01em;
          animation: tryWorldPulse 2.6s ease-in-out infinite;
          transition: transform 0.35s ease, box-shadow 0.35s ease;
          box-shadow: 0 20px 30px rgba(255, 163, 80, 0.35);
          background: linear-gradient(120deg, #ff915a 0%, #ffc46b 50%, #ffd180 100%);
          color: #111827;
        }

        .try-world-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.35), transparent 65%);
          opacity: 0;
          transition: opacity 0.35s ease;
        }

        .try-world-btn:hover,
        .try-world-btn:focus-visible {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 28px 45px rgba(255, 163, 80, 0.45);
        }

        .try-world-btn:hover::before,
        .try-world-btn:focus-visible::before {
          opacity: 1;
        }

        .try-world-btn span.icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
        }

        .nudge {
          position: absolute;
          top: -38px;
          left: 50%;
          transform: translateX(-50%);
          padding: 6px 14px;
          border-radius: 999px;
          background: rgba(14, 31, 46, 0.78);
          color: #f8fafc;
          font-size: 0.72rem;
          letter-spacing: 0.02em;
          white-space: nowrap;
          box-shadow: 0 12px 24px rgba(10, 21, 32, 0.35);
          animation: nudgeFloat 1.9s ease-in-out infinite;
        }

        .try-world-cta {
          position: relative;
        }

        .try-world-sparkles {
          position: absolute;
          pointer-events: none;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 200px;
          height: 200px;
          overflow: visible;
          z-index: 4;
          opacity: 0.95;
        }

        .try-world-sparkles circle {
          filter: drop-shadow(0 0 10px rgba(255, 210, 140, 0.85));
        }

        .preview-card {
          position: relative;
          display: block;
          overflow: hidden;
          border-radius: 24px;
          background: linear-gradient(145deg, rgba(15, 28, 41, 0.55), rgba(15, 28, 41, 0.25));
          backdrop-filter: blur(12px);
          border: 1px solid rgba(148, 163, 184, 0.25);
          box-shadow: 0 28px 60px rgba(12, 20, 31, 0.45);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .preview-card:hover,
        .preview-card:focus-visible {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 32px 70px rgba(12, 20, 31, 0.55);
        }

        .preview-card::after {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(circle at 20% 85%, rgba(255, 255, 255, 0.22), transparent 65%);
          opacity: 0;
          transition: opacity 0.35s ease;
        }

        .preview-card:hover::after,
        .preview-card:focus-visible::after {
          opacity: 1;
        }

        .hero-light-sweep {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.12) 45%, transparent 75%);
          mix-blend-mode: screen;
          animation: heroLightSweep 18s linear infinite;
        }
      `;
    if (!existingStyle) {
      document.head.appendChild(styleEl);
    }
  }, []);

  useEffect(() => {
    if (hasInteracted) {
      setShowNudge(false);
      return undefined;
    }

    const id = setTimeout(() => setShowNudge(true), 7000);
    return () => clearTimeout(id);
  }, [hasInteracted]);

  useEffect(() => {
    let frame = null;

    const handlePointerMove = (event) => {
      const { innerWidth, innerHeight } = window;
      const targetX = ((event.clientX / innerWidth) - 0.5) * 16;
      const targetY = ((event.clientY / innerHeight) - 0.5) * 12;

      if (frame) {
        cancelAnimationFrame(frame);
      }

      frame = requestAnimationFrame(() => {
        setParallax({ x: targetX, y: targetY });
      });
    };

    window.addEventListener('pointermove', handlePointerMove);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (frame) {
        cancelAnimationFrame(frame);
      }
      if (disengageTimeoutRef.current) {
        clearTimeout(disengageTimeoutRef.current);
        disengageTimeoutRef.current = null;
      }
      if (alignTimeoutRef.current) {
        clearTimeout(alignTimeoutRef.current);
        alignTimeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (alignTimeoutRef.current) {
      clearTimeout(alignTimeoutRef.current);
    }
    alignTimeoutRef.current = setTimeout(() => {
      setCtaTextLeft(ctaEngaged || ctaLatched);
      alignTimeoutRef.current = null;
    }, ctaEngaged ? 180 : (ctaLatched ? 0 : 120));

    return () => {
      if (alignTimeoutRef.current) {
        clearTimeout(alignTimeoutRef.current);
        alignTimeoutRef.current = null;
      }
    };
  }, [ctaEngaged, ctaLatched]);

  const handleTryWorldInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
    setShowNudge(false);
  };

  const handleTryWorldEngage = () => {
    handleTryWorldInteraction();
    if (!ctaEngaged) {
      setCtaEngaged(true);
    }
    if (!ctaLatched) {
      setCtaLatched(true);
    }
    if (disengageTimeoutRef.current) {
      clearTimeout(disengageTimeoutRef.current);
      disengageTimeoutRef.current = null;
    }
  };

  const handleTryWorldDisengage = () => {
    if (ctaLatched) {
      return;
    }
    if (disengageTimeoutRef.current) {
      clearTimeout(disengageTimeoutRef.current);
    }
    disengageTimeoutRef.current = setTimeout(() => {
      setCtaEngaged(false);
      disengageTimeoutRef.current = null;
    }, 160);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={LandingPageHeroImage}
          alt="Edify Engine virtual universe backdrop" 
          className="w-full h-full object-cover"
          draggable="false"
        />
      </div>
      <div className="hero-light-sweep" aria-hidden="true"></div>
      
      {/* Hero Content */}
      <div className="relative z-10 w-full px-6 lg:px-10">
        <div
          className={`mx-auto max-w-6xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          style={{ transform: `translate3d(${parallax.x * 0.25}px, ${parallax.y * 0.2}px, 0)` }}
        >
          <div
            className={`flex flex-col-reverse lg:flex-row gap-12 items-center lg:items-start transition-all duration-500 ${
              ctaEngaged ? 'lg:gap-16' : ''
            }`}
          >
            <div
              className={`flex-1 text-white max-w-2xl transition-all duration-500 transform ${
                ctaEngaged ? 'lg:translate-x-0' : 'lg:translate-x-10'
              } ${ctaTextLeft ? 'text-left lg:text-left' : 'text-center lg:text-center'}`}
              style={{
                marginInline: ctaTextLeft ? undefined : 'auto',
                alignSelf: ctaTextLeft ? 'stretch' : 'center',
              }}
            >
              <h1
                className="text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight mb-6"
                style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
              >
                <span
                  className="text-white font-bold"
                  style={{
                    textShadow: `
                      -2px -2px 0 #648DA6,
                      2px -2px 0 #648DA6,
                      -2px 2px 0 #648DA6,
                      2px 2px 0 #648DA6,
                      -1px -1px 0 #648DA6,
                      1px -1px 0 #648DA6,
                      -1px 1px 0 #648DA6,
                      1px 1px 0 #648DA6
                    `,
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
                  }}
                >
                  Build Your
                </span>
                <span
                  className="block bg-[#4B748B] bg-clip-text text-transparent font-extrabold"
                  style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
                >
                  Virtual Universe
                </span>
              </h1>
              <p
                className={`text-xl md:text-2xl mb-8 max-w-3xl text-[#4B748B] leading-relaxed font-light transition-all duration-500 ${
                  ctaEngaged ? 'mx-0' : 'mx-auto'
                }`}
                style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
              >
                Create immersive 3D experiences, virtual worlds, and interactive environments without writing a single line of code. Launch in minutes, not months.
              </p>

              <div
                className={`flex flex-col items-center gap-6 transition-all duration-500 transform ${
                  ctaEngaged ? 'lg:items-start lg:translate-x-0' : 'lg:items-center lg:translate-x-6'
                }`}
              >
                <div
                  className={`flex flex-col sm:flex-row sm:items-center gap-4 w-full transition-all duration-500 ${
                    ctaEngaged ? 'justify-center lg:justify-start' : 'justify-center'
                  }`}
                >
                  <div
                    className={`try-world-cta relative flex flex-col items-center transition-all duration-500 transform ${
                      ctaEngaged ? 'lg:items-start lg:translate-x-0' : 'lg:items-center'
                    }`}
                  >
                    {showNudge && (
                      <div className="nudge">
                        10 seconds till liftoff - blink and you’ll miss it
                      </div>
                    )}
                    <a
                      href="https://try.edifyengine.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="try-world-btn focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1c29] focus-visible:ring-[#ffd180]"
                      onMouseEnter={handleTryWorldEngage}
                      onFocus={handleTryWorldEngage}
                      onMouseLeave={handleTryWorldDisengage}
                      onBlur={handleTryWorldDisengage}
                      onClick={handleTryWorldInteraction}
                    >
                      <span className="icon" role="img" aria-hidden="true">🚀</span>
                      <span>Launch Try World Demo</span>
                    </a>
                    <svg
                      className="try-world-sparkles"
                      aria-hidden="true"
                      viewBox="0 0 200 200"
                    >
                      <defs>
                        <radialGradient id="tryWorldSparkGradient" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                          <stop offset="45%" stopColor="#ffe7b8" stopOpacity="0.85" />
                          <stop offset="100%" stopColor="#ffb96a" stopOpacity="0" />
                        </radialGradient>
                      </defs>

                      <circle cx="40" cy="120" r="6" fill="url(#tryWorldSparkGradient)">
                        <animate attributeName="cy" values="120;10" dur="2.3s" repeatCount="indefinite" begin="0s" />
                        <animate attributeName="opacity" values="0;1;0" keyTimes="0;0.35;1" dur="2.3s" repeatCount="indefinite" begin="0s" />
                        <animate attributeName="r" values="6;2" dur="2.3s" repeatCount="indefinite" begin="0s" />
                      </circle>

                      <circle cx="80" cy="125" r="5" fill="url(#tryWorldSparkGradient)">
                        <animate attributeName="cy" values="125;5" dur="2.9s" repeatCount="indefinite" begin="0.4s" />
                        <animate attributeName="opacity" values="0;1;0" keyTimes="0;0.3;1" dur="2.9s" repeatCount="indefinite" begin="0.4s" />
                        <animate attributeName="r" values="5;1.8" dur="2.9s" repeatCount="indefinite" begin="0.4s" />
                      </circle>

                      <circle cx="120" cy="122" r="5.5" fill="url(#tryWorldSparkGradient)">
                        <animate attributeName="cy" values="122;8" dur="2.6s" repeatCount="indefinite" begin="0.8s" />
                        <animate attributeName="opacity" values="0;1;0" keyTimes="0;0.32;1" dur="2.6s" repeatCount="indefinite" begin="0.8s" />
                        <animate attributeName="r" values="5.5;2.2" dur="2.6s" repeatCount="indefinite" begin="0.8s" />
                      </circle>

                      <circle cx="150" cy="118" r="4.5" fill="url(#tryWorldSparkGradient)">
                        <animate attributeName="cy" values="118;0" dur="3.1s" repeatCount="indefinite" begin="1.1s" />
                        <animate attributeName="opacity" values="0;1;0" keyTimes="0;0.32;1" dur="3.1s" repeatCount="indefinite" begin="1.1s" />
                        <animate attributeName="r" values="4.5;1.5" dur="3.1s" repeatCount="indefinite" begin="1.1s" />
                      </circle>

                      <circle cx="100" cy="130" r="6" fill="url(#tryWorldSparkGradient)">
                        <animate attributeName="cy" values="130;12" dur="3s" repeatCount="indefinite" begin="1.5s" />
                        <animate attributeName="opacity" values="0;1;0" keyTimes="0;0.3;1" dur="3s" repeatCount="indefinite" begin="1.5s" />
                        <animate attributeName="r" values="6;2.5" dur="3s" repeatCount="indefinite" begin="1.5s" />
                      </circle>

                      <circle cx="60" cy="123" r="4" fill="url(#tryWorldSparkGradient)">
                        <animate attributeName="cy" values="123;6" dur="2.4s" repeatCount="indefinite" begin="1.8s" />
                        <animate attributeName="opacity" values="0;1;0" keyTimes="0;0.28;1" dur="2.4s" repeatCount="indefinite" begin="1.8s" />
                        <animate attributeName="r" values="4;1.2" dur="2.4s" repeatCount="indefinite" begin="1.8s" />
                      </circle>

                      <circle cx="135" cy="128" r="5" fill="url(#tryWorldSparkGradient)">
                        <animate attributeName="cy" values="128;10" dur="2.7s" repeatCount="indefinite" begin="2.1s" />
                        <animate attributeName="opacity" values="0;1;0" keyTimes="0;0.29;1" dur="2.7s" repeatCount="indefinite" begin="2.1s" />
                        <animate attributeName="r" values="5;1.8" dur="2.7s" repeatCount="indefinite" begin="2.1s" />
                      </circle>
                    </svg>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link 
                      to="/signin" 
                      className="bg-gradient-to-r from-[#42677D] to-[#5E8EA9] hover:from-[#355263] hover:to-[#4a7a8f] text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                    >
                      <i className="fas fa-tools mr-2"></i>
                      <span style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
                        Start Building Now
                      </span>
                    </Link>
                    <Link 
                      to="/store" 
                      className="bg-gradient-to-r from-[#65707C] to-[#767E88] backdrop-blur-sm text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 hover:from-[#65707C]/80 hover:to-[#767E88]/80 hover:shadow-lg hover:shadow-[#65707C]/25 active:from-[#65707C]/60 active:to-[#767E88]/60 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#65707C] focus:ring-offset-2 focus:ring-offset-transparent"
                    >
                      <i className="fas fa-store mr-2"></i>
                      <span style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
                        Browse Store
                      </span>
                    </Link>
                  </div>
                </div>

              </div>
            </div>

            <a
              href="https://try.edifyengine.com"
              target="_blank"
              rel="noopener noreferrer"
              className="preview-card w-full max-w-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1c29] focus-visible:ring-[#88c0ff]"
              tabIndex={ctaEngaged ? undefined : -1}
              aria-hidden={!ctaEngaged}
              style={{
                transform: `translate3d(${parallax.x * 0.55}px, ${parallax.y * 0.45}px, 0) scale(${ctaEngaged ? 1 : 0.92})`,
                opacity: ctaEngaged ? 1 : 0,
                pointerEvents: ctaEngaged ? 'auto' : 'none',
                maxWidth: ctaEngaged ? '26rem' : '0px',
                width: ctaEngaged ? '100%' : '0px',
                marginInlineStart: ctaEngaged ? undefined : '0',
                transition: 'transform 0.55s ease, opacity 0.55s ease, max-width 0.55s ease, width 0.55s ease',
                visibility: ctaEngaged ? 'visible' : 'hidden',
              }}
              onMouseEnter={handleTryWorldEngage}
              onMouseLeave={handleTryWorldDisengage}
              onFocus={handleTryWorldEngage}
              onBlur={handleTryWorldDisengage}
              onClick={handleTryWorldInteraction}
            >
              <div className="relative overflow-hidden rounded-2xl aspect-[4/5] bg-[#0b1825]">
                <img
                  src={TryWorldPreviewPng}
                  alt="Preview of the Try World experience"
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1c29] via-transparent to-transparent z-10 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-20">
                  <div className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.18em] text-white/75 mb-2">
                    <span className="inline-flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
                    Live Preview
                  </div>
                  <h3 className="text-2xl font-semibold">Inside Try World</h3>
                  <p className="text-white/80 mt-2 text-sm">
                    What your demo looks like
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-[6rem] left-1/2 transform -translate-x-1/4 animate-bounce">
        <svg 
          className="w-12 h-12" 
          fill="white" 
          stroke="#4B748B" 
          strokeWidth="1"
          viewBox="0 0 24 24"
        >
          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;