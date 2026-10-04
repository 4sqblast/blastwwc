"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Clock3, MapPin, HandHeart } from "lucide-react";
import { useRef } from "react";

export default function EventDetails() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  /* =========================================================
     WHEN CARD
  ========================================================= */

  const whenX = useTransform(
    scrollYProgress,
    [0, 0.15, 0.45, 0.7, 1],
    [-500, -80, 0, 80, 500],
  );

  const whenY = useTransform(
    scrollYProgress,
    [0, 0.2, 0.5, 0.75, 1],
    [280, 80, -30, -160, -350],
  );

  const whenRotate = useTransform(
    scrollYProgress,
    [0, 0.2, 0.5, 0.75, 1],
    [-28, -10, 0, 12, 32],
  );

  const whenScale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.5, 0.75, 1],
    [0.45, 0.8, 1, 0.85, 0.45],
  );

  const whenOpacity = useTransform(
    scrollYProgress,
    [0, 0.12, 0.25, 0.75, 0.9, 1],
    [0, 0.7, 1, 1, 0.7, 0],
  );

  const whenSkew = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5, 0.7, 1],
    [-10, -4, 0, 5, 10],
  );

  /* =========================================================
     WHERE CARD
  ========================================================= */

  const whereX = useTransform(
    scrollYProgress,
    [0, 0.15, 0.45, 0.7, 1],
    [550, 100, 0, -100, -550],
  );

  const whereY = useTransform(
    scrollYProgress,
    [0, 0.2, 0.5, 0.75, 1],
    [-250, -60, 40, 180, 400],
  );

  const whereRotate = useTransform(
    scrollYProgress,
    [0, 0.2, 0.5, 0.75, 1],
    [30, 12, 0, -15, -35],
  );

  const whereScale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.5, 0.75, 1],
    [0.4, 0.85, 1.05, 0.85, 0.4],
  );

  const whereOpacity = useTransform(
    scrollYProgress,
    [0, 0.12, 0.25, 0.75, 0.9, 1],
    [0, 0.7, 1, 1, 0.7, 0],
  );

  const whereSkew = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5, 0.7, 1],
    [12, 5, 0, -5, -12],
  );

  /* =========================================================
     VERSE CARD
  ========================================================= */

  const verseX = useTransform(
    scrollYProgress,
    [0, 0.2, 0.45, 0.7, 1],
    [-180, -60, 0, 70, 200],
  );

  const verseY = useTransform(
    scrollYProgress,
    [0, 0.15, 0.4, 0.65, 1],
    [600, 200, 0, -180, -500],
  );

  const verseRotate = useTransform(
    scrollYProgress,
    [0, 0.2, 0.45, 0.7, 1],
    [20, 8, 0, -8, -20],
  );

  const verseScale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.45, 0.65, 1],
    [0.35, 0.75, 1.08, 0.9, 0.5],
  );

  const verseOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.25, 0.75, 0.9, 1],
    [0, 0.6, 1, 1, 0.6, 0],
  );

  /* =========================================================
     SCENE
  ========================================================= */

  const sceneScale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5, 0.7, 1],
    [0.92, 1, 1.02, 1, 0.94],
  );

  const backgroundRotate = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [-3, 0, 3],
  );

  const glowX = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["-20%", "50%", "120%"],
  );

  const scrollIndicatorOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.8, 1],
    [1, 1, 0.5, 0],
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100vh] overflow-hidden"
    >
      <div className="sticky top-0 flex min-h-screen items-center overflow-hidden">
        {/* =====================================================
            BACKGROUND
        ====================================================== */}

        <motion.div
          style={{
            rotate: backgroundRotate,
          }}
          className="pointer-events-none absolute inset-[-20%]"
        >
          <div className="absolute left-[10%] top-[15%] h-40 w-40 rounded-full bg-[#ffd34b]/20 blur-3xl" />

          <div className="absolute right-[5%] top-[40%] h-64 w-64 rounded-full bg-[#1855df]/20 blur-3xl" />

          <motion.div
            style={{
              x: glowX,
            }}
            className="absolute top-[20%] h-[500px] w-[500px] rounded-full bg-[#ffd34b]/10 blur-[120px]"
          />
        </motion.div>

        {/* =====================================================
            MAIN SCENE
        ====================================================== */}

        <motion.div
          style={{
            scale: sceneScale,
          }}
          className="relative mx-auto w-full max-w-6xl px-6"
        >
          {/* Decorative circles */}

          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/5" />

          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/[0.03]" />

          {/* =================================================
              CARDS
          ================================================== */}

          <div className="relative mx-auto h-[620px] max-w-5xl">
            {/* =================================================
                WHEN
            ================================================== */}

            <motion.div
              style={{
                x: whenX,
                y: whenY,
                rotate: whenRotate,
                scale: whenScale,
                opacity: whenOpacity,
                skewX: whenSkew,
              }}
              className="
                absolute
                left-[2%]
                top-[12%]
                z-20
                w-[min(390px,75vw)]
                rounded-[2rem]
                bg-[#e9dfca]
                p-8
                shadow-[0_30px_80px_rgba(0,0,0,0.15)]
                will-change-transform
              "
            >
              <Clock3 className="mb-20 text-[#1855df]" />

              <p className="eyebrow">When</p>

              <p className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                19 — 22 Nov
                <br />
                2026
              </p>

              <div className="mt-8 h-1 w-16 rounded-full bg-[#1855df]" />
            </motion.div>

            {/* =================================================
                WHERE
            ================================================== */}

            <motion.div
              style={{
                x: whereX,
                y: whereY,
                rotate: whereRotate,
                scale: whereScale,
                opacity: whereOpacity,
                skewX: whereSkew,
              }}
              className="
                absolute
                right-[2%]
                top-[18%]
                z-30
                w-[min(420px,78vw)]
                rounded-[2rem]
                bg-[#1855df]
                p-8
                text-white
                shadow-[0_35px_90px_rgba(24,85,223,0.35)]
                will-change-transform
              "
            >
              <MapPin className="mb-20 text-[#ffd34b]" />

              <p className="eyebrow text-white/60">Where</p>

              <p className="mt-2 text-4xl font-bold tracking-tight">
                Blast Arena
              </p>

              <div className="mt-5 border-l-2 border-[#ffd34b]/60 pl-4">
                <p className="text-base font-medium leading-relaxed text-white/90">
                  59 Akinwunmi Street
                </p>

                <p className="text-sm font-medium leading-relaxed text-white/70">
                  Alagomeji-Yaba, Lagos State
                </p>
              </div>

              <div className="mt-8 h-1 w-16 rounded-full bg-[#ffd34b]" />
            </motion.div>

            {/* =================================================
                VERSE
            ================================================== */}

            <motion.div
              style={{
                x: verseX,
                y: verseY,
                rotate: verseRotate,
                scale: verseScale,
                opacity: verseOpacity,
              }}
              className="
                absolute
                bottom-[3%]
                left-1/2
                z-40
                w-[min(700px,90vw)]
                -translate-x-1/2
                rounded-[2rem]
                bg-[#ffd34b]
                p-8
                shadow-[0_35px_100px_rgba(255,211,75,0.3)]
                will-change-transform
                sm:p-10
              "
            >
              <HandHeart className="mb-10 text-[#173fca]" />

              <p className="max-w-2xl font-display text-3xl font-bold leading-tight text-[#173fca] sm:text-4xl lg:text-5xl">
                "And I will pour out my Spirit on all people."
                <span className="mt-3 block text-lg font-semibold text-[#173fca]/70 sm:text-xl">
                  — Joel 2:28
                </span>
              </p>

              <div className="mt-8 h-1 w-20 rounded-full bg-[#173fca]" />
            </motion.div>
          </div>
        </motion.div>

        {/* =====================================================
            SCROLL INDICATOR
        ====================================================== */}

        <motion.div
          style={{
            opacity: scrollIndicatorOpacity,
          }}
          className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-black/40">
            <span>Scroll</span>

            <motion.div
              animate={{
                y: [0, 8, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="h-10 w-px bg-black/30"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
