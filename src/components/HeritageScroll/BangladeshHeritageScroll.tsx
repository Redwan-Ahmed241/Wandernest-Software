import React, { useEffect, useRef, useState } from "react";
import "./BangladeshHeritageScroll.css";

interface SightCardData {
  id: string;
  kicker: string;
  title: string;
  description: string;
  pin: string;
  ariaLabel: string;
}

const sightCardsData: SightCardData[] = [
  {
    id: "sundarbans",
    kicker: "World Heritage",
    title: "Sundarbans",
    description: "World's largest mangrove forest and sanctuary of the Royal Bengal Tiger.",
    pin: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260730_230438_d526b8b6-8a2e-4e3b-9993-3908acae03a7.png",
    ariaLabel: "Open Sundarbans card",
  },
  {
    id: "shat-gombuj",
    kicker: "Historic Bagerhat",
    title: "Shat Gombuj Mosque",
    description: "Iconic 15th-century 60-dome mosque built during the Bengal Sultanate.",
    pin: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260730_230442_140bc25b-b165-4249-904a-f708bff6970e.png",
    ariaLabel: "Open Shat Gombuj Mosque card",
  },
  {
    id: "ahsan-manzil",
    kicker: "Dhaka Landmark",
    title: "Ahsan Manzil",
    description: "The striking Pink Palace of Dhaka anchored along the Buriganga riverbank.",
    pin: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260730_230448_825949c9-ccdb-4857-b4a6-e349eccc9010.png",
    ariaLabel: "Open Ahsan Manzil card",
  },
  {
    id: "coxs-bazar",
    kicker: "Natural Wonder",
    title: "Cox's Bazar",
    description: "The world's longest unbroken natural sandy sea beach stretching 120km.",
    pin: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260730_230438_d526b8b6-8a2e-4e3b-9993-3908acae03a7.png",
    ariaLabel: "Open Cox's Bazar card",
  },
  {
    id: "srimangal",
    kicker: "Tea Capital",
    title: "Srimangal",
    description: "Lush tea estates, Lawachara rain forest, and famous seven-layer tea.",
    pin: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260730_230442_140bc25b-b165-4249-904a-f708bff6970e.png",
    ariaLabel: "Open Srimangal card",
  },
];

export const BangladeshHeritageScroll: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [activeSight, setActiveSight] = useState<number>(sightCardsData.length);
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [isReadyControls, setIsReadyControls] = useState<boolean>(false);

  const originalCount = sightCardsData.length;
  // 3 sets of cloned cards for seamless infinite loop
  const totalCards = sightCardsData.concat(sightCardsData, sightCardsData);

  const stateRef = useRef({
    targetMouseX: 0,
    targetMouseY: 0,
    mouseX: 0,
    mouseY: 0,
    targetScroll: 0,
    smoothScroll: 0,
    initialized: false,
    rafPending: false,
  });

  const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const smoothstep = (e0: number, e1: number, v: number) => {
    const x = clamp((v - e0) / (e1 - e0));
    return x * x * (3 - 2 * x);
  };
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const segmentInOut = (s: number, a: number, b: number, c: number, d: number) => {
    const enter = smoothstep(a, b, s);
    const exit = smoothstep(c, d, s);
    return { enter, exit, active: enter * (1 - exit) };
  };

  const getScrollDistance = () => {
    if (!sectionRef.current) return 0;
    const rect = sectionRef.current.getBoundingClientRect();
    return clamp(-rect.top, 0, sectionRef.current.offsetHeight - window.innerHeight);
  };

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      const state = stateRef.current;
      state.rafPending = false;

      state.targetScroll = getScrollDistance();
      if (!state.initialized || reduceMotion.matches) {
        state.smoothScroll = state.targetScroll;
        state.initialized = true;
      } else {
        state.smoothScroll = lerp(state.smoothScroll, state.targetScroll, 0.14);
      }
      if (Math.abs(state.smoothScroll - state.targetScroll) < 0.08) {
        state.smoothScroll = state.targetScroll;
      }

      state.mouseX = lerp(state.mouseX, state.targetMouseX, 0.12);
      state.mouseY = lerp(state.mouseY, state.targetMouseY, 0.12);

      const smoothScroll = state.smoothScroll;
      const mouseX = state.mouseX;
      const mouseY = state.mouseY;

      const frame2 = segmentInOut(smoothScroll, 560, 900, 1300, 1620);
      const frame3 = segmentInOut(smoothScroll, 1760, 2140, 2540, 2700);
      const progress = clamp(smoothScroll / 2700);
      const introExit = smoothstep(90, 650, smoothScroll);
      const sightsEnterRaw = smoothstep(2760, 3560, smoothScroll);
      const sightsEnter = Math.pow(sightsEnterRaw, 1.55);
      const sightsControlsEnter = smoothstep(3360, 3660, smoothScroll);
      const blurActive = clamp(frame2.active + frame3.active);
      const frame2Opacity = frame2.active * (1 - frame3.enter);
      const splitDrift = Math.pow(frame2.enter, 1.5);
      const panel2Opacity = frame2.active * (1 - frame2.exit);
      const panel3Opacity = frame3.active * (1 - frame3.exit);
      const backScale = 0.76 + progress * 0.2 + frame2.enter * 0.18 + frame3.enter * 0.16;
      const sharedHeroY = progress * -74;
      const sharedHeroScale = progress * 0.23;
      const sightsScreenTop = Math.min(220, Math.max(112, window.innerHeight * 0.19)) - 50;
      const sightsParentTop = window.innerHeight - (window.innerHeight - sightsScreenTop) / backScale;

      setIsReadyControls(sightsControlsEnter > 0.98);

      if (containerRef.current) {
        const style = containerRef.current.style;
        style.setProperty("--mx", (reduceMotion.matches ? 0 : mouseX).toFixed(4));
        style.setProperty("--my", (reduceMotion.matches ? 0 : mouseY).toFixed(4));
        style.setProperty("--back-opacity", (1 - frame2.active * 0.06).toFixed(4));
        style.setProperty("--back-x", `${(mouseX * -12).toFixed(4)}px`);
        style.setProperty("--back-y", `${(mouseY * -4).toFixed(4)}px`);
        style.setProperty("--back-scale", backScale.toFixed(4));
        style.setProperty("--four-y", `${(10 + progress * 10).toFixed(4)}vh`);
        style.setProperty("--four-scale", (0.78 + progress * 0.16).toFixed(4));
        style.setProperty("--bazaar-y", `${(20 - progress * 8).toFixed(4)}vh`);
        style.setProperty("--blur-px", `${(blurActive * 14).toFixed(4)}px`);
        style.setProperty("--back-brightness", (1 - blurActive * 0.255).toFixed(4));
        style.setProperty("--bazaar-blur-px", `${(frame2.active * 14).toFixed(4)}px`);
        style.setProperty("--bazaar-brightness", (1 - frame2.active * 0.255 - frame3.active * 0.06).toFixed(4));
        style.setProperty("--bazaar-saturation", (1 + frame3.active * 0.18).toFixed(4));
        style.setProperty("--shade-opacity", "1");
        style.setProperty("--shade-z", frame2.active > 0.02 ? "2" : "0");
        style.setProperty("--shade-top-alpha", (blurActive * 0.465).toFixed(4));
        style.setProperty("--shade-mid-alpha", (blurActive * 0.42).toFixed(4));
        style.setProperty("--shade-bottom-alpha", (blurActive * 0.51).toFixed(4));
        style.setProperty("--title-y", `${(introExit * -210).toFixed(4)}px`);
        style.setProperty("--title-scale", (1 - introExit * 0.08).toFixed(4));
        style.setProperty("--title-opacity", (1 - introExit).toFixed(4));
        style.setProperty("--bridge-x", `calc(-50% + ${(mouseX * 18).toFixed(4)}px)`);
        style.setProperty("--bridge-y", `${(mouseY * 8 + sharedHeroY - frame2.exit * 760).toFixed(4)}px`);
        style.setProperty("--bridge-bottom", `${(5 - frame2.enter * 13).toFixed(4)}vh`);
        style.setProperty("--bridge-width", `${(67.2 + frame2.enter * 37.8).toFixed(4)}vw`);
        style.setProperty("--bridge-scale", (1.02 + sharedHeroScale + frame2.exit * 0.46).toFixed(4));
        style.setProperty("--split-left-x", `calc(-50% + ${(-splitDrift * 46).toFixed(4)}vw + ${(mouseX * 22).toFixed(4)}px)`);
        style.setProperty("--split-left-y", `${(mouseY * 10 + sharedHeroY - splitDrift * 180).toFixed(4)}px`);
        style.setProperty("--split-left-scale", (1 + sharedHeroScale + frame2.enter * 0.74).toFixed(4));
        style.setProperty("--split-right-x", `calc(-50% + ${(splitDrift * 46).toFixed(4)}vw + ${(mouseX * 22).toFixed(4)}px)`);
        style.setProperty("--split-right-y", `${(mouseY * 10 + sharedHeroY - splitDrift * 180).toFixed(4)}px`);
        style.setProperty("--split-right-scale", (1 + sharedHeroScale + frame2.enter * 0.74).toFixed(4));
        style.setProperty("--frame2-opacity", frame2Opacity.toFixed(4));
        style.setProperty("--frame2-x", `calc(-50% + ${(mouseX * 10).toFixed(4)}px)`);
        style.setProperty("--frame2-y", `calc(-50% + ${(mouseY * 8 - frame2.exit * 150).toFixed(4)}px)`);
        style.setProperty("--frame2-scale", (1.06 + frame2.enter * 0.08 + frame2.exit * 0.08).toFixed(4));
        style.setProperty("--intro-copy-y", `${(introExit * 90).toFixed(4)}px`);
        style.setProperty("--intro-copy-opacity", (1 - introExit).toFixed(4));
        style.setProperty("--panel2-opacity", panel2Opacity.toFixed(4));
        style.setProperty("--panel2-y", `calc(-50% + ${(-frame2.exit * 86 + (1 - frame2.enter) * 58).toFixed(4)}px)`);
        style.setProperty("--panel3-opacity", panel3Opacity.toFixed(4));
        style.setProperty("--panel3-y", `calc(-50% + ${(-frame3.exit * 86 + (1 - frame3.enter) * 58).toFixed(4)}px)`);
        style.setProperty("--sights-opacity", sightsEnter.toFixed(4));
        style.setProperty("--sights-controls-opacity", sightsControlsEnter.toFixed(4));
        style.setProperty("--sights-visibility", sightsEnter > 0.01 ? "visible" : "hidden");
        style.setProperty("--sights-y", "0px");
        style.setProperty("--sights-enter-x", `${((1 - sightsEnter) * 420).toFixed(4)}vw`);
        style.setProperty("--sights-scale", (1 / backScale).toFixed(4));
        style.setProperty("--sights-top", `${sightsParentTop.toFixed(4)}px`);
        style.setProperty("--sights-screen-top", `${sightsScreenTop.toFixed(4)}px`);
      }

      if (
        Math.abs(state.smoothScroll - state.targetScroll) > 0.08 ||
        Math.abs(state.mouseX - state.targetMouseX) > 0.001 ||
        Math.abs(state.mouseY - state.targetMouseY) > 0.001
      ) {
        requestTick();
      }
    };

    const requestTick = () => {
      const state = stateRef.current;
      if (!state.rafPending) {
        state.rafPending = true;
        requestAnimationFrame(update);
      }
    };

    const handleScroll = () => requestTick();
    const handleResize = () => requestTick();
    const handlePointerMove = (e: PointerEvent) => {
      const state = stateRef.current;
      state.targetMouseX = e.clientX / window.innerWidth - 0.5;
      state.targetMouseY = e.clientY / window.innerHeight - 0.5;
      requestTick();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    requestTick();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  // Update slider position shift when activeSight changes
  useEffect(() => {
    if (!trackRef.current || !containerRef.current) return;
    const firstCard = trackRef.current.querySelector(".sight-card") as HTMLElement | null;
    if (!firstCard) return;

    const cardWidth = firstCard.offsetWidth;
    const gap = parseFloat(getComputedStyle(trackRef.current).columnGap || "0");
    containerRef.current.style.setProperty("--sights-shift", `${-(cardWidth + gap) * activeSight}px`);
  }, [activeSight]);

  const moveSightSlider = (dir: number) => {
    setActiveSight((prev) => prev + dir);
  };

  const handleTransitionEnd = () => {
    if (activeSight >= originalCount * 2) {
      setIsJumping(true);
      setActiveSight((prev) => prev - originalCount);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsJumping(false));
      });
    } else if (activeSight < originalCount) {
      setIsJumping(true);
      setActiveSight((prev) => prev + originalCount);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsJumping(false));
      });
    }
  };

  return (
    <div className="cinema-scroll-root" ref={containerRef}>
      <section className="cinema-scroll-container" id="cinema" ref={sectionRef} aria-label="Bangladesh cinematic scroll story">
        <div className="stage">
          <div className="world">
            <img className="scene-img sky-img" decoding="async" src="https://raft-blast-61784561.figma.site/_assets/v11/16b5007d9c93971e26ffe4e0e3e37946f6bd538c.png" alt="" />
            <header class="site-header" aria-label="Primary navigation">
              <a className="site-logo" href="#cinema">Wandernest Bangladesh</a>
              <nav className="site-nav" aria-label="Main menu">
                <a href="#cinema">Intro</a>
                <a href="#heritage">Heritage</a>
                <a href="#nature">Nature</a>
                <a href="#destinations">Destinations</a>
              </nav>
              <button className="language-switcher" aria-label="Change language">
                <span>BN / EN</span>
                <span aria-hidden="true">⌄</span>
              </button>
            </header>
            <div className="back-stack">
              <img className="scene-img back-img back-four" decoding="async" src="https://raft-blast-61784561.figma.site/_assets/v11/8a7f8af50e0ce92ec2e228e7b0b4112178c51cf1.png" alt="" />
              <section className="sights-slider" aria-label="Bangladesh sights slider">
                <div
                  className={`sights-track ${isJumping ? "is-jumping" : ""}`}
                  ref={trackRef}
                  onTransitionEnd={handleTransitionEnd}
                >
                  {totalCards.map((card, idx) => (
                    <article
                      key={`${card.id}-${idx}`}
                      className={`sight-card ${idx === activeSight ? "is-active" : ""}`}
                      tabIndex={0}
                      role="button"
                      aria-label={card.ariaLabel}
                      onClick={() => setActiveSight(idx)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setActiveSight(idx);
                        }
                      }}
                    >
                      <span className="sight-kicker">{card.kicker}</span>
                      <img className="sight-pin" src={card.pin} alt="" />
                      <h3>{card.title}</h3>
                      <p>{card.description}</p>
                    </article>
                  ))}
                </div>
              </section>
              <img className="scene-img back-img back-bazaar" decoding="async" src="https://raft-blast-61784561.figma.site/_assets/v11/864afe00e41e2fa20a5aa546e15cb807e0f81384.png" alt="" />
            </div>
            <div className={`sights-controls ${isReadyControls ? "is-ready" : ""}`} aria-label="Slider controls">
              <button className="sight-nav sight-prev" aria-label="Previous sight" onClick={() => moveSightSlider(-1)}>←</button>
              <button className="sight-nav sight-next" aria-label="Next sight" onClick={() => moveSightSlider(1)}>→</button>
            </div>
            <h1 className="hero-title">BANGLADESH</h1>
            <img className="scene-img splitframe-img splitframe-left" decoding="async" src="https://raft-blast-61784561.figma.site/_assets/v11/7536d7b60a1fce482cf6edf3f0bffd3bad5d0f8a.png" alt="" />
            <img className="scene-img splitframe-img splitframe-right" decoding="async" src="https://raft-blast-61784561.figma.site/_assets/v11/392db6a6a6b98e868bd7f8d3f55bb719d51e5028.png" alt="" />
            <img className="scene-img bridge-img" decoding="async" src="https://raft-blast-61784561.figma.site/_assets/v11/c6a6d8ef49bca43f708aa852692942c45ec950d4.png" alt="" />
            <img className="scene-img frame-two-img" decoding="async" src="https://raft-blast-61784561.figma.site/_assets/v11/ba75252bab2b1c510987b74837770f7bc8a6b2d4.png" alt="" />
            <div className="shade"></div>
          </div>
          <section className="intro-copy" aria-label="Bangladesh overview">
            <p>From the world's largest mangrove forest to the longest natural beach, discover centuries of Sultanate, Mughal, and Bengal heritage.</p>
            <div className="hero-tags" aria-label="Bangladesh highlights">
              <span>Sundarbans</span>
              <span>Cox's Bazar</span>
              <span>UNESCO Heritage</span>
            </div>
          </section>
          <section className="story-panel story-panel-bridge" aria-label="Heritage details">
            <h2>Centuries of history along pristine rivers.</h2>
            <p>Ancient mosques, terracotta temples, and royal palaces anchor historic quarters shaped by Bengal Sultanate, Mughal, and European architecture.</p>
            <dl className="facts">
              <div>
                <dt>1459</dt>
                <dd>Shat Gombuj Mosque Completed</dd>
              </div>
              <div>
                <dt>1997</dt>
                <dd>Sundarbans Inscribed by UNESCO</dd>
              </div>
            </dl>
          </section>
          <section className="story-panel story-panel-bazaar" aria-label="Destinations details">
            <h2>Vibrant culture and emerald tea hills.</h2>
            <p>Rolling green tea gardens, floating guava markets, artisan copper lanes, and riverside warmth welcome travelers across Bangladesh.</p>
            <button className="note-button">
              <span aria-hidden="true">↗</span>
              <span>Explore Wandernest Packages</span>
            </button>
          </section>
        </div>
      </section>
    </div>
  );
};

export default BangladeshHeritageScroll;
