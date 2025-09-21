// app/building-experience/page.tsx
"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function BuildingExperience() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const doorRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!containerRef.current || !stageRef.current) return;
    // Respect reduced motion
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      const totalScenes = 4; // exterior, approach/open, corridor, elevator
      const pinDuration = window.innerHeight * (totalScenes + 1);

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: () => `+=${pinDuration}`,
          scrub: 0.6,
          pin: true,
        },
      });

      // SCENE 1: exterior -> slight zoom in
      tl.to(stageRef.current, { scale: 1.08, y: -60, duration: 1 }, 0);

      // SCENE 2: approach door (scale door up slightly)
      tl.to(doorRef.current, { scale: 1.6, y: -30, duration: 1 }, 0.6);

      // Door "open" -> fade overlay and reveal inside
      tl.to(".door-overlay", { opacity: 0, pointerEvents: "none", duration: 0.6 }, 1.3);

      // SCENE 3: move "camera" into corridor (translate stage horizontally)
      tl.to(stageRef.current, { x: -220, scale: 1.02, duration: 1.2 }, 1.9);

      // SCENE 4: elevator approach (move up slightly)
      tl.to(stageRef.current, { y: -320, scale: 1.05, duration: 1 }, 3.4);

      // Elevator: animate inner floors visual (this assumes .elevator-floors is a vertical stack)
      tl.to(".elevator-floors", { y: "-200%", duration: 1 }, 4.2);

      tlRef.current = tl;
      ScrollTrigger.refresh();
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Example helper to jump timeline to a label (you can extend to labels)
  function goToFloorTween(progress: number) {
    if (tlRef.current) gsap.to(tlRef.current, { progress, duration: 0.8 });
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Sticky viewport that acts like camera */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div ref={stageRef} className="relative w-full h-full transform-origin-center">
          {/* BACK LAYER: building exterior */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/building.avif')" }}
            aria-hidden
          />

          {/* DOOR (clickable) */}
          <div
            ref={doorRef}
            className="absolute left-1/2 bottom-16 -translate-x-1/2 w-48 h-72 bg-contain bg-center"
            style={{ backgroundImage: "url('/images/door.jpg')" }}
          >
            {/* overlay that fades to reveal inside */}
            <div className="door-overlay absolute inset-0 bg-black/90" />
          </div>

          {/* INSIDE LOBBY (hidden until overlay fades) */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Corridor: left wall with images, right wall with images */}
            <div className="corridor absolute inset-0 flex items-center justify-center">
              {/* left wall */}
              <div className="left-wall w-1/3 h-3/4">
                {/* framed images (hotspots) */}
                <button
                  className="hotspot block mb-4 w-full h-32 bg-cover bg-center"
                  style={{ backgroundImage: "url('/images/project1.jpg')" }}
                  aria-label="Open project 1"
                  onClick={() => window.alert("Go to project 1 (hook up real nav)")}
                />
                <button
                  className="hotspot block mb-4 w-full h-32 bg-cover bg-center"
                  style={{ backgroundImage: "url('/images/project2.jpg" }}
                  aria-label="Open project 2"
                />
              </div>

              {/* center corridor visual */}
              <div className="center-space w-1/3 h-full flex items-center justify-center">
                <div className="elevator w-36 h-56 bg-gray-800/50 flex flex-col items-center justify-center rounded">
                  <div className="elevator-indicator mb-2">Floor</div>
                  <div className="elevator-floors relative h-40 overflow-hidden">
                    <div className="floor h-8">Contact</div>
                    <div className="floor h-8">About</div>
                    <div className="floor h-8">Projects</div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => goToFloorTween(0.9)}
                      aria-label="Go to Contact"
                      className="px-2 py-1 rounded bg-white/10"
                    >
                      1
                    </button>
                    <button
                      onClick={() => goToFloorTween(0.65)}
                      aria-label="Go to About"
                      className="px-2 py-1 rounded bg-white/10"
                    >
                      2
                    </button>
                    <button
                      onClick={() => goToFloorTween(0.4)}
                      aria-label="Go to Projects"
                      className="px-2 py-1 rounded bg-white/10"
                    >
                      3
                    </button>
                  </div>
                </div>
              </div>

              {/* right wall */}
              <div className="right-wall w-1/3">
                {/* more framed images */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* big spacer to allow scrolling; tune depending on total scenes */}
      <div style={{ height: "450vh" }} />
    </div>
  );
}
